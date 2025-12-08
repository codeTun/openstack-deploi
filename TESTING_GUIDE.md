# 🧪 Testing Guide - Authentication & Todo App

## Quick Test Checklist

### ✅ Before Testing

1. **Start the development server:**
   ```bash
   pnpm dev
   ```

2. **Open browser:**
   ```
   http://localhost:3000
   ```

---

## 🔐 Test 1: User Registration

1. ✅ You should see the **Login/Register** page
2. ✅ Click "**Sign up**" (or "Don't have an account?")
3. ✅ Fill in the form:
   - **Name:** Test User
   - **Email:** test@example.com
   - **Password:** Test1234
4. ✅ Click "**Create Account**"
5. ✅ You should be automatically logged in and see the Todo app

**Expected Result:**
- ✅ Redirected to todo list
- ✅ Header shows "Test User" with avatar
- ✅ Empty todo list (first time user)

---

## 🔓 Test 2: User Logout

1. ✅ Click the "**Logout**" button in the header
2. ✅ Confirm logout

**Expected Result:**
- ✅ Redirected back to login page
- ✅ Session cleared

---

## 🔑 Test 3: User Login

1. ✅ On the login page, fill in:
   - **Email:** test@example.com
   - **Password:** Test1234
2. ✅ Click "**Sign In**"

**Expected Result:**
- ✅ Redirected to todo list
- ✅ Header shows your name
- ✅ Your previous todos are still there

---

## ✏️ Test 4: Create Todos

1. ✅ Create a todo:
   - **Title:** "Buy groceries"
   - **Description:** "Milk, bread, eggs"
   - **Priority:** High
   - **Status:** Pending
2. ✅ Click "**Add Task**"

**Expected Result:**
- ✅ Todo appears in the list
- ✅ Shows priority badge (🔥 HIGH)
- ✅ Shows status badge (⏳ PENDING)

---

## 🎭 Test 5: User Isolation

This is the most important test to verify each user has their own todos!

### Part A: Create todos for User 1

1. ✅ Logged in as `test@example.com`
2. ✅ Create 2-3 todos
3. ✅ Note the todo titles
4. ✅ Logout

### Part B: Register a second user

1. ✅ Click "Sign up"
2. ✅ Register as:
   - **Name:** User Two
   - **Email:** user2@example.com
   - **Password:** Pass1234
3. ✅ Click "Create Account"

### Part C: Verify isolation

**Expected Result:**
- ✅ User Two sees an **empty todo list**
- ✅ User Two does NOT see User One's todos

### Part D: Create todos for User 2

1. ✅ Create 1-2 different todos for User Two
2. ✅ Logout

### Part E: Login back as User 1

1. ✅ Login as `test@example.com` / `Test1234`

**Expected Result:**
- ✅ User One sees ONLY their original todos
- ✅ User One does NOT see User Two's todos

**✅ TEST PASSED:** Users are properly isolated! 🎉

---

## 🔧 Test 6: Todo Operations

### Update Todo
1. ✅ Click the **edit** button (✏️) on a todo
2. ✅ Change the title, priority, or status
3. ✅ Click "**Update Task**"

**Expected Result:**
- ✅ Todo is updated
- ✅ Changes are saved

### Complete Todo
1. ✅ Click the **circle** button (○) next to a todo
2. ✅ Todo should be marked as complete (✅)
3. ✅ Text becomes strikethrough

**Expected Result:**
- ✅ Status changes to COMPLETED
- ✅ Visual feedback (checkmark, opacity)

### Delete Todo
1. ✅ Click the **delete** button (🗑️) on a todo
2. ✅ Confirm deletion

**Expected Result:**
- ✅ Todo is removed from the list

---

## 🎨 Test 7: Filters

1. ✅ Create todos with different statuses and priorities
2. ✅ Test filters:
   - All / Active / Completed
   - Status filters (Pending, In Progress, Completed)
   - Priority filters (Low, Medium, High)

**Expected Result:**
- ✅ Filters work correctly
- ✅ Only matching todos are shown

---

## 🌐 Test 8: API Endpoints (Optional - Advanced)

### Test with cURL or Postman

#### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "api@test.com",
    "password": "Test1234",
    "name": "API Tester"
  }' \
  -c cookies.txt -v
```

#### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "api@test.com",
    "password": "Test1234"
  }' \
  -c cookies.txt -v
```

#### Get Current User
```bash
curl http://localhost:3000/api/auth/me \
  -b cookies.txt
```

#### Create Todo
```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "API Created Todo",
    "priority": "HIGH",
    "status": "PENDING"
  }'
```

#### Get User's Todos
```bash
curl http://localhost:3000/api/todos \
  -b cookies.txt
```

---

## ❌ Test 9: Error Handling

### Invalid Registration
1. ✅ Try to register with:
   - Short password (< 8 chars)
   - Invalid email format
   - Duplicate email

**Expected Result:**
- ✅ Error message shown
- ✅ User not created

