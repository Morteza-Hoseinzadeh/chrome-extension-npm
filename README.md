# Zephyr CLI

**ZephyrExt** is a developer-friendly CLI tool to scaffold, manage, and publish Chrome extensions effortlessly. With `ZephyrExt publish`, you can zip your extension and upload it directly to the Chrome Web Store via the API — all with a single command.

---

## Features

- Interactive scaffolding for Chrome extensions with multiple framework options (Next.js, React.js, Pure JS + TypeScript)
- Automated Chrome extension packaging (zipping)
- Seamless upload and publishing of your extension to Chrome Web Store via CLI
- Simplifies the publishing process with environment variables for secure credentials

---

## Installation

You can install **ZephyrExt** globally via npm:

npm install -g ZephyrExt

Or run directly with npx without installing globally:

npx ZephyrExt publish

---

## Usage

### Scaffold your Chrome extension

ZephyrExt init

_(Coming soon: Interactive CLI to choose your framework and generate boilerplate.)_

### Publish your Chrome extension

ZephyrExt publish

This command will:

- Zip your current directory (your Chrome extension files) into an `extension.zip` file
- Upload the zipped package to the Chrome Web Store
- Publish your extension immediately after upload

---

## Prerequisites

Before you can publish, you need to set up API credentials with Google Cloud and get the necessary tokens:

### 1. Create OAuth 2.0 Credentials

- Go to Google Cloud Console
- Create a new project or use an existing one
- Navigate to Credentials → Create Credentials → OAuth client ID
- Select "Desktop app" and create the client

You will get:

- Client ID
- Client Secret

### 2. Get Refresh Token

To authorize the CLI to upload and publish your extension, you need a **Refresh Token**.

You can generate it using tools like:

- OAuth 2.0 Playground
- Or a custom OAuth flow (advanced)

**Required scope:**
[https://www.googleapis.com/auth/chromewebstore](https://www.googleapis.com/auth/chromewebstore)

### 3. Find Your Extension ID

Get this from the Chrome Web Store Developer Dashboard (after uploading your extension).

---

## Environment Variables

Set the following environment variables in your terminal before running `ZephyrExt publish`:

CHROME_CLIENT_ID="your-client-id.apps.googleusercontent.com"
CHROME_CLIENT_SECRET="your-client-secret"
CHROME_REFRESH_TOKEN="your-refresh-token"
CHROME_EXTENSION_ID="your-extension-id"

---

## How `ZephyrExt publish` works internally

- Zips your current directory using the `archiver` package
- Uploads your zip file to the Chrome Web Store via their API
- Publishes the extension immediately
- Deletes the temporary zip file after publishing

---

## Troubleshooting

- **Missing environment variables:** Ensure all required env vars are set
- **OAuth errors:** Check that your refresh token and scopes are correct
- **Upload failures:** Make sure your extension ID is correct and has proper permissions

---

## Contributing

Contributions are welcome! Please open an issue or pull request on GitHub.

---

## License

MIT License © zephyr-team.ir
