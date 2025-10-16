import random

# Expanded meal database with ingredients and nutrition
MEAL_DATABASE = {
    "breakfasts": [
        {
            "name": "Oatmeal with Fruits",
            "ingredients": [
                "1 cup rolled oats",
                "1 cup milk or water",
                "1/2 cup mixed berries (strawberries, blueberries)",
                "1 tbsp honey or maple syrup",
                "1 tbsp chopped nuts (almonds, walnuts)"
            ],
            "calories": 350,
            "protein": "12g",
            "carbs": "58g",
            "fat": "8g",
            "instructions": "Cook oats with milk/water. Top with berries, nuts, and honey."
        },
        {
            "name": "Scrambled Eggs with Toast",
            "ingredients": [
                "2 large eggs",
                "1 tbsp milk",
                "1 tsp butter",
                "2 slices whole wheat bread",
                "1/4 cup spinach",
                "Salt and pepper to taste"
            ],
            "calories": 320,
            "protein": "18g",
            "carbs": "25g",
            "fat": "16g",
            "instructions": "Whisk eggs with milk. Cook in butter until fluffy. Serve with toasted bread and spinach."
        },
        {
            "name": "Greek Yogurt Parfait",
            "ingredients": [
                "1 cup Greek yogurt",
                "1/2 cup granola",
                "1/2 cup mixed berries",
                "1 tbsp honey",
                "1 tbsp chia seeds"
            ],
            "calories": 380,
            "protein": "20g",
            "carbs": "45g",
            "fat": "12g",
            "instructions": "Layer yogurt, granola, and berries in a glass. Top with honey and chia seeds."
        },
        {
            "name": "Avocado Toast",
            "ingredients": [
                "1 ripe avocado",
                "2 slices whole grain bread",
                "1 tsp lemon juice",
                "1/4 tsp red pepper flakes",
                "Salt and pepper to taste",
                "1 poached egg (optional)"
            ],
            "calories": 290,
            "protein": "8g",
            "carbs": "28g",
            "fat": "18g",
            "instructions": "Mash avocado with lemon juice, salt, and pepper. Spread on toasted bread. Top with red pepper flakes."
        },
        {
            "name": "Smoothie Bowl",
            "ingredients": [
                "1 frozen banana",
                "1/2 cup frozen berries",
                "1/2 cup Greek yogurt",
                "2 tbsp almond milk",
                "1 tbsp almond butter",
                "Toppings: granola, coconut flakes, chia seeds"
            ],
            "calories": 340,
            "protein": "15g",
            "carbs": "48g",
            "fat": "12g",
            "instructions": "Blend frozen fruits with yogurt and almond milk until smooth. Pour into bowl and add toppings."
        }
    ],
    "lunches": [
        {
            "name": "Grilled Chicken Salad",
            "ingredients": [
                "150g chicken breast",
                "2 cups mixed greens",
                "1/2 cup cherry tomatoes",
                "1/4 cucumber, sliced",
                "1/4 red onion, sliced",
                "2 tbsp olive oil dressing"
            ],
            "calories": 420,
            "protein": "35g",
            "carbs": "12g",
            "fat": "25g",
            "instructions": "Grill chicken until cooked. Toss with vegetables and dressing."
        },
        {
            "name": "Vegetable Stir Fry",
            "ingredients": [
                "1 cup mixed vegetables (bell peppers, broccoli, carrots)",
                "100g tofu or chicken",
                "2 tbsp soy sauce",
                "1 tsp ginger, minced",
                "1 tsp garlic, minced",
                "1 cup brown rice"
            ],
            "calories": 380,
            "protein": "20g",
            "carbs": "45g",
            "fat": "12g",
            "instructions": "Stir-fry vegetables and protein with ginger and garlic. Add soy sauce. Serve with rice."
        },
        {
            "name": "Quinoa Salad",
            "ingredients": [
                "1 cup cooked quinoa",
                "1/2 cup chickpeas",
                "1/4 cup feta cheese",
                "1/4 cup chopped parsley",
                "2 tbsp lemon vinaigrette",
                "1/4 cup chopped walnuts"
            ],
            "calories": 450,
            "protein": "18g",
            "carbs": "52g",
            "fat": "20g",
            "instructions": "Mix all ingredients together. Chill for 30 minutes before serving."
        },
        {
            "name": "Lentil Soup",
            "ingredients": [
                "1 cup lentils",
                "1 carrot, diced",
                "1 celery stalk, diced",
                "1 onion, diced",
                "2 cloves garlic, minced",
                "4 cups vegetable broth"
            ],
            "calories": 320,
            "protein": "22g",
            "carbs": "48g",
            "fat": "4g",
            "instructions": "Sauté vegetables. Add lentils and broth. Simmer for 30 minutes."
        },
        {
            "name": "Turkey Wrap",
            "ingredients": [
                "2 slices turkey breast",
                "1 whole wheat tortilla",
                "2 lettuce leaves",
                "1/4 avocado, sliced",
                "1 tbsp hummus",
                "1/4 cup shredded carrots"
            ],
            "calories": 290,
            "protein": "16g",
            "carbs": "28g",
            "fat": "12g",
            "instructions": "Spread hummus on tortilla. Layer ingredients and roll tightly."
        }
    ],
    "dinners": [
        {
            "name": "Baked Salmon",
            "ingredients": [
                "150g salmon fillet",
                "1 lemon, sliced",
                "2 tsp olive oil",
                "1 cup roasted vegetables",
                "1/2 cup quinoa",
                "Fresh dill for garnish"
            ],
            "calories": 480,
            "protein": "35g",
            "carbs": "32g",
            "fat": "22g",
            "instructions": "Bake salmon at 400°F for 12-15 minutes with lemon. Serve with quinoa and vegetables."
        },
        {
            "name": "Vegetable Curry",
            "ingredients": [
                "1 cup mixed vegetables",
                "1/2 cup coconut milk",
                "2 tbsp curry paste",
                "1 cup brown rice",
                "1/4 cup chickpeas",
                "Fresh cilantro for garnish"
            ],
            "calories": 420,
            "protein": "12g",
            "carbs": "58g",
            "fat": "18g",
            "instructions": "Sauté vegetables with curry paste. Add coconut milk and simmer. Serve with rice."
        },
        {
            "name": "Chicken Stir Fry",
            "ingredients": [
                "150g chicken breast, sliced",
                "2 cups mixed vegetables",
                "2 tbsp stir-fry sauce",
                "1 tsp sesame oil",
                "1 cup brown rice",
                "1 tbsp sesame seeds"
            ],
            "calories": 460,
            "protein": "38g",
            "carbs": "45g",
            "fat": "14g",
            "instructions": "Stir-fry chicken and vegetables with sauce. Serve over rice with sesame seeds."
        },
        {
            "name": "Pasta with Tomato Sauce",
            "ingredients": [
                "2 oz whole wheat pasta",
                "1 cup tomato sauce",
                "2 tbsp grated Parmesan",
                "1/4 cup lean ground beef (optional)",
                "1 tsp olive oil",
                "Fresh basil leaves"
            ],
            "calories": 380,
            "protein": "18g",
            "carbs": "52g",
            "fat": "12g",
            "instructions": "Cook pasta. Heat sauce with meat. Combine and top with Parmesan and basil."
        },
        {
            "name": "Bean Burrito Bowl",
            "ingredients": [
                "1/2 cup black beans",
                "1/2 cup brown rice",
                "1/4 cup corn",
                "1/4 avocado, diced",
                "2 tbsp salsa",
                "1 tbsp Greek yogurt"
            ],
            "calories": 410,
            "protein": "16g",
            "carbs": "62g",
            "fat": "14g",
            "instructions": "Layer rice, beans, corn, and avocado. Top with salsa and yogurt."
        }
    ],
    "snacks": [
        {
            "name": "Greek Yogurt with Berries",
            "ingredients": [
                "1/2 cup Greek yogurt",
                "1/4 cup mixed berries",
                "1 tsp honey",
                "1 tbsp granola"
            ],
            "calories": 150,
            "protein": "12g",
            "carbs": "18g",
            "fat": "4g",
            "instructions": "Mix yogurt with berries and honey. Top with granola."
        },
        {
            "name": "Apple with Peanut Butter",
            "ingredients": [
                "1 medium apple",
                "2 tbsp peanut butter",
                "Sprinkle of cinnamon"
            ],
            "calories": 220,
            "protein": "8g",
            "carbs": "25g",
            "fat": "12g",
            "instructions": "Slice apple and serve with peanut butter. Sprinkle with cinnamon."
        },
        {
            "name": "Protein Smoothie",
            "ingredients": [
                "1 scoop protein powder",
                "1 cup almond milk",
                "1/2 banana",
                "1 tbsp almond butter",
                "Handful of spinach"
            ],
            "calories": 280,
            "protein": "25g",
            "carbs": "20g",
            "fat": "10g",
            "instructions": "Blend all ingredients until smooth. Serve immediately."
        },
        {
            "name": "Hummus with Veggies",
            "ingredients": [
                "1/4 cup hummus",
                "1 cup vegetable sticks (carrots, celery, bell peppers)",
                "1/4 whole wheat pita"
            ],
            "calories": 180,
            "protein": "8g",
            "carbs": "22g",
            "fat": "8g",
            "instructions": "Serve hummus with fresh vegetables and pita bread."
        },
        {
            "name": "Mixed Nuts",
            "ingredients": [
                "1/4 cup mixed nuts (almonds, walnuts, cashews)",
                "2 dried apricots",
                "1 tbsp dark chocolate chips"
            ],
            "calories": 200,
            "protein": "6g",
            "carbs": "15g",
            "fat": "16g",
            "instructions": "Mix nuts with dried fruit and chocolate chips."
        }
    ]
}

