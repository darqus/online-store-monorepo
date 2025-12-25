#!/bin/bash

# Deployment Readiness Check for Vercel + Supabase
# This script validates the project structure for free deployment

echo "🔍 Validating project structure for FREE Vercel + Supabase deployment..."
echo "   ✅ COMPLETELY FREE - No credit cards, no limits, no sleeping!"
echo ""

# Check if vercel.json exists
if [ ! -f "vercel.json" ]; then
    echo "❌ vercel.json not found!"
    echo "   This file configures Vercel deployment"
    exit 1
fi

# Check client directory and build setup
if [ ! -d "client" ]; then
    echo "❌ client/ directory not found!"
    exit 1
fi

if [ ! -f "client/package.json" ]; then
    echo "❌ client/package.json missing!"
    exit 1
fi

# Check server directory and migrations
if [ ! -d "server" ]; then
    echo "❌ server/ directory not found!"
    exit 1
fi

if [ ! -f "server/package.json" ]; then
    echo "❌ server/package.json missing!"
    exit 1
fi

# Check migrations directory
if [ ! -d "server/migrations" ] || [ ! -d "server/seeders" ]; then
    echo "❌ server/migrations or server/seeders directories missing!"
    exit 1
fi

# Check Vercel API routes
if [ ! -d "vercel/api" ]; then
    echo "❌ vercel/api/ directory not found!"
    echo "   API routes for Vercel serverless functions"
    exit 1
fi

echo "✅ Project structure validated!"
echo ""

# Check for sensitive data
echo "🔍 Checking for sensitive data..."

if grep -r "SECRET_KEY.*=" --exclude-dir=node_modules --exclude-dir=.git . | grep -v "generateValue\|fromService\|fromDatabase" | grep -v "vercel.json" | grep -v "README.md" | head -3; then
    echo "⚠️  Found hardcoded SECRET_KEY values!"
    echo "   This is OK for local development, but use environment variables in production"
fi

if grep -r "DATABASE_URL.*=" --exclude-dir=node_modules --exclude-dir=.git . | grep -v "vercel.json" | grep -v "README.md" | head -3; then
    echo "⚠️  Found hardcoded DATABASE_URL values!"
    echo "   This is OK for local development, but use environment variables in production"
fi

echo "✅ Ready for FREE deployment!"
echo ""

echo "🎯 VERCEL + SUPABASE DEPLOYMENT GUIDE:"
echo ""
echo "1️⃣ SUPABASE (Database):"
echo "   🌐 https://supabase.com"
echo "   📝 Create project → SQL Editor"
echo "   🏗️ Run migrations from server/migrations/*.js"
echo "   🌱 Run seeders from server/seeders/*.js"
echo "   🔑 Copy connection string from Settings > Database"
echo ""
echo "2️⃣ VERCEL (Frontend + API):"
echo "   🌐 https://vercel.com"
echo "   🔗 Connect GitHub repository"
echo "   ⚙️ Set Environment Variables:"
echo "      DATABASE_URL=postgresql://[supabase-connection]"
echo "      SECRET_KEY=your-super-secret-key-32-chars-min"
echo "      NODE_ENV=production"
echo "   🚀 Deploy automatically!"
echo ""
echo "3️⃣ CHECK DEPLOYMENT:"
echo "   🌐 Frontend: https://your-project.vercel.app"
echo "   🔍 API Health: https://your-project.vercel.app/api/health"
echo "   📊 API Types: https://your-project.vercel.app/api/types"
echo ""
echo "✨ COMPLETELY FREE FOREVER - No payments, no limits, no sleeping! ✨"
