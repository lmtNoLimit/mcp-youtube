#!/usr/bin/env npx tsx
import { OAuth2Client } from "google-auth-library";
import { createServer } from "http";
import { URL } from "url";
import "dotenv/config";

const SCOPES = [
  "https://www.googleapis.com/auth/youtube",
  "https://www.googleapis.com/auth/youtube.upload",
  "https://www.googleapis.com/auth/youtube.force-ssl",
];

const PORT = 3456;
const REDIRECT_URI = `http://127.0.0.1:${PORT}`;

const main = async () => {
  const clientId = process.env.YOUTUBE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    console.error(
      "Set YOUTUBE_OAUTH_CLIENT_ID and YOUTUBE_OAUTH_CLIENT_SECRET in .env",
    );
    process.exit(1);
  }

  const oauth2Client = new OAuth2Client(clientId, clientSecret, REDIRECT_URI);
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });

  console.log("\n1. Open this URL in your browser:\n");
  console.log(authUrl);
  console.log("\n2. Authorize the app — you will be redirected back automatically.\n");

  const code = await new Promise<string>((resolve, reject) => {
    const server = createServer((req, res) => {
      const url = new URL(req.url ?? "/", REDIRECT_URI);
      const authCode = url.searchParams.get("code");
      const error = url.searchParams.get("error");

      if (error) {
        res.writeHead(400, { "Content-Type": "text/html" });
        res.end(`<h1>Authorization failed</h1><p>${error}</p>`);
        server.close();
        reject(new Error(`Authorization denied: ${error}`));
        return;
      }

      if (authCode) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(
          "<h1>Authorization successful!</h1><p>You can close this tab and return to the terminal.</p>",
        );
        server.close();
        resolve(authCode);
      }
    });

    server.listen(PORT, "127.0.0.1", () => {
      console.log(`Waiting for authorization on ${REDIRECT_URI}...\n`);
    });

    server.on("error", (err) => {
      reject(
        new Error(
          `Could not start local server on port ${PORT}: ${err.message}`,
        ),
      );
    });
  });

  const { tokens } = await oauth2Client.getToken(code);
  console.log("3. Add this to your .env file:\n");
  console.log(`YOUTUBE_REFRESH_TOKEN=${tokens.refresh_token}`);
  console.log(
    "\nNote: In Google Cloud Console, add http://127.0.0.1:3456 as an authorized redirect URI.",
  );
};

main().catch(console.error);
