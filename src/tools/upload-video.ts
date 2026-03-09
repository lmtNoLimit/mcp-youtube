import { z } from "zod";
import { createReadStream } from "fs";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { YouTubeClient } from "../client.js";
import { wrapToolHandler } from "../utils/error-handler.js";

const register = (server: McpServer, client: YouTubeClient) => {
  server.tool(
    "upload_video",
    "Upload a video file to YouTube. (Quota: 1600 units)",
    {
      file_path: z.string().describe("Absolute path to the video file to upload"),
      title: z.string().describe("Video title"),
      description: z.string().optional().describe("Video description"),
      tags: z.array(z.string()).optional().describe("Video tags"),
      privacy: z
        .enum(["public", "private", "unlisted"])
        .optional()
        .default("private")
        .describe("Privacy status (default: private)"),
    },
    async (args) =>
      wrapToolHandler(async () => {
        const { youtube } = client;
        const stream = createReadStream(args.file_path);

        const response = await youtube.videos.insert({
          part: ["snippet", "status"],
          requestBody: {
            snippet: {
              title: args.title,
              description: args.description ?? "",
              tags: args.tags ?? [],
            },
            status: {
              privacyStatus: args.privacy ?? "private",
            },
          },
          media: {
            body: stream,
          },
        });

        return {
          content: [
            { type: "text", text: JSON.stringify(response.data, null, 2) },
          ],
        };
      }),
  );
};

export { register };
