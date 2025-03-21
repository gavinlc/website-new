const AWS = require('aws-sdk');
const https = require('https');
const ses = new AWS.SES({ region: 'eu-west-2' });

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 3600; // 1 hour in seconds
const MAX_REQUESTS_PER_WINDOW = 5; // Maximum requests per hour

// Spam protection configuration
const SPAM_KEYWORDS = ['viagra', 'casino', 'lottery', 'winner', 'inheritance', 'bitcoin', 'crypto'];
const MAX_LINKS = 3;
const MAX_CAPITAL_LETTERS = 0.5; // 50% of text

// Verify reCAPTCHA token
async function verifyRecaptcha(token) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            secret: process.env.RECAPTCHA_SECRET_KEY,
            response: token
        });

        const options = {
            hostname: 'www.google.com',
            path: '/recaptcha/api/siteverify',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    resolve(result.success && result.score > 0.5);
                } catch (error) {
                    reject(error);
                }
            });
        });

        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

// Check for spam content
function isSpam(content) {
    // Check for spam keywords
    const lowerContent = content.toLowerCase();
    if (SPAM_KEYWORDS.some(keyword => lowerContent.includes(keyword))) {
        return true;
    }

    // Check for excessive links
    const linkCount = (content.match(/https?:\/\/[^\s]+/g) || []).length;
    if (linkCount > MAX_LINKS) {
        return true;
    }

    // Check for excessive capital letters
    const capitalRatio = (content.match(/[A-Z]/g) || []).length / content.length;
    if (capitalRatio > MAX_CAPITAL_LETTERS) {
        return true;
    }

    return false;
}

exports.handler = async (event) => {
    // Enable CORS
    const headers = {
        'Access-Control-Allow-Origin': event.headers.Origin || event.headers.origin,
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent',
        'Access-Control-Allow-Methods': 'POST,OPTIONS',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Max-Age': 86400
    };

    // Handle OPTIONS request for CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers
        };
    }

    try {
        // Parse the request body
        const body = JSON.parse(event.body);
        const { name, email, message, recaptchaToken } = body;

        // Verify reCAPTCHA token
        if (!recaptchaToken) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    message: 'Invalid request'
                })
            };
        }

        const isValidRecaptcha = await verifyRecaptcha(recaptchaToken);
        if (!isValidRecaptcha) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    message: 'Invalid request'
                })
            };
        }

        // Validate inputs
        if (!name || !email || !message) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    message: 'Please fill in all fields'
                })
            };
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    message: 'Please enter a valid email address'
                })
            };
        }

        // Validate input lengths
        if (name.length > 100 || email.length > 254 || message.length > 5000) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    message: 'Input exceeds maximum length'
                })
            };
        }

        // Check for spam content
        if (isSpam(message) || isSpam(name)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    message: 'Invalid request'
                })
            };
        }

        // Sanitize inputs
        const sanitizedName = name.replace(/[<>]/g, '');
        const sanitizedEmail = email.toLowerCase().trim();
        const sanitizedMessage = message.replace(/[<>]/g, '');

        // Email parameters
        const params = {
            Source: process.env.SENDER_EMAIL,
            Destination: {
                ToAddresses: [process.env.RECIPIENT_EMAIL]
            },
            ReplyToAddresses: [sanitizedEmail],
            Message: {
                Subject: {
                    Data: `New Contact Form Submission from ${sanitizedName}`,
                    Charset: 'UTF-8'
                },
                Body: {
                    Text: {
                        Data: `Name: ${sanitizedName}\nEmail: ${sanitizedEmail}\n\nMessage:\n${sanitizedMessage}`,
                        Charset: 'UTF-8'
                    }
                }
            }
        };

        // Send email using SES
        const result = await ses.sendEmail(params).promise();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Thank you for your message! I will get back to you soon.',
                messageId: result.MessageId
            })
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                message: 'Sorry, there was an error sending your message. Please try again later.'
            })
        };
    }
}; 