import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { createLogger } from "./utils/logger.js";

const logger = createLogger("youtube");

const createClient = () => {
  const {
    YOUTUBE_OAUTH_CLIENT_ID,
    YOUTUBE_OAUTH_CLIENT_SECRET,
    YOUTUBE_REFRESH_TOKEN,
    YOUTUBE_CHANNEL_ID,
  } = process.env;

  if (!YOUTUBE_OAUTH_CLIENT_ID || !YOUTUBE_OAUTH_CLIENT_SECRET || !YOUTUBE_REFRESH_TOKEN) {
    throw new Error(
      "Missing YouTube credentials. Set YOUTUBE_OAUTH_CLIENT_ID, YOUTUBE_OAUTH_CLIENT_SECRET, YOUTUBE_REFRESH_TOKEN env vars."
    );
  }

  const oauth2Client = new OAuth2Client(
    YOUTUBE_OAUTH_CLIENT_ID,
    YOUTUBE_OAUTH_CLIENT_SECRET,
  );
  oauth2Client.setCredentials({ refresh_token: YOUTUBE_REFRESH_TOKEN });

  const youtube = google.youtube({ version: "v3", auth: oauth2Client });

  logger.info("YouTube API client initialized");
  return { youtube, channelId: YOUTUBE_CHANNEL_ID };
};

export { createClient };
export type YouTubeClient = ReturnType<typeof createClient>;
