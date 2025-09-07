# Frontend-Backend Connection

This document outlines how the frontend (Next.js) is connected to the backend (Go API).

## API Service

The frontend uses a centralized API service (`src/lib/api.ts`) that provides methods for all backend interactions:

### Authentication
- `signup(data)` - User registration
- `login(data)` - User authentication

### Dashboard
- `getDashboard()` - Get dashboard overview data
- `getTeamsDashboard()` - Get teams dashboard data

### API Keys Management
- `createAPIKey(data)` - Create new API key
- `listAPIKeys()` - List user's API keys
- `revealAPIKey(name)` - Reveal API key value
- `deleteAPIKey(name)` - Delete API key

### Teams Management
- `createTeam(data)` - Create new team
- `createTeamMembership(data)` - Add member to team
- `listTeamMemberships()` - List team memberships
- `deleteTeamMembership(data)` - Remove team member

### API Key-Team Relationships
- `attachAPIKeyToTeam(data)` - Assign API key to team
- `listAPIKeyTeams(teamId)` - List API keys for a team
- `detachAPIKeyFromTeam(data)` - Remove API key from team

### Activity
- `listActivities()` - Get user activity logs
- `getActivityStats()` - Get activity statistics

## Backend Endpoints

The backend provides the following endpoints (running on `http://localhost:5000`):

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User authentication

### Dashboard
- `GET /dashboard` - Dashboard overview
- `GET /dashboard/teams` - Teams dashboard

### API Keys
- `POST /apikeys` - Create API key
- `GET /apikeys/list` - List API keys
- `POST /apikeys/reveal` - Reveal API key
- `DELETE /apikeys/delete` - Delete API key

### Teams
- `POST /teams` - Create team

### Team Memberships
- `POST /team-memberships` - Add team member
- `GET /team-memberships/list` - List team memberships
- `DELETE /team-memberships/delete` - Remove team member

### API Key-Team Relationships
- `POST /apikey-teams` - Attach API key to team
- `GET /apikey-teams/list` - List team API keys
- `DELETE /apikey-teams/delete` - Detach API key from team

### Activity
- `GET /dashboard/activity` - List activities
- `GET /dashboard/activity/detail` - Activity statistics

## Authentication

The frontend uses JWT tokens for authentication:
1. User logs in via `/auth/login`
2. Backend returns JWT token
3. Token is stored in localStorage
4. Token is included in Authorization header for all API requests
5. Backend validates token using middleware

## CORS Configuration

The backend is configured to allow requests from `http://localhost:3000` (frontend development server).

## Error Handling

The API service includes comprehensive error handling:
- Network errors are caught and displayed to users
- HTTP errors are parsed and meaningful messages shown
- Authentication errors redirect to login page

## Pages Created

The following pages have been created to connect with backend functionality:

1. **Dashboard** (`/dashboard`) - Overview with stats and recent activity
2. **API Keys** (`/dashboard/keys`) - Manage API keys (create, list, reveal, delete)
3. **Teams** (`/dashboard/teams`) - Manage teams and memberships
4. **Activity** (`/dashboard/activity`) - View activity logs and statistics
5. **Security** (`/dashboard/security`) - Manage API key access and security settings
6. **Settings** (`/dashboard/settings`) - User profile and account settings

## Usage

1. Start the backend server: `cd apps/api && go run main.go`
2. Start the frontend development server: `cd apps/web && npm run dev`
3. Navigate to `http://localhost:3000`
4. Sign up for a new account or log in
5. Use the dashboard to manage API keys and teams

## Features Implemented

- ✅ User authentication (signup/login)
- ✅ Dashboard with overview statistics
- ✅ API key management (CRUD operations)
- ✅ Team management and memberships
- ✅ API key-team access control
- ✅ Activity logging and statistics
- ✅ Security settings and recommendations
- ✅ User profile management
- ✅ Responsive design with dark mode support
- ✅ Error handling and loading states
