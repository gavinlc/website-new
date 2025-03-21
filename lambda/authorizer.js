exports.handler = async (event) => {
    // Get the origin from the request
    const origin = event.headers?.origin || event.headers?.Origin;
    
    // List of allowed origins (your website domains)
    const allowedOrigins = [
        'https://gavinlc.co.uk'
    ];

    // Check if the origin is allowed
    if (!allowedOrigins.includes(origin)) {
        return generatePolicy('user', 'Deny', event.methodArn);
    }

    // Generate an IAM policy
    return generatePolicy('user', 'Allow', event.methodArn);
};

const generatePolicy = (principalId, effect, resource) => {
    return {
        principalId: principalId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: effect,
                    Resource: resource
                }
            ]
        }
    };
}; 