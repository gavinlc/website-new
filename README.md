# Portfolio Website

A modern, responsive portfolio website with a serverless contact form using AWS Lambda and SES.

## Features

- Responsive design
- Dark/Light theme toggle
- Smooth scrolling
- Contact form with AWS Lambda backend
- Accessibility features
- Modern animations
- CV download option

## Setup

### Prerequisites

- Node.js 18.x or later
- AWS account with appropriate permissions
- AWS CLI configured with your credentials
- Serverless Framework CLI installed globally:
  ```bash
  npm install -g serverless
  ```

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with your email addresses:
   ```
   SENDER_EMAIL=your-verified-ses-email@example.com
   RECIPIENT_EMAIL=your-email@example.com
   ```

3. Start local development server:
   ```bash
   npm run dev
   ```

### Deployment

1. Deploy to development environment:
   ```bash
   npm run deploy:dev
   ```

2. Deploy to production:
   ```bash
   npm run deploy:prod
   ```

3. View logs:
   ```bash
   npm run logs
   ```

4. Remove deployed resources:
   ```bash
   npm run remove
   ```

### AWS Setup

1. Verify your email address in AWS SES:
   - Go to AWS SES Console
   - Click "Verified Identities"
   - Add your email address
   - Follow the verification link sent to your email

2. Configure AWS credentials:
   ```bash
   aws configure
   ```
   Enter your:
   - AWS Access Key ID
   - AWS Secret Access Key
   - Default region (e.g., eu-west-2)
   - Default output format (json)

3. Update the frontend:
   - After deployment, update the API URL in `script.js`:
   ```javascript
   const response = await fetch('YOUR_API_GATEWAY_URL/send-email', {
     // ... rest of the code
   });
   ```

## Project Structure

```
.
├── index.html          # Main HTML file
├── styles.css         # CSS styles
├── script.js          # Frontend JavaScript
├── lambda/            # Lambda function code
│   ├── emailHandler.js
│   └── package.json
├── serverless.yml     # Serverless Framework config
├── package.json       # Project dependencies
└── .env              # Environment variables
```

## Customization

1. Update personal information in `index.html`
2. Modify styles in `styles.css`
3. Add your own projects to the projects section
4. Update the CV file in the assets folder
5. Customize the color scheme in CSS variables

## Accessibility

The website includes:
- ARIA labels and roles
- Keyboard navigation
- Screen reader support
- High contrast mode
- Reduced motion support
- Semantic HTML structure

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 