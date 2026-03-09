import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { YouTubeClient } from "../client.js";
import { wrapToolHandler } from "../utils/error-handler.js";

const register = (server: McpServer, client: YouTubeClient) => {
  server.tool(
    "create_playlist",
    "Create a new YouTube playlist on your channel. (Quota: 50 units)",
    {
      title: z.string().describe("Playlist title"),
      description: z.string().optional().describe("Playlist description"),
      privacy: z
        .enum(["public", "private", "unlisted"])
        .optional()
        .default("public")
        .describe("Privacy status (default: public)"),
    },
    async (args) =>
      wrapToolHandler(async () => {
        const { youtube } = client;

        const response = await youtube.playlists.insert({
          part: ["snippet", "status"],
          requestBody: {
            snippet: {
              title: args.title,
              description: args.description ?? "",
            },
            status: {
              privacyStatus: args.privacy ?? "public",
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
