import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { YouTubeClient } from "../client.js";
import { wrapToolHandler } from "../utils/error-handler.js";

const register = (server: McpServer, client: YouTubeClient) => {
  server.tool(
    "delete_video",
    "Permanently delete a YouTube video from your channel. (Quota: 50 units)",
    {
      video_id: z.string().describe("YouTube video ID to delete"),
    },
    async (args) =>
      wrapToolHandler(async () => {
        const { youtube } = client;

        await youtube.videos.delete({
          id: args.video_id,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                { success: true, deleted_video_id: args.video_id },
                null,
                2,
              ),
            },
          ],
        };
      }),
  );
};

export { register };
