import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { YouTubeClient } from "../client.js";
import { wrapToolHandler } from "../utils/error-handler.js";

const register = (server: McpServer, client: YouTubeClient) => {
  server.tool(
    "get_comments",
    "Retrieve top-level comment threads for a YouTube video. (Quota: 1 unit)",
    {
      video_id: z.string().describe("YouTube video ID to fetch comments for"),
      max_results: z
        .number()
        .int()
        .min(1)
        .max(100)
        .optional()
        .default(20)
        .describe("Maximum number of comment threads to return (1-100, default: 20)"),
    },
    async (args) =>
      wrapToolHandler(async () => {
        const { youtube } = client;

        const response = await youtube.commentThreads.list({
          part: ["snippet", "replies"],
          videoId: args.video_id,
          maxResults: args.max_results ?? 20,
          order: "relevance",
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
