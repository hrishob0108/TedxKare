# 📋 Complete Error Messages Guide

Every error in TEDxKARE now has **user-friendly messages** so users and admins understand what went wrong and how to fix it.

---

## 🎯 APPLICATION SUBMISSION ERRORS

### ❌ Validation Failed (400)
**When:** User submits form with missing/invalid fields
```json
{
  "error": "Validation failed - please check your input",
  "userMessage": "Some required fields are missing or invalid. Please check the details below and try again.",
  "details": [
    "Name must be at least 2 characters",
    "Email is required",
    "Phone must be a valid number"
  ]
}
```
**User sees:** "Some fields are missing or invalid. Please fix them."

---

### ⚠️ Duplicate Email (409)
**When:** Same email submits application twice
```json
{
  "error": "An application with this email already exists",
  "message": "You have already submitted an application with this email address. Please use a different email or contact support if you need to update your application."
}
```
**User sees:** "You've already applied with this email. Use a different email or contact us."

---

### ⏳ Too Many Requests from IP (429)
**When:** Same network submits 10+ applications in 24 hours
```json
{
  "error": "Too many applications from your network",
  "message": "We have received too many applications from your IP address. Please try again later."
}
```
**User sees:** "Your network submitted too many applications. Try again in 24 hours."

---

### 🚫 Rate Limit Exceeded (429)
**When:** User tries to submit 50+ applications in 1 hour
```json
{
  "error": "Too many applications from this IP, please try again later",
  "message": "You have reached the maximum number of applications allowed per hour. Please wait before submitting again."
}
```
**User sees:** "Too many requests. Please try again later."

---

## 🔐 ADMIN AUTHENTICATION ERRORS

### ❌ Missing Credentials (400)
**When:** Admin login form is incomplete
```json
{
  "error": "Email and password are required",
  "message": "Please enter both your email address and password to log in."
}
```
**Admin sees:** "Please enter email and password."

---

### 🔑 Invalid Credentials (401)
**When:** Wrong email or password
```json
{
  "error": "Invalid credentials",
  "message": "Email or password is incorrect. Please check and try again."
}
```
**Admin sees:** "Email or password is incorrect."

---

### 🔓 Session Expired (401)
**When:** JWT token is not valid
```json
{
  "error": "Invalid token",
  "userMessage": "Your session token is invalid. Please log in again to continue."
}
```
**Admin sees:** "Session invalid. Please log in again."

---

### ⏰ Session Timeout (401)
**When:** Token expires after 7 days
```json
{
  "error": "Session expired",
  "userMessage": "Your session has expired. Please log in again to continue."
}
```
**Admin sees:** "Your session expired. Log in again."

---

### 🔐 Unauthorized Access (401)
**When:** Admin tries to access protected route without token
```json
{
  "error": "Authentication required",
  "message": "You must be logged in as an admin to access applications. Please log in first."
}
```
**Admin sees:** "You must log in to access this."

---

## 📝 ADMIN ACCOUNT CREATION ERRORS

### ❌ Missing Fields (400)
**When:** Email or password not provided
```json
{
  "error": "Email and password are required",
  "message": "Please provide both an email address and password for the new admin account."
}
```

---

### 🔑 Weak Password (400)
**When:** Password less than 6 characters
```json
{
  "error": "Password too short",
  "message": "Password must be at least 6 characters long for security reasons."
}
```
**Dev sees:** "Password must be 6+ characters."

---

### ⚠️ Account Already Exists (409)
**When:** Admin tries to create account with existing email
```json
{
  "error": "Admin account already exists",
  "message": "An admin account with this email already exists. Contact support if you need help."
}
```
**Dev sees:** "This admin account already exists."

---

## 🔄 PASSWORD CHANGE ERRORS

### ❌ Missing Passwords (400)
**When:** Current or new password not provided
```json
{
  "error": "Both passwords are required",
  "message": "Please provide your current password and the new password you want to set."
}
```

---

### 🔑 New Password Too Short (400)
**When:** New password less than 6 characters
```json
{
  "error": "Password too short",
  "message": "Your new password must be at least 6 characters long for security."
}
```

---

### ❌ Wrong Current Password (401)
**When:** Admin enters incorrect current password
```json
{
  "error": "Current password is incorrect",
  "message": "The current password you entered does not match. Please verify and try again."
}
```
**Admin sees:** "Your current password is wrong."

