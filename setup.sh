#!/bin/bash

# TEDxKARE Setup Script
# This script automates the initial setup of the project

echo "==================================="
echo "TEDxKARE Recruitment Portal Setup"
echo "==================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16+ first."
    exit 1
fi

echo "✅ Node.js detected: $(node --version)"
echo ""

# Setup Backend
echo "--- SETTING UP BACKEND ---"
cd backend

if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "✅ .env created. Please edit it with your configuration."
else
    echo "✅ .env already exists"
fi

echo "Installing backend dependencies..."
npm install

echo "✅ Backend setup complete!"
echo ""

# Setup Frontend
echo "--- SETTING UP FRONTEND ---"
cd ../frontend

if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "✅ .env created"
else
    echo "✅ .env already exists"
fi

echo "Installing frontend dependencies..."
npm install

echo "✅ Frontend setup complete!"
echo ""

# Summary
echo "==================================="
echo "✅ Setup Complete!"
echo "==================================="
echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Configure Environment Variables:"
echo "   - Backend: backend/.env"
echo "   - Frontend: frontend/.env"
echo ""
echo "2. Start Backend (Terminal 1):"
echo "   cd backend && npm run dev"
echo ""
echo "3. Start Frontend (Terminal 2):"
echo "   cd frontend && npm run dev"
echo ""
echo "4. Create Admin Account:"
echo "   POST http://localhost:5000/api/admin/create"
echo "   Body: {\"email\":\"admin@tedxkare.com\",\"password\":\"your_password\"}"
echo ""
echo "5. Access Application:"
echo "   - Frontend: http://localhost:5173"
echo "   - Admin: http://localhost:5173/admin"
echo ""
echo "📚 For more details, see README.md and QUICKSTART.md"
echo ""
