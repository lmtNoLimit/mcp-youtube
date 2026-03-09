import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { YouTubeClient } from "../client.js";
import { wrapToolHandler } from "../utils/error-handler.js";

const register = (server: McpServer, client: YouTubeClient) => {
  server.tool(
    "update_video",
    "Update metadata of an existing YouTube video. (Quota: 50 units)",
    {
      video_id: z.string().describe("YouTube video ID to update"),
      title: z.string().optional().describe("New video title"),
      description: z.string().optional().describe("New video description"),
      tags: z.array(z.string()).optional().describe("New video tags"),
      privacy: z
        .enum(["public", "private", "unlisted"])
        .optional()
        .describe("New privacy status"),
    },
    async (args) =>
      wrapToolHandler(async () => {
        const { youtube } = client;

        // Fetch current snippet to merge updates
        const current = await youtube.videos.list({
          part: ["snippet", "status"],
          id: [args.video_id],
        });

        const existing = current.data.items?.[0];
        if (!existing) {
          throw new Error(`Video not found: ${args.video_id}`);
        }

        const snippet = existing.snippet ?? {};
        const status = existing.status ?? {};

        const response = await youtube.videos.update({
          part: ["snippet", "status"],
          requestBody: {
            id: args.video_id,
            snippet: {
              ...snippet,
              title: args.title ?? snippet.title,
              description: args.description ?? snippet.description,
              tags: args.tags ?? snippet.tags,
              // categoryId is required by the API when updating snippet
              categoryId: snippet.categoryId ?? "22",
            },
            status: {
              ...status,
              privacyStatus: args.privacy ?? status.privacyStatus,
            },
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
