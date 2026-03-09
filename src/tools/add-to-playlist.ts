import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { YouTubeClient } from "../client.js";
import { wrapToolHandler } from "../utils/error-handler.js";

const register = (server: McpServer, client: YouTubeClient) => {
  server.tool(
    "add_to_playlist",
    "Add a video to a YouTube playlist. (Quota: 50 units)",
    {
      playlist_id: z.string().describe("YouTube playlist ID"),
      video_id: z.string().describe("YouTube video ID to add"),
      position: z
        .number()
        .int()
        .min(0)
        .optional()
        .describe("Position in the playlist (0-indexed, appends to end if omitted)"),
    },
    async (args) =>
      wrapToolHandler(async () => {
        const { youtube } = client;

        const requestBody: {
          snippet: {
            playlistId: string;
            resourceId: { kind: string; videoId: string };
            position?: number;
          };
        } = {
          snippet: {
            playlistId: args.playlist_id,
            resourceId: {
              kind: "youtube#video",
              videoId: args.video_id,
            },
          },
        };

        if (args.position !== undefined) {
          requestBody.snippet.position = args.position;
        }

        const response = await youtube.playlistItems.insert({
          part: ["snippet"],
          requestBody,
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
