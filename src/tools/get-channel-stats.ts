import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { YouTubeClient } from "../client.js";
import { wrapToolHandler } from "../utils/error-handler.js";

const register = (server: McpServer, client: YouTubeClient) => {
  server.tool(
    "get_channel_stats",
    "Get statistics and details for the authenticated YouTube channel. (Quota: 1 unit)",
    {},
    async (_args) =>
      wrapToolHandler(async () => {
        const { youtube, channelId } = client;

        // Use channel ID from env if available, otherwise use "mine"
        const params: {
          part: string[];
          id?: string[];
          mine?: boolean;
        } = {
          part: ["snippet", "statistics", "contentDetails"],
        };

        if (channelId) {
          params.id = [channelId];
        } else {
          params.mine = true;
        }

        const response = await youtube.channels.list(params);

        return {
          content: [
            { type: "text", text: JSON.stringify(response.data, null, 2) },
          ],
        };
      }),
  );
};

export { register };