def generate_meal_plan(days=7, preferences="", servings=1, target_calories=2000):
    """
    Generate a detailed meal plan with ingredients and nutrition facts.
    """
    plan = {
        "title": f"{days}-Day {preferences + ' ' if preferences else ''}Meal Plan",
        "days": [],
        "summary": {
            "total_days": days,
            "avg_daily_calories": target_calories,
            "dietary_notes": preferences if preferences else "Balanced nutrition plan"
        }
    }

    for day in range(1, days + 1):
        # Select random meals from each category
        breakfast = random.choice(MEAL_DATABASE["breakfasts"])
        lunch = random.choice(MEAL_DATABASE["lunches"])
        dinner = random.choice(MEAL_DATABASE["dinners"])
        
        # Adjust calories based on target
        breakfast_calories = adjust_calories(breakfast["calories"], target_calories, 0.25)
        lunch_calories = adjust_calories(lunch["calories"], target_calories, 0.35)
        dinner_calories = adjust_calories(dinner["calories"], target_calories, 0.35)
        
        day_plan = {
            "day": day,
            "date": f"Day {day}",
            "meals": [
                {
                    "type": "Breakfast",
                    "name": breakfast["name"],
                    "ingredients": breakfast["ingredients"],
                    "calories": breakfast_calories,
                    "protein": breakfast["protein"],
                    "carbs": breakfast["carbs"],
                    "fat": breakfast["fat"],
                    "instructions": breakfast["instructions"]
                },
                {
                    "type": "Lunch",
                    "name": lunch["name"],
                    "ingredients": lunch["ingredients"],
                    "calories": lunch_calories,
                    "protein": lunch["protein"],
                    "carbs": lunch["carbs"],
                    "fat": lunch["fat"],
                    "instructions": lunch["instructions"]
                },
                {
                    "type": "Dinner",
                    "name": dinner["name"],
                    "ingredients": dinner["ingredients"],
                    "calories": dinner_calories,
                    "protein": dinner["protein"],
                    "carbs": dinner["carbs"],
                    "fat": dinner["fat"],
                    "instructions": dinner["instructions"]
                }
            ],
            "total_calories": breakfast_calories + lunch_calories + dinner_calories
        }

        # 60% chance to include a snack
        if random.random() > 0.4:
            snack = random.choice(MEAL_DATABASE["snacks"])
            snack_calories = adjust_calories(snack["calories"], target_calories, 0.05)
            day_plan["meals"].append({
                "type": "Snack",
                "name": snack["name"],
                "ingredients": snack["ingredients"],
                "calories": snack_calories,
                "protein": snack["protein"],
                "carbs": snack["carbs"],
                "fat": snack["fat"],
                "instructions": snack["instructions"]
            })
            day_plan["total_calories"] += snack_calories

        plan["days"].append(day_plan)

    return plan

def adjust_calories(base_calories, target_calories, meal_ratio):
    """
    Adjust meal calories to match target daily calories.
    """
    target_meal_calories = target_calories * meal_ratio
    adjustment_factor = target_meal_calories / base_calories if base_calories > 0 else 1
    return int(base_calories * adjustment_factor)

# Example usage
if __name__ == "__main__":
    sample_plan = generate_meal_plan(days=3, preferences="Vegetarian", target_calories=1800)
    print("Sample Meal Plan:")
    for day in sample_plan["days"]:
        print(f"\n{day['date']}:")
        for meal in day["meals"]:
            print(f"  {meal['type']}: {meal['name']} ({meal['calories']} cal)")
            print(f"    Protein: {meal['protein']}, Carbs: {meal['carbs']}, Fat: {meal['fat']}")