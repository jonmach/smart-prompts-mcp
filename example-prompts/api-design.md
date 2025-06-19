---
name: api_design
title: RESTful API Design Guide
description: Design template for creating well-structured RESTful APIs
category: architecture
tags: [api, rest, design, backend, documentation]
difficulty: advanced
author: jezweb
version: 1.0.0
arguments:
  - name: resource_name
    description: The name of the resource (e.g., users, products)
    required: true
  - name: operations
    description: Comma-separated list of operations (e.g., create,read,update,delete)
    required: false
    default: create,read,update,delete
  - name: auth_type
    description: Authentication type (e.g., JWT, OAuth2, API Key)
    required: false
    default: JWT
---

# RESTful API Design: {{uppercase resource_name}}

## Resource Overview
- **Resource**: {{resource_name}}
- **Operations**: {{operations}}
- **Authentication**: {{auth_type}}

## API Endpoints

### Base URL
```
https://api.example.com/v1
```

{{#if (or (eq operations "create,read,update,delete") (includes operations "read"))}}
### GET /{{lowercase resource_name}}
**Description**: Retrieve a list of {{resource_name}}

**Parameters**:
- `page` (integer, optional): Page number for pagination (default: 1)
- `limit` (integer, optional): Items per page (default: 20, max: 100)
- `sort` (string, optional): Sort field (e.g., created_at, name)
- `order` (string, optional): Sort order (asc, desc)
- `filter` (object, optional): Filter criteria

**Response**:
```json
{
  "data": [
    {
      "id": "string",
      "created_at": "timestamp",
      "updated_at": "timestamp"
      // resource-specific fields
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "pages": 5
  }
}
```

### GET /{{lowercase resource_name}}/:id
**Description**: Retrieve a specific {{resource_name}} by ID

**Response**:
```json
{
  "data": {
    "id": "string",
    "created_at": "timestamp",
    "updated_at": "timestamp"
    // resource-specific fields
  }
}
```
{{/if}}

{{#if (or (eq operations "create,read,update,delete") (includes operations "create"))}}
### POST /{{lowercase resource_name}}
**Description**: Create a new {{resource_name}}

**Request Body**:
```json
{
  // resource-specific fields (excluding id, timestamps)
}
```

**Response** (201 Created):
```json
{
  "data": {
    "id": "string",
    "created_at": "timestamp",
    "updated_at": "timestamp"
    // all resource fields
  }
}
```
{{/if}}

{{#if (or (eq operations "create,read,update,delete") (includes operations "update"))}}
### PUT /{{lowercase resource_name}}/:id
**Description**: Update an entire {{resource_name}}

**Request Body**:
```json
{
  // all resource-specific fields (excluding id, timestamps)
}
```

### PATCH /{{lowercase resource_name}}/:id
**Description**: Partially update a {{resource_name}}

**Request Body**:
```json
{
  // only fields to update
}
```

**Response** (200 OK):
```json
{
  "data": {
    "id": "string",
    "created_at": "timestamp",
    "updated_at": "timestamp"
    // all resource fields
  }
}
```
{{/if}}

{{#if (or (eq operations "create,read,update,delete") (includes operations "delete"))}}
### DELETE /{{lowercase resource_name}}/:id
**Description**: Delete a {{resource_name}}

**Response** (204 No Content): Empty body
{{/if}}

## Authentication

### {{auth_type}} Implementation

{{#if (eq auth_type "JWT")}}
Include the JWT token in the Authorization header:
```
Authorization: Bearer <token>
```
{{/if}}

{{#if (eq auth_type "OAuth2")}}
Use OAuth2 bearer token:
```
Authorization: Bearer <access_token>
```
{{/if}}

{{#if (eq auth_type "API Key")}}
Include API key in header:
```
X-API-Key: <api_key>
```
{{/if}}

## Error Responses

### Standard Error Format
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

### Common Error Codes
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource conflict (e.g., duplicate)
- `422 Unprocessable Entity`: Validation errors
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

## Rate Limiting
- Rate limit: 1000 requests per hour per API key
- Headers included in response:
  - `X-RateLimit-Limit`: Total allowed requests
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Unix timestamp for reset

## Versioning
- Version included in URL path: `/v1/`
- Deprecation notice via `Sunset` header
- Minimum 6-month deprecation period

## Additional Considerations
- [ ] CORS configuration
- [ ] Request/Response compression
- [ ] API documentation (OpenAPI/Swagger)
- [ ] Webhook events for resource changes
- [ ] Batch operations endpoint
- [ ] Field filtering/sparse fieldsets