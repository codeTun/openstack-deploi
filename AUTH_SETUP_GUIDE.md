# 🔐 Authentication Setup Guide

## Overview
Your Todo App now has a complete JWT-based authentication system! Each user has their own private todos.

---

## ✨ Features Added

### 1. **User Authentication**
- ✅ JWT-based authentication with secure cookies
- ✅ User registration with validation
- ✅ Login/Logout functionality
- ✅ Password hashing with bcrypt
- ✅ Email validation
- ✅ Protected API routes

### 2. **User-Specific Todos**
- ✅ Each user can only see/edit their own todos
- ✅ Todos are automatically linked to logged-in user
- ✅ Database relations: User → Todos

### 3. **Modern UI**
- ✅ Beautiful login/register page
- ✅ User profile header with avatar
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Loading states and error handling

---

## 🚀 Quick Start

### Step 1: Update Environment Variables

Make sure you have a JWT secret in your `.env` file:

```bash
# Create .env file if it doesn't exist
cp env.example .env

# Edit .env and add a strong JWT secret
JWT_SECRET=your-super-secret-jwt-key-here-use-a-long-random-string
```

**Generate a secure JWT secret:**
```bash
# On Linux/Mac
openssl rand -base64 64

# On Windows PowerShell
[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### Step 2: Generate Prisma Client

```bash
pnpm prisma generate
```

### Step 3: Run Development Server

```bash
pnpm dev
```

Open http://localhost:3000 - You'll see the login page!

---

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── register/route.ts    # User registration
│   │   │   ├── login/route.ts       # User login
│   │   │   ├── logout/route.ts      # User logout
│   │   │   └── me/route.ts          # Get current user
│   │   └── todos/
│   │       ├── route.ts             # Protected: CRUD todos
│   │       └── [id]/route.ts        # Protected: Single todo
│   ├── layout.tsx                   # AuthProvider wrapper
│   └── page.tsx                     # Home with AuthGuard
├── components/
│   ├── auth/
│   │   ├── AuthGuard.tsx           # Redirect if not authenticated
│   │   └── AuthPage.tsx            # Login/Register UI
│   ├── Header.tsx                  # User profile header
│   └── TodoApp.tsx                 # Todo list component
├── contexts/
│   └── AuthContext.tsx             # Auth state management
├── lib/
│   ├── auth.ts                     # JWT & password utilities
│   ├── middleware.ts               # Auth middleware
│   └── prisma.ts                   # Prisma client
└── prisma/
    └── schema.prisma               # User + Todo models
```

---

## 🔐 API Endpoints

### Authentication Routes

#### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe"
}

# Response: 201 Created
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}

# Response: 200 OK
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### Logout
```bash
POST /api/auth/logout

# Response: 200 OK
{
  "message": "Logged out successfully"
}
```

#### Get Current User
```bash
GET /api/auth/me

# Response: 200 OK
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00Z",
    "todosCount": 5
  }
}
```

### Todo Routes (All Protected)

All todo routes now require authentication. They automatically filter by user.

```bash
# Get user's todos
GET /api/todos

# Create todo (automatically assigned to logged-in user)
POST /api/todos
{
  "title": "My task",
  "description": "Task description",
  "priority": "HIGH",
  "status": "PENDING"
}

# Update/Delete - only if todo belongs to user
PATCH /api/todos/[id]
DELETE /api/todos/[id]
```

---

## 🔒 Security Features

### 1. **JWT Authentication**
- Tokens expire after 7 days
- Stored in HttpOnly cookies (not accessible via JavaScript)
- Secure flag (HTTPS only in production)
- SameSite=Strict (CSRF protection)

### 2. **Password Security**
- Bcrypt hashing with salt (10 rounds)
- Minimum 8 characters
- Must contain letters and numbers

### 3. **Email Validation**
- Valid email format required
- Case-insensitive (stored as lowercase)
- Unique constraint in database

### 4. **Protected Routes**
- All todo operations require authentication
- Users can only access their own todos
- Automatic user ID verification

---

## 🧪 Testing the Authentication

### 1. Test Registration

```bash
# Register a new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234",
    "name": "Test User"
  }' \
  -c cookies.txt
```

