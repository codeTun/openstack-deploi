# 📋 Creative Todo App - Full Stack

A beautiful, responsive, and fully-featured todo application built with Next.js 16, Prisma ORM, and Tailwind CSS. Perfect for managing your tasks with priorities, categories, and due dates.

## ✨ Features

- ✅ **Create, Read, Update, Delete (CRUD)** - Full todo management
- 📌 **Priorities** - Low, Medium, High priority levels with visual indicators
- 🏷️ **Categories** - Organize todos by category (work, personal, shopping, health, finance, general)
- 📅 **Due Dates** - Set and track task deadlines
- 🔍 **Smart Filtering** - Filter by status, priority, and category
- 🌙 **Dark Mode** - Full dark mode support out of the box
- 📱 **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- ⚡ **Real-time Updates** - Instant feedback without page refresh
- 🎨 **Beautiful UI** - Modern gradient design with smooth animations
- 💾 **PostgreSQL Database** - Persistent data storage

## 🏗️ Project Structure

```
cloud-project/
├── app/
│   ├── api/
│   │   └── todos/
│   │       ├── route.ts           # GET, POST todos
│   │       └── [id]/
│   │           └── route.ts       # GET, PATCH, DELETE single todo
│   ├── layout.tsx
│   ├── page.tsx                   # Main page
│   └── globals.css
├── components/
│   └── TodoApp.tsx               # Main todo component
├── lib/
│   ├── prisma.ts                 # Prisma client instance
│   ├── models/
│   │   └── todo.ts               # Todo TypeScript interfaces
│   └── api/
│       ├── fetchers.ts           # GET requests
│       ├── posters.ts            # POST requests
│       ├── puters.ts             # PATCH requests
│       ├── deleters.ts           # DELETE requests
│       └── index.ts              # API exports
├── prisma/
│   └── schema.prisma             # Database schema
├── package.json
├── tsconfig.json
└── next.config.ts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ (currently 20.16.0)
- pnpm (package manager)
- PostgreSQL database (using Prisma hosted database)

### Installation

1. **Install dependencies**

```bash
pnpm install
```

2. **Database Setup**
   - The `.env` file contains your PostgreSQL connection string
   - When database is accessible, run:

```bash
pnpm exec prisma migrate dev --name init
```

3. **Generate Prisma Client**

```bash
pnpm exec prisma generate
```

4. **Run development server**

```bash
pnpm dev
```

5. **Open in browser**
   - Navigate to `http://localhost:3000`

## 📚 API Documentation

### Base URL

`/api/todos`

### GET /api/todos

Get all todos with optional filtering

**Query Parameters:**

- `completed` (boolean) - Filter by completion status
- `priority` (string) - Filter by priority: "low", "medium", "high"
- `category` (string) - Filter by category

**Example:**

```bash
GET /api/todos?completed=false&priority=high
```

**Response:**

```json
[
  {
    "id": 1,
    "title": "Complete project",
    "description": "Finish the todo app",
    "completed": false,
    "priority": "high",
    "category": "work",
    "dueDate": "2025-12-15T00:00:00.000Z",
    "createdAt": "2025-12-06T12:00:00.000Z",
    "updatedAt": "2025-12-06T12:00:00.000Z"
  }
]
```

### POST /api/todos

Create a new todo

**Request Body:**

```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "priority": "medium",
  "category": "shopping",
  "dueDate": "2025-12-10"
}
```

**Response:** (201 Created)

```json
{
  "id": 1,
  "title": "Buy groceries",
  ...
}
```

### PATCH /api/todos/[id]

Update a todo

**Request Body:** (all fields optional)

```json
{
  "title": "Updated title",
  "completed": true,
  "priority": "low"
}
```

**Response:**

```json
{
  "id": 1,
  "title": "Updated title",
  ...
}
```

### DELETE /api/todos/[id]

Delete a todo

**Response:**

```json
{
  "message": "Todo deleted successfully"
}
```

## 🔧 API Functions

### Using the API Functions

Import functions from `@/lib/api`:

```typescript
import { fetchTodos, createTodo, updateTodo, deleteTodo } from "@/lib/api";

// Fetch todos
const todos = await fetchTodos({ completed: false });

// Create todo
const newTodo = await createTodo({
  title: "New task",
  priority: "high",
  category: "work",
});

// Update todo
const updated = await updateTodo(1, { completed: true });

// Delete todo
await deleteTodo(1);
```

### Available Functions

#### `fetchers.ts`

- `fetchTodos(filters?)` - Get todos with optional filters
- `fetchTodo(id)` - Get single todo

#### `posters.ts`

- `createTodo(data)` - Create new todo

#### `puters.ts`

- `updateTodo(id, data)` - Update existing todo

#### `deleters.ts`

- `deleteTodo(id)` - Delete todo

## 🎨 Customization

### Priorities

Edit `PRIORITIES`, `PRIORITY_COLORS`, and `PRIORITY_ICONS` in `components/TodoApp.tsx`

### Categories

Add new categories to `CATEGORIES` and `CATEGORY_EMOJIS` in `components/TodoApp.tsx`

### Colors

Modify Tailwind classes or the gradient colors in `globals.css`

## 🗄️ Database Schema

```prisma
model Todo {
  id          Int     @id @default(autoincrement())
  title       String
  description String?
  completed   Boolean @default(false)
  priority    String  @default("medium")
  category    String  @default("general")
  dueDate     DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([completed])
  @@index([priority])
  @@index([category])
}
```

## 🌙 Dark Mode

Dark mode is automatically supported via Tailwind CSS. The app uses the system preference or `dark` class on the HTML element.

## 🚢 Deployment

### Using Vercel (Recommended)

1. Push code to GitHub
2. Connect to Vercel
3. Set `DATABASE_URL` environment variable
4. Deploy

```bash
vercel deploy
```

### Using Docker

Create a `Dockerfile`:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm run build
EXPOSE 3000
CMD ["pnpm", "start"]
```

## 📦 Dependencies

- **Next.js 16** - React framework
- **React 19** - UI library
- **Prisma 5.20** - ORM
- **Tailwind CSS 4** - Styling
- **Lucide React** - Icons
- **PostgreSQL** - Database

## 🔐 Environment Variables

```env
DATABASE_URL="postgres://user:password@host:port/database?sslmode=require"
```

## 🐛 Troubleshooting

### Database Connection Timeout

- Check DATABASE_URL is correct
- Ensure PostgreSQL is running
- Verify network connectivity

### Prisma Generate Issues

```bash
pnpm exec prisma generate --skip-engine
```

### Port 3000 Already in Use

```bash
PORT=3001 pnpm dev
```

## 📝 License

MIT - Feel free to use this project for personal and commercial purposes

## 🎉 Ready to Use!

Your todo app is production-ready. Start adding tasks and organizing your life! ✨

---

Built with ❤️ using Next.js, Prisma & Tailwind CSS
