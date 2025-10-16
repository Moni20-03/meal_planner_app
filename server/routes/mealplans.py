"""
Meal plan routes for CRUD operations and AI generation.
Implements rate limiting on generate endpoint.
"""

from flask import Blueprint, request, jsonify
from routes.auth import token_required
from models import MealPlan
from services.openai_service import generate_meal_plan
import time

mealplans_bp = Blueprint('mealplans', __name__)

# Simple rate limiting (in-memory)
rate_limit_store = {}
RATE_LIMIT_SECONDS = 10  # Allow one generation every 10 seconds per user


def check_rate_limit(user_id: str) -> bool:
    """Check if user has exceeded rate limit."""
    current_time = time.time()
    
    if user_id in rate_limit_store:
        last_request = rate_limit_store[user_id]
        if current_time - last_request < RATE_LIMIT_SECONDS:
            return False
    
    rate_limit_store[user_id] = current_time
    return True


@mealplans_bp.route('/generate', methods=['POST'])
@token_required
def generate(current_user):
    """
    Generate a new meal plan using AI.
    
    Expected JSON:
    {
        "days": 7,
        "preferences": "Vegetarian, gluten-free",
        "servings": 2,
        "target_calories": 2000
    }
    """
    try:
        # Rate limiting
        if not check_rate_limit(current_user['id']):
            return jsonify({
                'error': f'Rate limit exceeded. Please wait {RATE_LIMIT_SECONDS} seconds between requests.'
            }), 429
        
        data = request.get_json()
        
        # Validate input
        if not data:
            return jsonify({'error': 'Request body is required'}), 400
        
        days = data.get('days', 7)
        preferences = data.get('preferences', 'No specific preferences')
        servings = data.get('servings', 2)
        target_calories = data.get('target_calories', 2000)
        
        # Validation
        if not isinstance(days, int) or days < 1 or days > 30:
            return jsonify({'error': 'Days must be between 1 and 30'}), 400
        
        if not isinstance(servings, int) or servings < 1 or servings > 10:
            return jsonify({'error': 'Servings must be between 1 and 10'}), 400
        
        if not isinstance(target_calories, int) or target_calories < 500 or target_calories > 5000:
            return jsonify({'error': 'Target calories must be between 500 and 5000'}), 400
        
        # Generate meal plan using OpenAI
        try:
            plan_content = generate_meal_plan(days, preferences, servings, target_calories)
        except Exception as e:
            return jsonify({
                'error': 'Failed to generate meal plan',
                'details': str(e)
            }), 500
        
        # Save to database
        meal_plan = MealPlan.create(current_user['id'], {
            'days': days,
            'preferences': preferences,
            'servings': servings,
            'target_calories': target_calories,
            'plan_content': plan_content
        })
        
        return jsonify({
            'message': 'Meal plan generated successfully',
            'meal_plan': meal_plan
        }), 201
        
    except Exception as e:
        return jsonify({'error': f'Generation failed: {str(e)}'}), 500


@mealplans_bp.route('/', methods=['GET'])
@token_required
def get_all(current_user):
    """Get all meal plans for the current user."""
    try:
        plans = MealPlan.find_by_user(current_user['id'])
        return jsonify({'meal_plans': plans}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@mealplans_bp.route('/<plan_id>', methods=['GET'])
@token_required
def get_one(current_user, plan_id):
    """Get a specific meal plan."""
    try:
        plan = MealPlan.find_by_id(plan_id)
        
        if not plan:
            return jsonify({'error': 'Meal plan not found'}), 404
        
        # Check ownership
        if plan['user_id'] != current_user['id']:
            return jsonify({'error': 'Unauthorized access'}), 403
        
        return jsonify({'meal_plan': plan}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@mealplans_bp.route('/<plan_id>', methods=['DELETE'])
@token_required
def delete(current_user, plan_id):
    """Delete a meal plan."""
    try:
        plan = MealPlan.find_by_id(plan_id)
        
        if not plan:
            return jsonify({'error': 'Meal plan not found'}), 404
        
        # Check ownership
        if plan['user_id'] != current_user['id']:
            return jsonify({'error': 'Unauthorized access'}), 403
        
        MealPlan.delete(plan_id)
        
        return jsonify({'message': 'Meal plan deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@mealplans_bp.route('/<plan_id>', methods=['PUT'])
@token_required
def update(current_user, plan_id):
    """Update a meal plan (for future use)."""
    try:
        plan = MealPlan.find_by_id(plan_id)
        
        if not plan:
            return jsonify({'error': 'Meal plan not found'}), 404
        
        # Check ownership
        if plan['user_id'] != current_user['id']:
            return jsonify({'error': 'Unauthorized access'}), 403
        
        data = request.get_json()
        updated_plan = MealPlan.update(plan_id, data)
        
        return jsonify({
            'message': 'Meal plan updated successfully',
            'meal_plan': updated_plan
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
