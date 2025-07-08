import fs from "fs";
import archiver from "archiver";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const zipFilePath = path.join(__dirname, "extension.zip");
const sourceDir = process.cwd();

const {
  CHROME_CLIENT_ID,
  CHROME_CLIENT_SECRET,
  CHROME_REFRESH_TOKEN,
  CHROME_EXTENSION_ID,
} = process.env;

async function zipDirectory() {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => resolve());
    archive.on("error", (err) => reject(err));

    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}

async function getAccessToken() {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CHROME_CLIENT_ID,
      client_secret: CHROME_CLIENT_SECRET,
      refresh_token: CHROME_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  });

  const data = await response.json();
  if (!data.access_token) throw new Error("Failed to retrieve access token");
  return data.access_token;
}

async function uploadExtension(accessToken) {
  const zip = fs.readFileSync(zipFilePath);
  const res = await fetch(
    `https://www.googleapis.com/upload/chromewebstore/v1.1/items/${CHROME_EXTENSION_ID}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-goog-api-version": "2",
        "Content-Type": "application/zip",
      },
      body: zip,
    }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(`Upload failed: ${JSON.stringify(data)}`);
}

async function publishExtension(accessToken) {
  const res = await fetch(
    `https://www.googleapis.com/chromewebstore/v1.1/items/${CHROME_EXTENSION_ID}/publish`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "x-goog-api-version": "2",
      },
    }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(`Publish failed: ${JSON.stringify(data)}`);
}

async function main() {
  try {
    console.log("📦 Zipping extension...");
    await zipDirectory();

    console.log("🔑 Fetching access token...");
    const accessToken = await getAccessToken();

    console.log("🚚 Uploading extension...");
    await uploadExtension(accessToken);

    console.log("🚀 Publishing extension...");
    await publishExtension(accessToken);

    fs.unlinkSync(zipFilePath);
    console.log("✅ Extension published successfully!");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

main();
