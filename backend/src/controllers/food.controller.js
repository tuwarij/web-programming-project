// controllers/food.controller.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getLogs = async (req, res, next) => {
  try {
    const { date } = req.query;
    const where = { userId: 1 };

    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      where.logDate = { gte: start, lt: end };
    }

    const logs = await prisma.foodLog.findMany({
      where,
      orderBy: { logDate: 'desc' },
    });
    res.json(logs);
  } catch (err) {
    next(err);
  }
};

const createLog = async (req, res, next) => {
  try {
    const { name, calories, protein, carbs, fat, mealType, logDate } = req.body;
    const log = await prisma.foodLog.create({
      data: {
        userId: 1,
        name,
        calories,
        protein,
        carbs,
        fat,
        mealType,
        logDate: logDate ? new Date(logDate) : undefined,
      },
    });
    res.status(201).json(log);
  } catch (err) {
    next(err);
  }
};

const updateLog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const log = await prisma.foodLog.updateMany({
      where: { id: Number(id), userId: 1 },
      data: req.body,
    });
    res.json(log);
  } catch (err) {
    next(err);
  }
};

const deleteLog = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.foodLog.deleteMany({
      where: { id: Number(id), userId: 1 },
    });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getLogs, createLog, updateLog, deleteLog };