### Invalid Login
1. ✅ Try to login with:
   - Wrong password
   - Non-existent email

**Expected Result:**
- ✅ "Invalid email or password" error
- ✅ User not logged in

### Unauthorized Access
1. ✅ Logout
2. ✅ Try to access: `http://localhost:3000/api/todos`

**Expected Result:**
- ✅ 401 Unauthorized error
- ✅ "Unauthorized. Please login." message

---

## 📱 Test 10: Responsive Design

1. ✅ Test on different screen sizes:
   - Desktop (1920x1080)
   - Tablet (768x1024)
   - Mobile (375x667)

2. ✅ Open browser DevTools
3. ✅ Toggle device toolbar
4. ✅ Test different viewports

**Expected Result:**
- ✅ Layout adapts to screen size
- ✅ All buttons and inputs are accessible
- ✅ No horizontal scrolling
- ✅ Touch-friendly on mobile

---

## 🌙 Test 11: Dark Mode

1. ✅ Check if your system is in dark mode
2. ✅ App should automatically match system theme

**Expected Result:**
- ✅ Dark background with light text
- ✅ All colors are readable
- ✅ No bright flashes

---

## 🚀 Test 12: Performance

1. ✅ Create 20+ todos
2. ✅ Test filtering and searching
3. ✅ Check loading times

**Expected Result:**
- ✅ Smooth scrolling
- ✅ Fast filter updates
- ✅ No lag when adding/editing todos

---

## 🐳 Test 13: Docker Deployment (Local)

### Build and Run

```bash
# Build Docker image
docker compose build

# Start all services
docker compose up -d

# Check logs
docker compose logs -f server

# Wait for "Ready" message
```

### Test in Docker

1. ✅ Open: `http://localhost:3000`
2. ✅ Register a new user
3. ✅ Create todos
4. ✅ Test all features

### Test Data Persistence

```bash
# Restart containers
docker compose restart

# Open app again
http://localhost:3000
```

**Expected Result:**
- ✅ User still logged in (or can login)
- ✅ All todos are still there
- ✅ No data lost

### Clean Up

```bash
# Stop containers
docker compose down

# Remove volumes (⚠️ deletes data)
docker compose down -v
```

---

## ✅ Final Checklist

### Authentication
- [ ] User can register
- [ ] User can login
- [ ] User can logout
- [ ] Invalid credentials show error
- [ ] JWT token is set in cookies
- [ ] Protected routes require login

### User Isolation
- [ ] Each user sees only their todos
- [ ] Users cannot access other users' todos
- [ ] Creating todo links to current user

### Todo Operations
- [ ] Create todo
- [ ] Read todos
- [ ] Update todo
- [ ] Delete todo
- [ ] Toggle completion
- [ ] Filters work correctly

### UI/UX
- [ ] Responsive design
- [ ] Dark mode support
- [ ] Loading states
- [ ] Error messages
- [ ] Smooth animations
- [ ] Avatar and user info displayed

### Docker
- [ ] App runs in Docker
- [ ] Database persists data
- [ ] Migrations run automatically
- [ ] Environment variables work

---

## 🎉 All Tests Passed?

Congratulations! Your Todo App with Authentication is working perfectly! 🚀

### Next Steps:
1. ✅ Deploy to production (Ubuntu VM)
2. ✅ Set strong JWT_SECRET
3. ✅ Set strong database passwords
4. ✅ Enable HTTPS (recommended)
5. ✅ Set up backups

---

## 🆘 Common Issues

### Issue: "Unauthorized" on all requests

**Solution:**
```bash
# Check if JWT_SECRET is set
cat .env | grep JWT_SECRET

# If not, add it:
echo 'JWT_SECRET=your-secret-key-here' >> .env

# Restart dev server
pnpm dev
```

### Issue: "User not found" after registration

**Solution:**
```bash
# Regenerate Prisma client
pnpm prisma generate

# Restart dev server
pnpm dev
```

### Issue: Can't create todos

**Solution:**
```bash
# Check if you're logged in
# Open browser DevTools → Application → Cookies
# Look for "token" cookie

# If missing, logout and login again
```

### Issue: Database connection error

**Solution:**
```bash
# Check DATABASE_URL in .env
cat .env | grep DATABASE_URL

# Test database connection
pnpm prisma db push
```

---

## 📝 Test Results Template

```
Test Date: ___________
Tester: ___________

[ ] Test 1: User Registration
[ ] Test 2: User Logout
[ ] Test 3: User Login
[ ] Test 4: Create Todos
[ ] Test 5: User Isolation ⭐ IMPORTANT
[ ] Test 6: Todo Operations
[ ] Test 7: Filters
[ ] Test 8: API Endpoints
[ ] Test 9: Error Handling
[ ] Test 10: Responsive Design
[ ] Test 11: Dark Mode
[ ] Test 12: Performance
[ ] Test 13: Docker Deployment

Overall Result: PASS / FAIL
Notes: ____________________
```

---

Happy Testing! 🧪✨

