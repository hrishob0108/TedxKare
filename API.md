# TEDxKARE API Reference

Complete API documentation for TEDxKARE Recruitment Portal backend.

**Base URL**: `http://localhost:5000/api` (development) or `https://your-domain.com/api` (production)

---

## Table of Contents

1. [Authentication](#authentication)
2. [Applicant Endpoints](#applicant-endpoints)
3. [Admin Endpoints](#admin-endpoints)
4. [Error Responses](#error-responses)
5. [Status Codes](#status-codes)

---

## Authentication

All protected endpoints require JWT token in the Authorization header.

### Format
```
Authorization: Bearer <token>
```

### Token Details
- **Type**: JWT (JSON Web Token)
- **Expires**: 7 days
- **Algorithm**: HS256
- **Claims**: id, email

### Example
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  https://your-api.com/api/applicants
```

---

## Applicant Endpoints

### 1. Submit Application

**Endpoint**: `POST /applicants`

**Authentication**: Public (No token required)

**Description**: Submit a new application for TEDxKARE

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "9876543210",
  "department": "Computer Science",
  "year": "3rd Year",
  "linkedin": "https://linkedin.com/in/johndoe",
  "portfolio": "https://johndoe.com",
  "firstPreference": "Research Team",
  "secondPreference": "Marketing Team",
  "whyTedx": "I want to join TEDx because I believe in spreading ideas...",
  "whyDomain": "I chose Research Team because I love exploring innovative topics...",
  "experience": "I have experience in research and content creation...",
  "availability": "10-15 hours"
}
```

**Request Fields**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Full name (min 2 chars) |
| email | string | Yes | Valid email address |
| phone | string | Yes | 10-digit phone number |
| department | string | Yes | Academic department |
| year | string | Yes | Year of study |
| linkedin | string | No | LinkedIn profile URL |
| portfolio | string | No | Portfolio/website URL |
| firstPreference | string | Yes | First domain choice |
| secondPreference | string | Yes | Second domain choice (must differ from first) |
| whyTedx | string | Yes | Motivation (min 20 chars) |
| whyDomain | string | Yes | Why chosen domain (min 20 chars) |
| experience | string | Yes | Previous experience (min 20 chars) |
| availability | string | Yes | Weekly availability |

**Response Success** (201):
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john.doe@example.com"
  }
}
```

**Response Error** (400):
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

**Response Error** (409):
```json
{
  "error": "An application with this email already exists"
}
```

---

### 2. Get All Applicants

**Endpoint**: `GET /applicants`

**Authentication**: Required (Admin only)

**Description**: Retrieve all applications with optional filtering

**Query Parameters**:
| Parameter | Type | Optional | Description |
|-----------|------|----------|-------------|
| domain | string | Yes | Filter by domain preference |
| status | string | Yes | Filter by status (Pending/Shortlisted/Rejected) |
| search | string | Yes | Search by name or email |

**Example Requests**:
```bash
# Get all applicants
GET /applicants

# Filter by domain
GET /applicants?domain=Research Team

# Filter by status
GET /applicants?status=Shortlisted

# Search by name
GET /applicants?search=john

# Combined filters
GET /applicants?domain=Marketing Team&status=Pending&search=doe
```

**Response Success** (200):
```json
{
  "success": true,
  "count": 25,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "9876543210",
      "department": "Computer Science",
      "year": "3rd Year",
      "firstPreference": "Research Team",
      "secondPreference": "Marketing Team",
      "status": "Pending",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### 3. Get Single Applicant

**Endpoint**: `GET /applicants/:id`

**Authentication**: Required (Admin only)

**Description**: Get detailed information about a specific applicant

**Request Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | MongoDB ObjectId of applicant |

**Response Success** (200):
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "9876543210",
    "department": "Computer Science",
    "year": "3rd Year",
    "linkedin": "https://linkedin.com/in/johndoe",
    "portfolio": "https://johndoe.com",
    "firstPreference": "Research Team",
    "secondPreference": "Marketing Team",
    "whyTedx": "I want to join TEDx because...",
    "whyDomain": "I chose Research Team because...",
    "experience": "I have experience in...",
    "availability": "10-15 hours",
    "status": "Pending",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Response Error** (404):
```json
{
  "error": "Applicant not found"
}
```

---

### 4. Update Applicant Status

**Endpoint**: `PATCH /applicants/:id`

**Authentication**: Required (Admin only)

**Description**: Update the application status of an applicant

**Request Body**:
```json
{
  "status": "Shortlisted"
}
```

**Status Options**:
- `Pending` - Initial status
- `Shortlisted` - Shortlisted for interview
- `Rejected` - Application rejected

**Response Success** (200):
```json
{
  "success": true,
  "message": "Status updated to Shortlisted",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "status": "Shortlisted"
  }
}
```

**Response Error** (400):
```json
{
  "error": "Invalid status. Must be one of: Pending, Shortlisted, Rejected"
}
```

---

### 5. Delete Applicant

**Endpoint**: `DELETE /applicants/:id`

**Authentication**: Required (Admin only)

**Description**: Delete an applicant record

**Response Success** (200):
```json
{
  "success": true,
  "message": "Applicant deleted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe"
  }
}
```

---

### 6. Get Statistics

**Endpoint**: `GET /applicants/stats`

**Authentication**: Required (Admin only)

**Description**: Get application statistics and analytics

**Response Success** (200):
```json
{
  "success": true,
  "data": {
    "totalApplications": 150,
    "byStatus": {
      "pending": 100,
      "shortlisted": 30,
      "rejected": 20
    },
    "byDomain": [
      {
        "domain": "Research Team",
        "count": 25
      },
      {
        "domain": "Marketing Team",
        "count": 35
      }
    ]
  }
}
```

---

## Admin Endpoints

### 1. Admin Login

**Endpoint**: `POST /admin/login`

**Authentication**: Public (No token required)

**Description**: Authenticate admin and get JWT token

**Request Body**:
```json
{
  "email": "admin@tedxkare.com",
  "password": "secure_password_123"
}
```

**Response Success** (200):
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "507f1f77bcf86cd799439012",
    "email": "admin@tedxkare.com"
  }
}
```

**Response Error** (401):
```json
{
  "error": "Invalid email or password"
}
```

---

### 2. Create Admin Account

**Endpoint**: `POST /admin/create`

**Authentication**: Public (No token required)

**Description**: Create a new admin account (first time setup)

**Note**: In production, this should be protected or removed after initial setup.

**Request Body**:
```json
{
  "email": "neadmin@tedxkare.com",
  "password": "secure_password_123"
}
```

**Password Requirements**:
- Minimum 6 characters
- Will be hashed with bcryptjs

**Response Success** (201):
```json
{
  "success": true,
  "message": "Admin account created successfully",
  "admin": {
    "id": "507f1f77bcf86cd799439012",
    "email": "newadmin@tedxkare.com"
  }
}
```

**Response Error** (409):
```json
{
  "error": "Admin account with this email already exists"
}
```

---

### 3. Verify Token

**Endpoint**: `GET /admin/verify`

**Authentication**: Required (Admin only)

**Description**: Verify if current token is valid

**Response Success** (200):
```json
{
  "success": true,
  "message": "Token is valid",
  "admin": {
    "id": "507f1f77bcf86cd799439012",
    "email": "admin@tedxkare.com"
  }
}
```

**Response Error** (401):
```json
{
  "error": "Unauthorized"
}
```

---

### 4. Change Password

**Endpoint**: `POST /admin/change-password`

**Authentication**: Required (Admin only)

**Description**: Change admin password

**Request Body**:
```json
{
  "currentPassword": "old_password",
  "newPassword": "new_secure_password"
}
```

**Response Success** (200):
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Response Error** (401):
```json
{
  "error": "Current password is incorrect"
}
```

---

## Error Responses

### Common Error Formats

**Validation Error** (400):
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

**Authentication Error** (401):
```json
{
  "error": "Invalid token"
}
```

**Authorization Error** (401):
```json
{
  "error": "Unauthorized"
}
```

**Not Found Error** (404):
```json
{
  "error": "Resource not found"
}
```

**Duplicate Error** (409):
```json
{
  "error": "Email already exists"
}
```

**Server Error** (500):
```json
{
  "error": "Internal server error"
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required or failed |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 500 | Internal Server Error |

---

## Rate Limiting

Currently no rate limiting is applied. In production, consider implementing:
- 100 requests per minute per IP
- 10 login attempts before temporary lockout

---

## CORS Headers

Requests must include valid CORS headers:
```
Origin: https://your-frontend-domain.com
```

---

## Testing with Postman

1. Import the endpoints into Postman
2. Set base URL: `http://localhost:5000/api`
3. Create environment variables:
   - `token`: Store JWT token
   - `applicant_id`: Store applicant ID for testing
4. Test each endpoint

---

## cURL Examples

**Create Application**:
```bash
curl -X POST http://localhost:5000/api/applicants \
  -H "Content-Type: application/json" \
  -d '{
    "name":"John Doe",
    "email":"john@example.com",
    "phone":"9876543210",
    "department":"Computer Science",
    "year":"3rd Year",
    "firstPreference":"Research Team",
    "secondPreference":"Marketing Team",
    "whyTedx":"I want to join",
    "whyDomain":"I like this domain",
    "experience":"5 years in tech",
    "availability":"10-15 hours"
  }'
```

**Login Admin**:
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"admin@tedxkare.com",
    "password":"password123"
  }'
```

**Get Applications** (with token):
```bash
curl -X GET http://localhost:5000/api/applicants \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

**Last Updated**: January 2026

**Version**: 1.0.0
