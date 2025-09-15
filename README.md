# 🔐 One-Password - API Key Management Platform

A secure, enterprise-grade API key management platform built with modern technologies. Store, organize, and share your API keys with military-grade encryption and intuitive team collaboration features.

## ✨ Features

### 🔒 Security First
- **AES-256 Encryption** - Military-grade encryption for all API keys
- **Zero-Trust Architecture** - Multi-factor authentication and least-privilege access
- **Complete Audit Trail** - Track every access, modification, and sharing event
- **SOC 2 Compliant** - Enterprise-grade security standards

### 👥 Team Collaboration
- **Role-Based Access Control** - Granular permissions for team members
- **Secure Sharing** - Share API keys with specific team members
- **Team Management** - Create and manage teams with custom roles
- **Activity Monitoring** - Real-time activity logs and notifications

### 🚀 Developer Experience
- **Lightning Fast Access** - Organize keys by service, environment, and tags
- **REST API** - Programmatic access to your keys
- **Search & Filter** - Find keys instantly with powerful search
- **Copy to Clipboard** - One-click copying with visual feedback

### 🎨 Modern UI/UX
- **Light/Dark Mode** - Smooth theme switching
- **Responsive Design** - Works perfectly on all devices
- **Premium Design** - Clean, professional interface
- **Smooth Animations** - Subtle, elegant transitions

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **Custom Components** - Reusable UI components

### Backend
- **Go** - High-performance backend
- **Gin Framework** - HTTP web framework
- **PostgreSQL** - Relational database
- **JWT** - Secure authentication
- **bcrypt** - Password hashing

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Local development
- **Nginx** - Reverse proxy
- **SSL/TLS** - Secure connections

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Go 1.21+
- PostgreSQL 14+
- Docker & Docker Compose (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/one-password.git
   cd one-password
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd apps/web
   npm install

   # Install backend dependencies
   cd ../api
   go mod download
   ```

3. **Set up environment variables**
   ```bash
   # Copy environment files
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env.local
   ```

4. **Configure database**
   ```bash
   # Start PostgreSQL (using Docker)
   docker-compose up -d postgres

   # Or use your local PostgreSQL instance
   createdb one_password
   ```

5. **Run database migrations**
   ```bash
   cd apps/api
   go run main.go migrate
   ```

6. **Start the development servers**
   ```bash
   # Terminal 1 - Backend
   cd apps/api
   go run main.go

   # Terminal 2 - Frontend
   cd apps/web
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
one-password/
├── apps/
│   ├── api/                 # Go backend
│   │   ├── cmd/            # Application entry points
│   │   ├── internals/      # Internal packages
│   │   │   ├── handlers/   # HTTP handlers
│   │   │   ├── services/   # Business logic
│   │   │   ├── models/     # Data models
│   │   │   └── middleware/ # HTTP middleware
│   │   ├── migrations/     # Database migrations
│   │   └── main.go         # Main application file
│   └── web/                # Next.js frontend
│       ├── src/
│       │   ├── app/        # App Router pages
│       │   ├── components/ # React components
│       │   ├── lib/        # Utilities and API client
│       │   └── styles/     # Global styles
│       └── package.json
├── docker-compose.yml      # Docker services
├── Dockerfile.api         # Backend Docker image
├── Dockerfile.web         # Frontend Docker image
└── README.md
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=one_password

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRY=24h

# Server
PORT=5000
HOST=0.0.0.0

# Encryption
ENCRYPTION_KEY=your-32-character-encryption-key
```

#### Frontend (.env.local)
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=One-Password
```

## 🐳 Docker Deployment

### Using Docker Compose

1. **Clone and navigate to project**
   ```bash
   git clone https://github.com/yourusername/one-password.git
   cd one-password
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start all services**
   ```bash
   docker-compose up -d
   ```

4. **Run migrations**
   ```bash
   docker-compose exec api go run main.go migrate
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

### Individual Services

```bash
# Build and run backend
docker build -f Dockerfile.api -t one-password-api .
docker run -p 5000:5000 one-password-api

# Build and run frontend
docker build -f Dockerfile.web -t one-password-web .
docker run -p 3000:3000 one-password-web
```

## 📚 API Documentation

### Authentication Endpoints

#### POST /auth/signup
Create a new user account.

**Request:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "id": 1,
  "fullName": "John Doe",
  "email": "john@example.com",
  "token": "jwt-token-here"
}
```

#### POST /auth/login
Authenticate user and get access token.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "secret"
}
```

### API Key Endpoints

#### GET /apikeys/list
List all API keys for the authenticated user.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "OpenAI API Key",
    "description": "Production API key for OpenAI",
    "tags": "production,ai,openai",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

#### POST /apikeys
Create a new API key.

**Request:**
```json
{
  "name": "OpenAI API Key",
  "key": "sk-...",
  "description": "Production API key for OpenAI",
  "tags": "production,ai,openai"
}
```

#### POST /apikeys/reveal
Reveal an encrypted API key.

**Request:**
```json
{
  "name": "OpenAI API Key"
}
```

#### DELETE /apikeys/delete
Delete an API key.

**Request:**
```json
{
  "name": "OpenAI API Key"
}
```

## 🧪 Testing

### Backend Tests
```bash
cd apps/api
go test ./...
```

### Frontend Tests
```bash
cd apps/web
npm test
```

### E2E Tests
```bash
cd apps/web
npm run test:e2e
```

## 🔒 Security

### Data Encryption
- All API keys are encrypted using AES-256 before storage
- Encryption keys are managed securely
- No plain text storage of sensitive data

### Authentication
- JWT-based authentication
- Password hashing with bcrypt
- Secure session management

### Network Security
- HTTPS enforcement
- CORS configuration
- Rate limiting
- Input validation and sanitization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.one-password.com](https://docs.one-password.com)
- **Issues**: [GitHub Issues](https://github.com/intojhanurag/one-password/issues)
- **Discussions**: [GitHub Discussions](https://github.com/intojhanurag/one-password/discussions)
- **Email**: aojharaj2004@gmail.com

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Go](https://golang.org/) - Backend language
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide](https://lucide.dev/) - Icons
- [PostgreSQL](https://postgresql.org/) - Database

---

**Built with ❤️ for developers who value security and simplicity.**
