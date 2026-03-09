#!/usr/bin/env npx tsx
import { OAuth2Client } from "google-auth-library";
import { createInterface } from "readline";
import "dotenv/config";

const SCOPES = [
  "https://www.googleapis.com/auth/youtube",
  "https://www.googleapis.com/auth/youtube.upload",
  "https://www.googleapis.com/auth/youtube.force-ssl",
];

const main = async () => {
  const clientId = process.env.YOUTUBE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    console.error("Set YOUTUBE_OAUTH_CLIENT_ID and YOUTUBE_OAUTH_CLIENT_SECRET in .env");
    process.exit(1);
  }

  const oauth2Client = new OAuth2Client(clientId, clientSecret, "urn:ietf:wg:oauth:2.0:oob");
  const authUrl = oauth2Client.generateAuthUrl({ access_type: "offline", scope: SCOPES });

  console.log("\n1. Open this URL in your browser:\n");
  console.log(authUrl);
  console.log("\n2. Authorize the app and paste the code below:\n");

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const code = await new Promise<string>((resolve) => rl.question("Code: ", resolve));
  rl.close();

  const { tokens } = await oauth2Client.getToken(code);
  console.log("\n3. Add this to your .env file:\n");
  console.log(`YOUTUBE_REFRESH_TOKEN=${tokens.refresh_token}`);
};

main().catch(console.error);
