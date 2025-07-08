Zephyr CLI
zephyr is a developer-friendly CLI tool to scaffold, manage, and publish Chrome extensions effortlessly. With zephyr publish, you can zip your extension and upload it directly to the Chrome Web Store via the API — all with a single command.

Features
Interactive scaffolding for Chrome extensions with multiple framework options (Next.js, React.js, Pure JS + TypeScript)

Automated Chrome extension packaging (zipping)

Seamless upload and publishing of your extension to Chrome Web Store via CLI

Simplifies the publishing process with environment variables for secure credentials

Installation
You can install zephyr globally via npm:

bash
Copy
Edit
npm install -g zephyr
Or run directly with npx without installing globally:

bash
Copy
Edit
npx zephyr publish
Usage
Scaffold your Chrome extension
bash
Copy
Edit
zephyr init
Coming soon: Interactive CLI to choose your framework and generate boilerplate.

Publish your Chrome extension
bash
Copy
Edit
zephyr publish
This command will:

Zip your current directory (your Chrome extension files) into a extension.zip file.

Upload the zipped package to the Chrome Web Store.

Publish your extension immediately after upload.

Prerequisites
Before you can publish, you need to set up API credentials with Google Cloud and get the necessary tokens:

1. Create OAuth 2.0 Credentials
Go to Google Cloud Console

Create a new project or use an existing one

Navigate to Credentials → Create Credentials → OAuth client ID

Select Desktop app and create the client

You will get:

Client ID

Client Secret

2. Get Refresh Token
To authorize the CLI to upload and publish your extension, you need a Refresh Token.

You can generate it using tools like:

OAuth 2.0 Playground

Or a custom OAuth flow (advanced)

Scopes required:

arduino
Copy
Edit
https://www.googleapis.com/auth/chromewebstore
3. Find Your Extension ID
Your Chrome extension's unique ID from the Chrome Web Store Developer Dashboard.

Environment Variables
Set the following environment variables in your terminal session or shell profile before running zephyr publish:

bash
Copy
Edit
export CHROME_CLIENT_ID="your-client-id.apps.googleusercontent.com"
export CHROME_CLIENT_SECRET="your-client-secret"
export CHROME_REFRESH_TOKEN="your-refresh-token"
export CHROME_EXTENSION_ID="your-extension-id"
How zephyr publish works internally
Uses archiver to zip your current directory.

Uploads your zip file using the official Chrome Web Store API with the OAuth credentials.

Publishes your extension immediately after a successful upload.

Deletes the temporary zip file after publishing.

Troubleshooting
Missing environment variables: The CLI will not run unless all required env vars are set.

OAuth errors: Make sure your refresh token is valid and has correct scopes.

Extension upload failure: Confirm your extension ID is correct and you have the necessary permissions on the developer dashboard.

Contributing
Contributions are welcome! Please open an issue or pull request on GitHub.

License
MIT License © zephyr-team.ir
