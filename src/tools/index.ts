import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { YouTubeClient } from "../client.js";
import { register as registerUploadVideo } from "./upload-video.js";
import { register as registerUpdateVideo } from "./update-video.js";
import { register as registerDeleteVideo } from "./delete-video.js";
import { register as registerCreatePlaylist } from "./create-playlist.js";
import { register as registerAddToPlaylist } from "./add-to-playlist.js";
import { register as registerGetChannelStats } from "./get-channel-stats.js";
import { register as registerGetComments } from "./get-comments.js";
import { register as registerReplyComment } from "./reply-comment.js";

const registerAllTools = (server: McpServer, client: YouTubeClient) => {
  registerUploadVideo(server, client);
  registerUpdateVideo(server, client);
  registerDeleteVideo(server, client);
  registerCreatePlaylist(server, client);
  registerAddToPlaylist(server, client);
  registerGetChannelStats(server, client);
  registerGetComments(server, client);
  registerReplyComment(server, client);
};

export { registerAllTools };
