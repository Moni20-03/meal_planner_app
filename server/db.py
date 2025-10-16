"""
Database initialization and management.
Currently uses in-memory storage. Can be migrated to SQLite or PostgreSQL.
"""

from models import users_db, meal_plans_db


def init_db():
    """Initialize the database with test data."""
    from models import User
    from passlib.hash import bcrypt
    
    # Create a test user if database is empty
    if not users_db:
        test_user = User.create(
            username="testuser",
            email="test@example.com",
            password_hash=bcrypt.hash("password123")
        )
        print(f"✓ Test user created: {test_user['email']} / password123")


def get_db_stats():
    """Get database statistics for dashboard."""
    return {
        "total_users": len(users_db),
        "total_meal_plans": len(meal_plans_db)
    }