---

## 📊 ADMIN DASHBOARD ERRORS

### 🔐 Not Authenticated (401)
**When:** Admin tries to view dashboard without login
```json
{
  "error": "Authentication required",
  "message": "You must be logged in as an admin to view statistics. Please log in first."
}
```

---

### ❌ Applicant Not Found (404)
**When:** Admin tries to view deleted applicant
```json
{
  "error": "Applicant not found",
  "message": "The applicant with this ID could not be found. It may have been deleted."
}
```
**Admin sees:** "This applicant doesn't exist or was deleted."

---

### ❌ Applicant Not Found for Update (404)
**When:** Admin tries to update status of deleted applicant
```json
{
  "error": "Invalid status provided",
  "message": "Status must be one of: Pending, Shortlisted, Rejected. You provided: \"invalid\""
}
```

---

### ❌ Invalid Status (400)
**When:** Admin tries to set invalid status
```json
{
  "error": "Invalid status provided",
  "message": "Status must be one of: Pending, Shortlisted, Rejected. You provided: \"Waiting\""
}
```
**Admin sees:** "Valid statuses: Pending, Shortlisted, Rejected."

---

### ❌ Applicant Not Found for Delete (404)
**When:** Admin tries to delete already-deleted applicant
```json
{
  "error": "Applicant not found",
  "message": "Cannot delete - applicant with ID 123abc does not exist or has already been deleted."
}
```

---

## 🛠️ TECHNICAL ERRORS

### ⚠️ Invalid ID Format (400)
**When:** Invalid MongoDB ObjectId is passed
```json
{
  "error": "Invalid ID format",
  "userMessage": "The ID you provided is not valid. Please check the URL or ID and try again."
}
```

---

### ⚠️ Duplicate Field (409)
**When:** Unique field like email is duplicated in database
```json
{
  "error": "Email already exists",
  "userMessage": "This email has already been registered. Please use a different email or contact support if you need help."
}
```

---

### 💥 Server Error (500)
**When:** Unexpected server error
```json
{
  "error": "Internal Server Error",
  "userMessage": "Something went wrong on our end. Please try again later or contact support."
}
```
**User sees:** "Something went wrong. Please try again later."

---

## 📱 FRONTEND ERROR HANDLING

The frontend displays these messages in error alerts:

### For Status 409 (Duplicate)
```
Error: "This email has already been submitted"
```

### For Status 429 (Rate Limit)
```
Error: "Too many requests. Please try again later"
```

### For Status 401 (Unauthorized)
```
Error: "You must log in to access this"
```

### For Status 500 (Server Error)
```
Error: "Server error. Please try again later"
```

---

## 🎯 Error Response Format

Every error now includes:

```json
{
  "error": "Technical error name",
  "message": "Detailed explanation (for applicants/admins)",
  "userMessage": "User-friendly message (shown in UI)",
  "details": ["specific field errors if validation error"]
}
```

**Users see:** `message` or `userMessage`
**Developers see:** `error` + `details` in console
**Admins see:** Clear, actionable messages

---

## ✅ How Users See Errors

### ❌ Form Validation
```
Error Alert Box:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"Some fields are missing or invalid. 
Please check the details below and try again."

Details:
• Name must be at least 2 characters
• Email must be valid
• Phone must be a number
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### ⚠️ Duplicate Email
```
Error Alert Box:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"You've already applied with this email. 
Use a different email or contact support 
if you need to update your application."
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 🚫 Rate Limit
```
Error Alert Box:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"Your network submitted too many applications.
Please try again in 24 hours."
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🔐 Admin Login Errors

### Clear Error Messages
```
"Email or password is incorrect. 
Please check and try again."
```

☝️ **Why this is better:** 
- Doesn't reveal whether email exists (security)
- Tells admin to check both fields
- Clear next action

---

## 📊 Summary

✅ **Total Error Cases Covered:** 25+
✅ **User-Friendly Messages:** All errors now have them
✅ **Technical Errors:** Have detailed logs for debugging
✅ **Frontend Integration:** All messages shown in UI
✅ **Accessibility:** Clear, actionable guidance for every error

Every user and admin will now understand:
1. **What went wrong** ← "Validation failed"
2. **Why it happened** ← "Email already exists"  
3. **What to do next** ← "Use a different email or contact support"

