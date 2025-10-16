# AI-Powered Meal Planner

A full-stack application that generates personalized meal plans using OpenAI's GPT models. Built with Python Flask backend and React + Vite frontend.

## Features

- **User Authentication**: Secure registration and login with JWT tokens and bcrypt password hashing
- **AI Meal Plan Generation**: Create customized meal plans using OpenAI API
- **Flexible Parameters**: Customize days, servings, calories, and dietary preferences
- **Dashboard**: View statistics and manage all your meal plans
- **Detailed Plans**: Each plan includes ingredients, nutritional info, and cooking instructions
- **Rate Limiting**: Prevents API abuse with built-in rate limiting
- **Responsive Design**: Beautiful UI built with Tailwind CSS

## Tech Stack

### Backend
- **Flask**: Python web framework
- **PyJWT**: JWT authentication
- **Passlib + Bcrypt**: Password hashing
- **OpenAI Python SDK**: AI meal generation
- **Flask-CORS**: Cross-origin resource sharing

### Frontend
- **React 18**: UI library
- **Vite**: Build tool and dev server
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **Tailwind CSS**: Utility-first styling

## Project Structure

```
/
├── server/
│   ├── app.py              # Flask application entry point
│   ├── db.py               # Database initialization
│   ├── models.py           # Data models (in-memory storage)
│   ├── requirements.txt    # Python dependencies
│   ├── routes/
│   │   ├── auth.py         # Authentication routes
│   │   ├── mealplans.py    # Meal plan CRUD routes
│   │   └── dashboard.py    # Dashboard statistics
│   └── services/
│       └── openai_service.py  # OpenAI integration
├── client/
│   ├── src/
│   │   ├── pages/          # React page components
│   │   ├── components/     # Reusable components
│   │   ├── api.js          # API client configuration
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # App entry point
│   ├── package.json        # Node dependencies
│   └── vite.config.js      # Vite configuration
└── README.md
```

## Setup Instructions

### Prerequisites
- Python 3.11+
- Node.js 20+
- OpenAI API key

### 1. Configure Replit Secrets

Set the following secrets in your Replit environment:

- **OPENAI_API_KEY**: Your OpenAI API key (required)
  - Get one at: https://platform.openai.com/api-keys
- **JWT_SECRET**: Secret key for JWT signing (optional for development, REQUIRED for production)
  - Development: Uses default key with warning
  - Production: MUST set a strong random secret before deployment
- **SESSION_SECRET**: Session secret (already configured)

### 2. Install Dependencies

Backend dependencies are already installed. Frontend dependencies will be installed automatically.

### 3. Test User Account

A test user is automatically created:
- **Email**: test@example.com
- **Password**: password123

### 4. Run the Application

Click the "Run" button in Replit. The application will start both servers:
- Backend: http://localhost:8000 (API)
- Frontend: http://localhost:5000 (Web UI)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token

### Meal Plans
- `POST /api/mealplans/generate` - Generate AI meal plan (rate-limited)
- `GET /api/mealplans/` - Get all user's meal plans
- `GET /api/mealplans/:id` - Get specific meal plan
- `PUT /api/mealplans/:id` - Update meal plan
- `DELETE /api/mealplans/:id` - Delete meal plan

### Dashboard
- `GET /api/dashboard/summary` - Get user statistics and recent plans

## Usage

1. **Register/Login**: Create an account or use the test account
2. **Generate Plan**: Click "Generate New Meal Plan" and customize parameters
3. **View Plans**: Browse your meal plans on the dashboard
4. **View Details**: Click "View" to see complete meal details with recipes

## Rate Limiting

The meal generation endpoint is rate-limited to 1 request per 10 seconds per user to prevent API abuse and manage OpenAI costs.

## Future Enhancements

- Migrate to persistent database (PostgreSQL/SQLite)
- Add meal plan export to PDF/CSV
- Implement meal plan templates
- Add shopping list generation
- Enable meal plan sharing
- Add nutritional tracking dashboard
- Implement user profile customization
- Add multi-language support

## Development

### Backend Development
```bash
cd server
python app.py
```

### Frontend Development
```bash
cd client
npm run dev
```

## Security Considerations

⚠️ **Important for Production Deployment:**

1. **JWT Secret**: The application uses a default JWT_SECRET for development. Before deploying to production:
   - Set a strong random JWT_SECRET environment variable
   - Generate one using: `python -c "import secrets; print(secrets.token_hex(32))"`
   - Never commit secrets to version control

2. **Database**: Currently uses in-memory storage (data lost on restart). For production:
   - Migrate to PostgreSQL or SQLite for persistent storage
   - Implement proper database migrations

3. **HTTPS**: Always use HTTPS in production to protect JWT tokens and user data

4. **Rate Limiting**: Current rate limiting is basic. Consider using Redis for distributed rate limiting in production

## License

MIT License - Feel free to use this project for learning and development.

## Credits

Built with ❤️ using OpenAI's GPT models for intelligent meal planning.
