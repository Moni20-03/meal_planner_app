"""
Data models for the Meal Planner application.
Uses in-memory storage for MVP (can be migrated to SQLite/PostgreSQL later).
"""

from datetime import datetime
from typing import Dict, List, Optional

# In-memory storage
users_db: Dict[str, dict] = {}
meal_plans_db: Dict[str, dict] = {}

# Auto-increment IDs
user_id_counter = {"value": 1}
meal_plan_id_counter = {"value": 1}


class User:
    """User model for authentication and profile management."""
    
    @staticmethod
    def create(username: str, email: str, password_hash: str) -> dict:
        """Create a new user."""
        user_id = str(user_id_counter["value"])
        user_id_counter["value"] += 1
        
        user = {
            "id": user_id,
            "username": username,
            "email": email,
            "password_hash": password_hash,
            "created_at": datetime.utcnow().isoformat()
        }
        users_db[user_id] = user
        return user
    
    @staticmethod
    def find_by_email(email: str) -> Optional[dict]:
        """Find user by email."""
        for user in users_db.values():
            if user["email"] == email:
                return user
        return None
    
    @staticmethod
    def find_by_id(user_id: str) -> Optional[dict]:
        """Find user by ID."""
        return users_db.get(user_id)


class MealPlan:
    """Meal plan model for storing generated plans."""
    
    @staticmethod
    def create(user_id: str, plan_data: dict) -> dict:
        """Create a new meal plan."""
        plan_id = str(meal_plan_id_counter["value"])
        meal_plan_id_counter["value"] += 1
        
        meal_plan = {
            "id": plan_id,
            "user_id": user_id,
            "days": plan_data.get("days"),
            "preferences": plan_data.get("preferences"),
            "servings": plan_data.get("servings"),
            "target_calories": plan_data.get("target_calories"),
            "plan_content": plan_data.get("plan_content"),
            "created_at": datetime.utcnow().isoformat()
        }
        meal_plans_db[plan_id] = meal_plan
        return meal_plan
    
    @staticmethod
    def find_by_user(user_id: str) -> List[dict]:
        """Find all meal plans for a user."""
        return [plan for plan in meal_plans_db.values() if plan["user_id"] == user_id]
    
    @staticmethod
    def find_by_id(plan_id: str) -> Optional[dict]:
        """Find meal plan by ID."""
        return meal_plans_db.get(plan_id)
    
    @staticmethod
    def delete(plan_id: str) -> bool:
        """Delete a meal plan."""
        if plan_id in meal_plans_db:
            del meal_plans_db[plan_id]
            return True
        return False
    
    @staticmethod
    def update(plan_id: str, updates: dict) -> Optional[dict]:
        """Update a meal plan."""
        if plan_id in meal_plans_db:
            meal_plans_db[plan_id].update(updates)
            return meal_plans_db[plan_id]
        return None
