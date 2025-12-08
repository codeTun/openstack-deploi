#!/bin/sh
set -e

echo "🚀 Starting Todo App..."

echo "⏳ Waiting for database to be ready..."
sleep 5

echo "📊 Synchronizing database schema..."
pnpm prisma db push --accept-data-loss --skip-generate

echo "✅ Database schema synchronized successfully!"

echo "🌐 Starting Next.js application..."
exec pnpm start

