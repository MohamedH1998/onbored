# Onbored Ingestion Worker

A Cloudflare Worker that handles data ingestion for the Onbored analytics platform. This worker processes events and session replay data, applies rate limiting, and forwards data to Tinybird for storage and analysis.

## Overview

The ingestion worker serves as the primary data ingestion endpoint for Onbored, handling:
- **Events**: User events and analytics data
- **Sessions**: User session events
- **Session Replay**: Compressed session replay data for user behavior analysis
- **Rate Limiting**: Per-project rate limiting to prevent abuse and ensure fair usage

## Architecture

```
Client → Ingestion Worker → Rate Limiter → Tinybird
```

The worker acts as a middleware that:
1. Validates incoming requests
2. Applies rate limiting per project
3. Processes and transforms data
4. Forwards to Tinybird for storage

## Endpoints

### Events Ingestion
- **POST** `/ingest/events` - Submit user events and analytics data
- **GET** `/ingest/events` - Placeholder endpoint

### Session Replay
- **POST** `/ingest/session-replay` - Submit compressed session replay data
- **GET** `/ingest/session-replay` - Placeholder endpoint

### Session Data
- **POST** `/ingest/session` - Submit session metadata
- **GET** `/ingest/session` - Placeholder endpoint

## Rate Limiting

The worker implements **per-project rate limiting** using Cloudflare's built-in rate limiting service.

### Configuration
```toml
[[unsafe.bindings]]
name = "PROJECT_RATE_LIMITER"
type = "ratelimit"
namespace_id = "1001"
simple = { limit = 100, period = 60 }
```

### Rate Limit Details
- **Limit**: 100 requests per project
- **Period**: 60 seconds (1 minute)
- **Scope**: Per project key
- **Response**: HTTP 429 (Too Many Requests) when exceeded

### How It Works

1. **Project Identification**: Each request is identified by its `project_key`
2. **Rate Check**: The worker checks if the project has exceeded its rate limit
3. **Processing**: If within limits, the request is processed normally
4. **Rejection**: If exceeded, returns a 429 status with a descriptive error message

### Rate Limit Response
When rate limit is exceeded, the worker returns:
```json
HTTP 429 Too Many Requests
[RATE_LIMIT]: exceeded for route /events and project_key: {project_key}
```

### Rate Limit Headers
The worker may include standard rate limit headers in responses:
- `X-RateLimit-Limit`: Maximum requests per period
- `X-RateLimit-Remaining`: Remaining requests in current period
- `X-RateLimit-Reset`: Time when the rate limit resets

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `TINYBIRD_WRITE_TOKEN` | Tinybird API token for data ingestion | Yes |
| `TINYBIRD_BASE_URL` | Tinybird API base URL | Yes |
| `PROJECT_RATE_LIMITER` | Cloudflare rate limiter binding | Yes |

## CORS Configuration

The worker supports CORS for the following origins:
- `https://onbored-web.vercel.app` (Production)
- `http://localhost:3000` (Development)

## Development

### Prerequisites
- Node.js 18+
- pnpm
- Wrangler CLI

### Setup
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Deploy to Cloudflare
pnpm deploy
```

### Local Development
```bash
# Start with local environment
wrangler dev --local

# Start with remote environment
wrangler dev
```

## Deployment

### Staging
```bash
wrangler deploy --env staging
```

### Production
```bash
wrangler deploy --env production
```

### Logs
Monitor worker logs in the Cloudflare dashboard:
- **Analytics**: Request volume, error rates, performance
- **Logs**: Detailed request/response logs
- **Rate Limiting**: Rate limit events and violations

## Error Handling

The worker handles various error scenarios:
- **Invalid Data**: Returns 400 for malformed requests
- **Rate Limit Exceeded**: Returns 429 with descriptive message
- **Tinybird Errors**: Returns 500 for downstream service failures
- **Processing Errors**: Returns 500 for internal processing failures

## Security

- **CORS Protection**: Only allows requests from whitelisted origins
- **Rate Limiting**: Prevents abuse and ensures fair usage
- **Input Validation**: Validates all incoming data
- **Error Sanitization**: Prevents information leakage in error responses

## Troubleshooting

### Common Issues

1. **Rate Limit Errors (429)**
   - Check if your project is sending too many requests
   - Consider implementing client-side rate limiting
   - Contact support for rate limit increases

2. **CORS Errors**
   - Ensure your origin is in the allowed origins list
   - Check that requests include proper headers

3. **Tinybird Connection Errors**
   - Verify `TINYBIRD_WRITE_TOKEN` is valid
   - Check `TINYBIRD_BASE_URL` is correct
   - Monitor Tinybird service status

### Debug Mode
Enable debug logging by setting the log level in your environment:
```bash
wrangler dev --log-level debug
```
