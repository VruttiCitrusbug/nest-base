# Create .env file
cp .env.example .env

# Edit .env file with your database credentials
# Then run:

# Install dependencies
npm install

# Create database
npm run db:create

# Run migrations
npm run migrate

# Seed database (optional)
npm run seed

# Start development server
npm run dev

# Server will be running at http://localhost:3000
# Health check: http://localhost:3000/health
# API endpoint: http://localhost:3000/api/users
