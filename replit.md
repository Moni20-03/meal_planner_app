# AI-Powered Meal Planner

## Overview

An AI-powered meal planning application that generates personalized meal plans using OpenAI's GPT models. The system allows users to create customized meal plans based on dietary preferences, calorie targets, and serving sizes. Users can authenticate securely, generate AI-powered meal plans, view their meal history, and access dashboard statistics.

**Status**: Fully functional MVP with clean, modern UI. Ready for development and testing.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Application Structure

**Monorepo Architecture**: The application follows a client-server monorepo pattern with clear separation between frontend (`client/`) and backend (`server/`) code.

**In-Memory Data Storage**: Currently uses in-memory dictionaries for data persistence with auto-incrementing IDs. This MVP approach allows rapid development and can be migrated to SQLite or PostgreSQL without changing the API interface. The `models.py` file provides a repository-like pattern that abstracts storage implementation.

*Rationale*: In-memory storage enables quick prototyping and simple deployment on Replit without database setup. The abstraction layer in models ensures easy migration to persistent storage.

### Frontend Architecture

**React SPA with Vite**: Single-page application built with React 18 and Vite as the build tool, providing fast HMR (Hot Module Replacement) and optimized production builds.

**Client-Side Routing**: React Router v6 handles navigation between pages (Login, Register, Dashboard, Planner, PlanView, Profile) without full page reloads.

**Centralized API Client**: Axios instance configured in `api.js` with:
- Base URL configuration from environment variables
- Automatic JWT token injection via interceptors
- Organized API endpoints by domain (auth, mealPlans, dashboard)

**Styling Approach**: Tailwind CSS for utility-first styling with custom theme extension for brand colors (primary green palette). PostCSS processes Tailwind directives.

*Rationale*: Vite provides superior developer experience over Create React App. Tailwind enables rapid UI development with consistent design. Centralized API client prevents token handling duplication across components.

### Backend Architecture

**Flask Blueprint Organization**: Routes organized by domain into separate blueprints:
- `auth.py`: User registration, login, and JWT token management
- `mealplans.py`: CRUD operations and AI generation endpoint
- `dashboard.py`: User statistics and summaries

**JWT Authentication**: Stateless authentication using PyJWT with Bearer token scheme. Tokens expire after 24 hours. The `token_required` decorator protects endpoints by validating tokens and injecting user context.

**Password Security**: Passlib with bcrypt algorithm (version 4.0.1 for compatibility) for secure password hashing with automatic salt generation.

**Rate Limiting**: Simple in-memory rate limiter prevents AI generation endpoint abuse (one request per 10 seconds per user). Production systems should use Redis-backed rate limiting.

**Security Warning**: Application warns when using default JWT_SECRET in development. Production deployments MUST set custom JWT_SECRET environment variable.

*Rationale*: Blueprint organization promotes modularity and testability. JWT enables stateless scaling. Bcrypt is industry-standard for password hashing. Rate limiting prevents OpenAI API quota exhaustion.

### AI Integration

**OpenAI Service Layer**: Dedicated service (`openai_service.py`) encapsulates:
- Client initialization with API key validation
- Structured prompt engineering for consistent JSON responses
- Error handling and response validation
- Lazy client initialization to avoid startup issues

**Prompt Engineering**: The system uses strict JSON output format instructions to ensure parseable responses with specific schema (title, days array, meals with ingredients/instructions/nutrition).

*Rationale*: Service layer separates AI logic from route handlers, making it testable and reusable. Strict JSON formatting prevents parsing errors from free-form AI responses. Lazy initialization ensures app starts even without API key.

### CORS Configuration

**Permissive Development CORS**: Flask-CORS configured to allow all origins (`*`) for API routes with support for all HTTP methods and custom headers.

*Note*: Production deployments should restrict origins to specific frontend domains.

## Recent Changes (October 16, 2025)

### Fixed bcrypt Compatibility Issue
- Downgraded bcrypt from 4.1.2 to 4.0.1 for compatibility with passlib
- Verified authentication works end-to-end with curl testing
- Backend now starts cleanly without errors

### Added Security Warnings
- Runtime warning when using default JWT_SECRET
- Comprehensive security section in README
- Clear documentation of production deployment requirements

### Project Scaffolding
- Complete full-stack setup with Flask + React + Vite
- All pages implemented (Login, Register, Dashboard, Planner, PlanView, Profile)
- Beautiful UI with Tailwind CSS and responsive design
- Test user account created automatically
- Both workflows running successfully

## External Dependencies

### AI Services
- **OpenAI API**: GPT models for meal plan generation (requires `OPENAI_API_KEY`)
- Model: gpt-3.5-turbo with structured JSON output
- Parameters configured in `openai_service.py`

### Authentication & Security
- **PyJWT**: JSON Web Token creation and validation
- **Passlib + Bcrypt (4.0.1)**: Password hashing and verification
- **JWT_SECRET** environment variable (optional for dev, required for production)

### Backend Stack
- **Flask 3.0**: Web framework with Werkzeug WSGI server
- **Flask-CORS**: Cross-origin request handling
- **python-dotenv**: Environment variable management
- **OpenAI SDK 2.3.0**: Latest OpenAI Python client

### Frontend Stack
- **React 18**: UI rendering
- **React Router v6**: Client-side routing
- **Axios**: HTTP client with interceptor support
- **Tailwind CSS**: Utility-first styling framework
- **Vite 5**: Build tool and development server (configured for 0.0.0.0:5000)

### Development Environment
- Backend runs on port 8000 (Flask)
- Frontend runs on port 5000 (Vite dev server with allowedHosts: true)
- Environment variables managed via `.env` files and Replit Secrets
- Test account: test@example.com / password123

## Security Considerations

1. **JWT Secret**: Default secret used in development with runtime warning. Production MUST set custom JWT_SECRET.
2. **Password Hashing**: Bcrypt 4.0.1 with passlib for secure password storage
3. **Token Expiration**: JWT tokens expire after 24 hours
4. **Rate Limiting**: Basic in-memory rate limiting on meal generation (10 seconds between requests)
5. **CORS**: Permissive in development, should be restricted in production

## Known Limitations

1. **In-Memory Storage**: Data lost on server restart. Should migrate to PostgreSQL/SQLite for production.
2. **Basic Rate Limiting**: In-memory rate limiting doesn't work across multiple servers. Use Redis for production.
3. **No Persistent Sessions**: Users must re-login after server restart.
4. **Development Server**: Using Flask development server. Should use Gunicorn/uWSGI for production.

## Future Enhancements

- Migrate to persistent database (PostgreSQL via Replit's built-in database)
- Add meal plan export to PDF/CSV
- Implement meal plan templates and favorites
- Add shopping list generation from meal plans
- Enable meal plan sharing between users
- Add nutritional tracking dashboard
- Implement user profile customization
- Add multi-language support
- Implement proper deployment configuration with Gunicorn
