import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { YouTubeClient } from "../client.js";
import { wrapToolHandler } from "../utils/error-handler.js";

const register = (server: McpServer, client: YouTubeClient) => {
  server.tool(
    "reply_comment",
    "Post a reply to an existing YouTube comment thread. (Quota: 50 units)",
    {
      comment_id: z
        .string()
        .describe("Parent comment thread ID to reply to"),
      text: z.string().describe("Reply text content"),
    },
    async (args) =>
      wrapToolHandler(async () => {
        const { youtube } = client;

        const response = await youtube.comments.insert({
          part: ["snippet"],
          requestBody: {
            snippet: {
              parentId: args.comment_id,
              textOriginal: args.text,
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
