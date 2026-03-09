# @builderhub/mcp-youtube

[![CI](https://github.com/lmtNoLimit/mcp-youtube/actions/workflows/ci.yml/badge.svg)](https://github.com/lmtNoLimit/mcp-youtube/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@builderhub/mcp-youtube)](https://www.npmjs.com/package/@builderhub/mcp-youtube)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

MCP server for YouTube — upload videos, manage playlists, and moderate comments via Claude Code/Desktop.

## Install

```bash
npx @builderhub/mcp-youtube
```

Or install globally:

```bash
npm install -g @builderhub/mcp-youtube
```

## OAuth Setup Guide

You need a Google OAuth 2.0 client with the YouTube Data API v3 enabled.

### 1. Create OAuth 2.0 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **YouTube Data API v3** under APIs & Services
4. Go to **APIs & Services > Credentials**
5. Click **Create Credentials > OAuth 2.0 Client ID**
6. Choose **Desktop app** as the application type
7. Copy the **Client ID** and **Client Secret**

### 2. Create a .env file

```bash
cp .env.example .env
```

Add your credentials:

```
YOUTUBE_OAUTH_CLIENT_ID=your-client-id
YOUTUBE_OAUTH_CLIENT_SECRET=your-client-secret
YOUTUBE_CHANNEL_ID=your-channel-id   # optional
```

### 3. Run the token helper

```bash
npm run get-token
```

Follow the prompts:
1. Open the authorization URL in your browser
2. Grant access to your YouTube account
3. Copy the authorization code and paste it
4. The refresh token will be printed — add it to your `.env`:

```
YOUTUBE_REFRESH_TOKEN=your-refresh-token
```

## Claude Code Configuration

Add to your Claude Code MCP config (`~/.claude/mcp.json` or project `.mcp.json`):

```json
{
  "mcpServers": {
    "youtube": {
      "command": "npx",
      "args": ["-y", "@builderhub/mcp-youtube"],
      "env": {
        "YOUTUBE_OAUTH_CLIENT_ID": "your-client-id",
        "YOUTUBE_OAUTH_CLIENT_SECRET": "your-client-secret",
        "YOUTUBE_REFRESH_TOKEN": "your-refresh-token",
        "YOUTUBE_CHANNEL_ID": "your-channel-id"
      }
    }
  }
}
```

## Claude Desktop Configuration

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS):

```json
{
  "mcpServers": {
    "youtube": {
      "command": "npx",
      "args": ["-y", "@builderhub/mcp-youtube"],
      "env": {
        "YOUTUBE_OAUTH_CLIENT_ID": "your-client-id",
        "YOUTUBE_OAUTH_CLIENT_SECRET": "your-client-secret",
        "YOUTUBE_REFRESH_TOKEN": "your-refresh-token",
        "YOUTUBE_CHANNEL_ID": "your-channel-id"
      }
    }
  }
}
```

## Available Tools

| Tool | Description | Quota Cost |
|------|-------------|------------|
| `upload_video` | Upload a video file to YouTube | 1600 units |
| `update_video` | Update video title, description, tags, or privacy | 50 units |
| `delete_video` | Permanently delete a video from your channel | 50 units |
| `create_playlist` | Create a new playlist | 50 units |
| `add_to_playlist` | Add a video to a playlist | 50 units |
| `get_channel_stats` | Get channel statistics and details | 1 unit |
| `get_comments` | Retrieve comment threads for a video | 1 unit |
| `reply_comment` | Post a reply to a comment thread | 50 units |

## Quota Management

YouTube Data API v3 provides **10,000 units per day** by default.

**Quota-intensive operations:**
- `upload_video` costs 1,600 units — limit to ~6 uploads/day on the free tier
- All other write operations cost 50 units each
- Read operations (`get_channel_stats`, `get_comments`) cost only 1 unit

To increase your quota, request an increase via the [Google Cloud Console](https://console.cloud.google.com/).

## Development

```bash
# Clone and install
git clone https://github.com/lmtNoLimit/mcp-youtube.git
cd mcp-youtube
npm install

# Type check
npm run typecheck

# Build
npm run build

# Watch mode
npm run dev

# Get OAuth refresh token
npm run get-token
```

## License

MIT — see [LICENSE](./LICENSE)
