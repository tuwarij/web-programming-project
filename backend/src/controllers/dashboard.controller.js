// controllers/dashboard.controller.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getSummary = async (req, res, next) => {
  try {
    const userId = 1;
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const [user, foodLogs, workoutLogs, weightLogs] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, weight: true, height: true, goal: true },
      }),
      prisma.foodLog.findMany({
        where: { userId, logDate: { gte: weekAgo } },
        orderBy: { logDate: 'asc' },
      }),
      prisma.workoutLog.findMany({
        where: { userId, logDate: { gte: weekAgo } },
        orderBy: { logDate: 'asc' },
      }),
      prisma.weightLog.findMany({
        where: { userId },
        orderBy: { logDate: 'asc' },
        take: 30,
      }),
    ]);

    // Today's totals
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayFood = foodLogs.filter(f => new Date(f.logDate) >= todayStart);
    const todayWorkout = workoutLogs.filter(w => new Date(w.logDate) >= todayStart);

    const todayCaloriesIn = todayFood.reduce((sum, f) => sum + f.calories, 0);
    const todayCaloriesBurned = todayWorkout.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);

    // Weekly calories by day
    const weeklyCalories = buildDailyTotals(foodLogs, workoutLogs, 7);

    res.json({
      user,
      today: {
        caloriesIn: todayCaloriesIn,
        caloriesBurned: todayCaloriesBurned,
        net: todayCaloriesIn - todayCaloriesBurned,
        workoutCount: todayWorkout.length,
        mealCount: todayFood.length,
      },
      weeklyCalories,
      weightLogs,
    });
  } catch (err) {
    next(err);
  }
};

function buildDailyTotals(foodLogs, workoutLogs, days) {
  const result = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const dayFood = foodLogs.filter(f => {
      const d = new Date(f.logDate);
      return d >= date && d < nextDate;
    });
    const dayWorkout = workoutLogs.filter(w => {
      const d = new Date(w.logDate);
      return d >= date && d < nextDate;
    });

    result.push({
      date: date.toISOString().split('T')[0],
      caloriesIn: dayFood.reduce((s, f) => s + f.calories, 0),
      caloriesBurned: dayWorkout.reduce((s, w) => s + (w.caloriesBurned || 0), 0),
    });
  }
  return result;
}

module.exports = { getSummary };
