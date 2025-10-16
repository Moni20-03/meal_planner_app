"""
Dashboard routes for user statistics and summaries.
"""

from flask import Blueprint, jsonify
from routes.auth import token_required
from models import MealPlan
from db import get_db_stats

dashboard_bp = Blueprint('dashboard', __name__)


@dashboard_bp.route('/summary', methods=['GET'])
@token_required
def get_summary(current_user):
    """
    Get dashboard summary for the current user.
    
    Returns:
        - Total meal plans created
        - Recent meal plans
        - Overall statistics
    """
    try:
        # Get user's meal plans
        user_plans = MealPlan.find_by_user(current_user['id'])
        
        # Calculate statistics
        total_plans = len(user_plans)
        total_days_planned = sum(plan.get('days', 0) for plan in user_plans)
        
        # Get recent plans (last 5)
        recent_plans = sorted(
            user_plans,
            key=lambda x: x.get('created_at', ''),
            reverse=True
        )[:5]
        
        # Calculate average calories if available
        avg_calories = 0
        if user_plans:
            calories_sum = sum(plan.get('target_calories', 0) for plan in user_plans)
            avg_calories = calories_sum // total_plans if total_plans > 0 else 0
        
        # Get database stats
        db_stats = get_db_stats()
        
        return jsonify({
            'user': {
                'id': current_user['id'],
                'username': current_user['username'],
                'email': current_user['email']
            },
            'statistics': {
                'total_meal_plans': total_plans,
                'total_days_planned': total_days_planned,
                'average_target_calories': avg_calories
            },
            'recent_plans': recent_plans,
            'system_stats': db_stats
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to fetch dashboard summary: {str(e)}'}), 500