### 2. Test Login

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234"
  }' \
  -c cookies.txt
```

### 3. Test Protected Route

```bash
# Get user's todos (requires auth)
curl http://localhost:3000/api/todos \
  -b cookies.txt

# Create a todo
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "My first todo",
    "priority": "HIGH"
  }'
```

### 4. Test User Isolation

```bash
# Register second user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user2@example.com",
    "password": "Pass1234",
    "name": "User Two"
  }' \
  -c cookies2.txt

# Each user sees only their own todos
curl http://localhost:3000/api/todos -b cookies.txt    # User 1's todos
curl http://localhost:3000/api/todos -b cookies2.txt   # User 2's todos
```

---

## 🐳 Docker Deployment

The Docker setup is already configured for authentication!

### Environment Variables in Docker

Update your `.env` file before deploying:

```env
# Strong JWT secret for production
JWT_SECRET=<generate-a-secure-random-string>

# Database credentials
POSTGRES_USER=todouser
POSTGRES_PASSWORD=<secure-password>
POSTGRES_DB=tododb

# App port
APP_PORT=3000
```

### Deploy with Docker Compose

```bash
# Build and start
docker compose up -d

# Check logs
docker compose logs -f

# Access the app
# http://your-server-ip:3000
```

---

## 🔧 Troubleshooting

### Problem: "Unauthorized" error on all requests

**Solution:** Make sure JWT_SECRET is set in environment variables:
```bash
# Check if JWT_SECRET is set
echo $JWT_SECRET

# Or in .env file
grep JWT_SECRET .env
```

### Problem: Users can't login after registration

**Solution:** Check database connection and ensure Prisma migrations ran:
```bash
pnpm prisma migrate dev
pnpm prisma generate
```

### Problem: Cookies not being set

**Solution:** 
1. Make sure you're testing on the same domain
2. Check browser dev tools → Application → Cookies
3. Ensure Secure flag is off in development

### Problem: "User not found" but user exists

**Solution:** Database might need a fresh migration:
```bash
# Reset database (⚠️ deletes all data)
pnpm prisma migrate reset

# Or just push schema
pnpm prisma db push
```

---

## 📊 Database Schema

### User Model
```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  password  String   // Hashed
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  todos     Todo[]   // One-to-many relation
}
```

### Todo Model
```prisma
model Todo {
  id          Int       @id @default(autoincrement())
  title       String
  description String?
  completed   Boolean   @default(false)
  status      STATUS    @default(PENDING)
  priority    PRIORITY  @default(MEDIUM)
  dueDate     DateTime?
  userId      Int       // Foreign key
  user        User      @relation(fields: [userId], references: [id])
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

---

## 🎨 UI Features

### Login/Register Page
- Beautiful gradient background
- Form validation
- Error messages
- Loading states
- Toggle between login/register

### Header Component
- User avatar (first letter of name)
- User name and email display
- Logout button
- Responsive design

### Protected Todo App
- Only accessible when logged in
- Automatic redirect to login
- Shows user's todos only

---

## 🚀 Next Steps

1. ✅ **Test the authentication** - Register and login
2. ✅ **Create some todos** - Verify user isolation
3. ✅ **Deploy with Docker** - Follow deployment guide
4. 🔜 **Add password reset** - (Optional enhancement)
5. 🔜 **Add email verification** - (Optional enhancement)
6. 🔜 **Add OAuth** - Google/GitHub login (Optional)

---

## 📝 Code Examples

### Using Auth in Components

```typescript
import { useAuth } from "@/contexts/AuthContext";

function MyComponent() {
  const { user, login, logout } = useAuth();

  if (!user) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <p>Welcome, {user.name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protecting API Routes

```typescript
import { requireAuth } from "@/lib/middleware";

export async function GET(request: Request) {
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult; // Unauthorized
  }
  
  const { user } = authResult;
  // user.userId, user.email, user.name available
  
  // Your protected logic here
}
```

---

## 🎉 Congratulations!

Your Todo App now has:
- ✅ Complete authentication system
- ✅ User-specific todos
- ✅ Beautiful modern UI
- ✅ Docker deployment ready
- ✅ Secure JWT authentication
- ✅ Protected API routes

Ready to deploy! 🚀

