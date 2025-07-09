# N8N Server Configuration Guide

This document provides instructions for configuring your N8N server to work securely with the NDIS application.

## 🚨 Critical Security Issues Fixed

### 1. CORS Configuration
**Problem**: Browser blocks requests due to CORS policy
**Solution**: Configure N8N to allow cross-origin requests from your domains

### 2. Authentication 
**Problem**: Webhooks are publicly accessible
**Solution**: Implement API key authentication

## N8N Server Setup

### 1. Configure CORS Headers

In your N8N workflow's HTTP Response node, add these headers:

```json
{
  "Access-Control-Allow-Origin": "http://localhost:5173,https://yourdomain.com",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-API-Key",
  "Access-Control-Max-Age": "86400"
}
```

### 2. Add Authentication Check

Add an authentication node at the start of each workflow:

```javascript
// In a Code node, check for API key
const apiKey = $input.headers['authorization']?.replace('Bearer ', '') || 
               $input.headers['x-api-key'];

const VALID_API_KEY = 'your-secret-api-key-here'; // Store in environment

if (!apiKey || apiKey !== VALID_API_KEY) {
  return {
    json: { error: 'Unauthorized: Invalid or missing API key' },
    headers: { 'Access-Control-Allow-Origin': '*' },
    statusCode: 401
  };
}

// Continue with normal workflow
return $input.all();
```

### 3. Environment Variables

Set these in your N8N environment:

```bash
# N8N Instance
N8N_CORS_ORIGIN=http://localhost:5173,https://yourdomain.com
N8N_WEBHOOK_API_KEY=your-secret-api-key-here

# Security
N8N_SECURE_COOKIE=true
N8N_BASIC_AUTH_ACTIVE=true
```

## Application Configuration

### 1. Update .env file

```bash
# Copy from .env.example
cp .env.example .env

# Edit .env and add:
VITE_N8N_DOMAIN=buildergeniobit.app.n8n.cloud
VITE_API_MODE=live
VITE_N8N_API_KEY=your-secret-api-key-here
```

### 2. Required N8N Endpoints

Ensure these webhook endpoints are configured:

1. **generate-clarification-questions**
   - URL: `https://buildergeniobit.app.n8n.cloud/webhook/generate-clarification-questions`
   - Method: POST
   - Auth: Bearer token or API key

2. **enhance-narrative-content**
   - URL: `https://buildergeniobit.app.n8n.cloud/webhook/enhance-narrative-content`
   - Method: POST
   - Auth: Bearer token or API key

3. **analyze-contributing-conditions**
   - URL: `https://buildergeniobit.app.n8n.cloud/webhook/analyze-contributing-conditions`
   - Method: POST
   - Auth: Bearer token or API key

## Testing the Configuration

### 1. Test CORS
```bash
curl -X OPTIONS \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type,Authorization" \
  https://buildergeniobit.app.n8n.cloud/webhook/generate-clarification-questions
```

Should return CORS headers.

### 2. Test Authentication
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret-api-key-here" \
  -d '{"test": "data"}' \
  https://buildergeniobit.app.n8n.cloud/webhook/generate-clarification-questions
```

Should not return 401 Unauthorized.

### 3. Test Without Auth
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}' \
  https://buildergeniobit.app.n8n.cloud/webhook/generate-clarification-questions
```

Should return 401 Unauthorized.

## Error Handling

The application now provides detailed error messages:

- **CORS errors**: Toast notification explains CORS configuration needed
- **Auth errors**: Clear message about API key issues  
- **Timeout errors**: Indicates server performance issues
- **Server errors**: Generic message for 500+ errors

## Production Considerations

### 1. Environment-Specific Domains
```bash
# Development
VITE_N8N_DOMAIN=dev.buildergeniobit.app.n8n.cloud

# Production  
VITE_N8N_DOMAIN=buildergeniobit.app.n8n.cloud
```

### 2. Rate Limiting
Consider implementing rate limiting in N8N to prevent abuse:

```javascript
// Rate limiting check in N8N workflow
const clientIP = $input.headers['x-forwarded-for'] || $input.headers['x-real-ip'];
// Implement rate limiting logic
```

### 3. Monitoring
Set up monitoring for:
- Failed authentication attempts
- High error rates
- Performance metrics
- Usage patterns

## Troubleshooting

### Common Issues

1. **"Failed to fetch" errors**
   - Check CORS configuration
   - Verify domain is correct
   - Test with curl

2. **401 Unauthorized**
   - Verify API key in .env
   - Check N8N authentication logic
   - Ensure header format is correct

3. **Timeouts**
   - Check N8N workflow performance
   - Verify server resources
   - Consider increasing timeout

### Debug Mode

Enable debug logging by setting:
```bash
VITE_DEBUG_API=true
```

This will log detailed API information to the browser console.