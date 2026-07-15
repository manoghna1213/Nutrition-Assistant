require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Client = require('../models/Client');
const MealPlan = require('../models/MealPlan');
const Progress = require('../models/Progress');
const Notification = require('../models/Notification');

const seedData = async () => {
  try {
    // Connect database
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nutrition_assistant');
    console.log('Seed: MongoDB Connected...');

    // Clear existing data
    await User.deleteMany();
    await Client.deleteMany();
    await MealPlan.deleteMany();
    await Progress.deleteMany();
    await Notification.deleteMany();
    console.log('Seed: Existing database collections cleared.');

    // 1. Create Admins, Dietitians and Users
    // Passwords will be encrypted via Pre-Save mongoose hook
    const users = await User.create([
      {
        name: 'System Admin',
        email: 'admin@nutrition.com',
        password: 'admin123',
        role: 'Admin',
        phone: '1234567890'
      },
      {
        name: 'Dr. Jane Smith (Dietitian)',
        email: 'dietitian1@nutrition.com',
        password: 'dietitian123',
        role: 'Dietitian',
        phone: '0987654321',
        profileImage: ''
      },
      {
        name: 'Dr. Robert Carter (Dietitian)',
        email: 'dietitian2@nutrition.com',
        password: 'dietitian123',
        role: 'Dietitian',
        phone: '1122334455',
        profileImage: ''
      },
      {
        name: 'Alice Johnson',
        email: 'user1@nutrition.com',
        password: 'user123',
        role: 'User',
        phone: '5566778899',
        gender: 'Female',
        age: 28,
        height: 165,
        weight: 62.5,
        bmi: 23.0,
        calorieGoal: 1800,
        dietaryPreference: 'Vegetarian'
      },
      {
        name: 'Bob Miller',
        email: 'user2@nutrition.com',
        password: 'user123',
        role: 'User',
        phone: '9988776655',
        gender: 'Male',
        age: 35,
        height: 180,
        weight: 88.0,
        bmi: 27.2,
        calorieGoal: 2200,
        dietaryPreference: 'Keto'
      },
      {
        name: 'Charlie Davis',
        email: 'user3@nutrition.com',
        password: 'user123',
        role: 'User',
        phone: '4455667788',
        gender: 'Other',
        age: 24,
        height: 172,
        weight: 70.0,
        bmi: 23.7,
        calorieGoal: 2000,
        dietaryPreference: 'None'
      }
    ]);

    console.log('Seed: Users generated.');

    const dietitian1 = users[1];
    const dietitian2 = users[2];
    const alice = users[3];
    const bob = users[4];
    const charlie = users[5];

    // 2. Create Clients Records linking to Dietitians
    await Client.create([
      {
        userId: alice._id,
        dietitianId: dietitian1._id,
        healthConditions: ['Mild Anemia'],
        allergies: ['Peanuts'],
        goals: 'Improve iron counts and tone muscles for a summer run.',
        status: 'Active'
      },
      {
        userId: bob._id,
        dietitianId: dietitian1._id,
        healthConditions: ['Pre-hypertension'],
        allergies: [],
        goals: 'Lose 8 kilograms and regulate blood pressure levels.',
        status: 'Active'
      },
      {
        userId: charlie._id,
        dietitianId: null, // Unassigned client
        healthConditions: [],
        allergies: ['Gluten'],
        goals: 'Maintain weight and find suitable gluten-free meal charts.',
        status: 'Pending'
      }
    ]);

    console.log('Seed: Clients links configured.');

    // 3. Create Meal Plans
    const plans = await MealPlan.create([
      {
        clientId: alice._id,
        dietitianId: dietitian1._id,
        breakfast: 'Steel-cut oats with almond milk, chia seeds, sliced bananas, and spinach scrambled eggs on the side.',
        lunch: 'Quinoa salad with chick-peas, mixed green bell peppers, chopped cucumber, tossed in olive oil lemon dressing.',
        dinner: 'Tofu steak stir-fry with broccoli, snow peas, mushrooms, served with brown rice.',
        snacks: 'Greek yogurt with fresh blueberries and a handful of pumpkin seeds.',
        calories: 1800,
        protein: 75,
        carbohydrates: 220,
        fats: 50,
        fiber: 35,
        waterGoal: 2500,
        notes: 'Include iron-rich foods in every dinner. Drink 1 glass of beetroot juice on alternative mornings.'
      },
      {
        clientId: bob._id,
        dietitianId: dietitian1._id,
        breakfast: 'Oven-baked egg muffins with spinach, bacon, and cheddar cheese.',
        lunch: 'Seared salmon fillet dressed in herbs, roasted asparagus, avocado slices.',
        dinner: 'Grilled chicken breast with garlic zucchini noodles sautéed in olive oil.',
        snacks: 'Celery sticks filled with cream cheese or organic peanut butter.',
        calories: 2200,
        protein: 130,
        carbohydrates: 40,
        fats: 150,
        fiber: 20,
        waterGoal: 3000,
        notes: 'Strictly avoid starches like potatoes, wheat bread, and sugar syrups. Focus on healthy fat ingestion.'
      }
    ]);

    console.log('Seed: Meal plans generated.');

    // 4. Create 14 days of Progress history for Alice & Bob
    const today = new Date();
    const progressRecords = [];

    // Alice 14 day history
    for (let i = 14; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateString = d.toISOString().split('T')[0];

      // Simulated daily variances
      const weightVariance = 63.5 - (14 - i) * 0.08 + (Math.random() * 0.2 - 0.1);
      const caloriesVal = 1750 + Math.round(Math.random() * 150 - 75);
      const waterVal = 2200 + Math.round(Math.random() * 600 - 300);
      const exerciseVal = 20 + Math.round(Math.random() * 40);

      // Adherence based on target 1800 calories
      const diff = Math.abs(caloriesVal - 1800);
      const adherence = Math.max(0, Math.round(100 - (diff / 1800) * 100));

      progressRecords.push({
        clientId: alice._id,
        date: dateString,
        weight: parseFloat(weightVariance.toFixed(1)),
        caloriesConsumed: caloriesVal,
        proteinConsumed: 68 + Math.round(Math.random() * 12),
        carbsConsumed: 200 + Math.round(Math.random() * 40),
        fatsConsumed: 46 + Math.round(Math.random() * 10),
        waterConsumed: waterVal,
        exercise: exerciseVal,
        adherencePercentage: adherence,
        createdAt: d
      });
    }

    // Bob 14 day history
    for (let i = 14; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateString = d.toISOString().split('T')[0];

      const weightVariance = 89.2 - (14 - i) * 0.12 + (Math.random() * 0.3 - 0.15);
      const caloriesVal = 2150 + Math.round(Math.random() * 200 - 100);
      const waterVal = 2800 + Math.round(Math.random() * 800 - 400);
      const exerciseVal = 15 + Math.round(Math.random() * 45);

      const diff = Math.abs(caloriesVal - 2200);
      const adherence = Math.max(0, Math.round(100 - (diff / 2200) * 100));

      progressRecords.push({
        clientId: bob._id,
        date: dateString,
        weight: parseFloat(weightVariance.toFixed(1)),
        caloriesConsumed: caloriesVal,
        proteinConsumed: 120 + Math.round(Math.random() * 20),
        carbsConsumed: 35 + Math.round(Math.random() * 10),
        fatsConsumed: 140 + Math.round(Math.random() * 20),
        waterConsumed: waterVal,
        exercise: exerciseVal,
        adherencePercentage: adherence,
        createdAt: d
      });
    }

    await Progress.insertMany(progressRecords);
    console.log('Seed: Progress history logs established.');

    // 5. Create notifications
    await Notification.create([
      {
        userId: alice._id,
        title: 'Welcome!',
        message: 'Welcome to Nutrition Assistant. Meet your dietitian Jane Smith.'
      },
      {
        userId: alice._id,
        title: 'New Meal Plan',
        message: 'Your dietitian Jane Smith has created a customized meal plan for you. Check details on the Meal Plan tab.'
      },
      {
        userId: bob._id,
        title: 'Welcome!',
        message: 'Welcome to Nutrition Assistant. Meet your dietitian Jane Smith.'
      },
      {
        userId: bob._id,
        title: 'Weight Checked',
        message: 'Great progress. You have updated your weight today!'
      }
    ]);

    console.log('Seed: Notifications established.');
    console.log('Seed: Database completely seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedData();
