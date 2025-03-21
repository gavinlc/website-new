# Contact Form Lambda Function

This AWS Lambda function handles contact form submissions using AWS SES for email delivery.

## Setup Instructions

1. Create an AWS Lambda function:
   - Go to AWS Lambda console
   - Click "Create function"
   - Choose "Author from scratch"
   - Name: "contact-form-handler"
   - Runtime: Node.js 18.x
   - Architecture: x86_64
   - Click "Create function"

2. Configure environment variables:
   - In the Lambda function configuration
   - Add the following environment variables:
     - `SENDER_EMAIL`: Your verified SES email address
     - `RECIPIENT_EMAIL`: The email address to receive form submissions

3. Set up IAM permissions:
   - In the Lambda function configuration
   - Add the following policy to the execution role:
   ```json
   {
       "Version": "2012-10-17",
       "Statement": [
           {
               "Effect": "Allow",
               "Action": [
                   "ses:SendEmail",
                   "ses:SendRawEmail"
               ],
               "Resource": "*"
           }
       ]
   }
   ```

4. Deploy the function:
   - Create a ZIP file containing:
     - emailHandler.js
     - node_modules/ (after running `npm install`)
   - Upload the ZIP file to Lambda

5. Create an API Gateway:
   - Go to API Gateway console
   - Create a new REST API
   - Create a new POST method
   - Integrate it with your Lambda function
   - Enable CORS
   - Deploy the API

6. Update the frontend:
   - Replace 'YOUR_LAMBDA_API_GATEWAY_URL' in script.js with your API Gateway URL

## Testing

You can test the Lambda function using the API Gateway test feature or by submitting the contact form on your website.

## Security Considerations

- The Lambda function includes input validation
- CORS is properly configured
- AWS SES is used for reliable email delivery
- Environment variables are used for sensitive data
- Error handling and logging are implemented

## Maintenance

- Monitor CloudWatch logs for any errors
- Keep the AWS SDK package updated
- Regularly check SES sending limits and quotas 