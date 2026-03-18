// controllers/weight.controller.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getLogs = async (req, res, next) => {
  try {
    const logs = await prisma.weightLog.findMany({
      where: { userId:  1 },
      orderBy: { logDate: 'asc' },
    });
    res.json(logs);
  } catch (err) {
    next(err);
  }
};

const createLog = async (req, res, next) => {
  try {
    const { weight, logDate } = req.body;
    const log = await prisma.weightLog.create({
      data: {
        userId: 1,
        weight,
        logDate: logDate ? new Date(logDate) : new Date(),
      },
    });

    // Also update user's current weight
    await prisma.user.update({
      where: { id: 1 },
      data: { weight },
    });

    res.status(201).json(log);
  } catch (err) {
    next(err);
  }
};

const deleteLog = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.weightLog.deleteMany({
      where: { id: Number(id), userId: 1 },
    });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getLogs, createLog, deleteLog };
