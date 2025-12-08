#!/bin/sh
set -e

echo "🚀 Starting Todo App..."

echo "📊 Running database migrations..."
pnpm prisma migrate deploy

echo "✅ Migrations completed successfully!"

echo "🌐 Starting Next.js application..."
exec pnpm start

