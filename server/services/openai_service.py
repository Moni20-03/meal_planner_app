"""
OpenAI service for generating AI-powered meal plans.
Handles prompt engineering, API calls, and response validation.
"""

import os
import json
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def generate_meal_plan(days: int, preferences: str, servings: int, target_calories: int) -> dict:
    """
    Generate a meal plan using OpenAI API.
    
    Args:
        days: Number of days for the meal plan
        preferences: Dietary preferences or restrictions
        servings: Number of servings per meal
        target_calories: Target daily calorie intake
    
    Returns:
        dict: Parsed meal plan in JSON format
    
    Raises:
        Exception: If AI output cannot be parsed or API call fails
    """
    
    # Construct the prompt for strict JSON output
    prompt = f"""You are a professional nutritionist. Generate a detailed meal plan with the following specifications:

- Duration: {days} days
- Dietary preferences/restrictions: {preferences}
- Servings per meal: {servings}
- Target daily calories: {target_calories}

Return ONLY valid JSON (no markdown, no explanations) in this exact structure:
{{
  "title": "Descriptive meal plan title",
  "days": [
    {{
      "day": 1,
      "date": "Day 1",
      "meals": [
        {{
          "type": "Breakfast",
          "name": "Meal name",
          "ingredients": ["ingredient1", "ingredient2"],
          "calories": 400,
          "protein": "25g",
          "carbs": "45g",
          "fat": "12g",
          "instructions": "Brief cooking instructions"
        }}
      ],
      "total_calories": 2000
    }}
  ],
  "summary": {{
    "total_days": {days},
    "avg_daily_calories": 2000,
    "dietary_notes": "Any important notes"
  }}
}}

Ensure each day has Breakfast, Lunch, Dinner, and optionally Snacks. Make it realistic and achievable."""

    try:
        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a nutritionist that responds only with valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=2000
        )
        
        # Extract the response content
        content = response.choices[0].message.content.strip()
        
        # Try to parse JSON (handle potential markdown code blocks)
        if content.startswith("```"):
            # Remove markdown code blocks if present
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
            content = content.strip()
        
        # Parse JSON
        meal_plan = json.loads(content)
        
        # Basic validation
        if "days" not in meal_plan or not isinstance(meal_plan["days"], list):
            raise ValueError("Invalid meal plan structure: missing or invalid 'days' field")
        
        if len(meal_plan["days"]) != days:
            raise ValueError(f"Expected {days} days, got {len(meal_plan['days'])}")
        
        return meal_plan
        
    except json.JSONDecodeError as e:
        raise Exception(f"Failed to parse AI response as JSON. Error: {str(e)}. Response was: {content[:200]}")
    except Exception as e:
        raise Exception(f"OpenAI API error: {str(e)}")


def test_openai_connection() -> bool:
    """Test if OpenAI API key is configured correctly."""
    try:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            return False
        
        # Simple test call
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": "Say 'OK'"}],
            max_tokens=5
        )
        return True
    except:
        return False
