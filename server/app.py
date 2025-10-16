"""
Flask application for AI-Powered Meal Planner.
Main entry point for the backend API.
"""

from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from pathlib import Path

# Explicitly load .env from the same directory as app.py
dotenv_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path)

# Debug check
print("Loaded OPENAI_API_KEY:", os.getenv("OPENAI_API_KEY"))

# Load environment variables
load_dotenv()

# Import routes
from routes.auth import auth_bp
from routes.mealplans import mealplans_bp
from routes.dashboard import dashboard_bp
from db import init_db

# Initialize Flask app
app = Flask(__name__)

# Configure CORS - allow all origins for development
CORS(app, resources={
    r"/api/*": {
        "origins": "*",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Initialize database with test data
init_db()

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(mealplans_bp, url_prefix='/api/mealplans')
app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')


@app.route('/')
def index():
    """Health check endpoint."""
    return jsonify({
        'status': 'running',
        'service': 'AI-Powered Meal Planner API',
        'version': '1.0.0'
    })


@app.route('/api/health', methods=['GET'])
def health():
    """Detailed health check."""
    import os
    
    openai_configured = bool(os.getenv('OPENAI_API_KEY'))
    
    return jsonify({
        'status': 'healthy',
        'database': 'in-memory',
        'openai_configured': openai_configured,
        'endpoints': {
            'auth': '/api/auth/register, /api/auth/login',
            'mealplans': '/api/mealplans/generate, /api/mealplans/',
            'dashboard': '/api/dashboard/summary'
        }
    })


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors."""
    return jsonify({'error': 'Endpoint not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors."""
    return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    # Run on 0.0.0.0:8000 for backend (frontend will be on 5000)
    port = int(os.getenv('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=True)
