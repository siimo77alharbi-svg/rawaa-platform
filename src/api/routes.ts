import { createRouter } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth';

const router = createRouter();

// Get all bookings (admin only)
router.get('/bookings', authenticate(['admin', 'super_admin']), async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: true,
        service: true,
        therapist: true,
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching bookings' });
  }
});

// Create booking
router.post('/bookings', authenticate(), async (req, res) => {
  try {
    const { serviceId, date, notes } = req.body;
    const userId = req.user.id;

    const booking = await prisma.booking.create({
      data: {
        userId,
        serviceId,
        date: new Date(date),
        notes,
        status: 'PENDING',
      },
      include: {
        service: true,
      },
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Error creating booking' });
  }
});

// Update booking status
router.patch('/bookings/:id/status', authenticate(['admin', 'receptionist', 'therapist']), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
    });

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Error updating booking status' });
  }
});

// Get services
router.get('/services', async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching services' });
  }
});

// Create service (admin only)
router.post('/services', authenticate(['admin', 'super_admin']), async (req, res) => {
  try {
    const service = await prisma.service.create({
      data: req.body,
    });
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ error: 'Error creating service' });
  }
});

// Payments
router.get('/payments', authenticate(['admin', 'receptionist']), async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        booking: {
          include: {
            user: true,
            service: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching payments' });
  }
});

// Create payment
router.post('/payments', authenticate(), async (req, res) => {
  try {
    const { bookingId, amount, method } = req.body;

    const payment = await prisma.payment.create({
      data: {
        bookingId,
        amount,
        method,
        status: 'COMPLETED',
      },
    });

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Error creating payment' });
  }
});

// Users (admin only)
router.get('/users', authenticate(['admin', 'super_admin']), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// Dashboard stats
router.get('/stats', authenticate(['admin', 'receptionist', 'therapist']), async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bookingsToday = await prisma.booking.count({
      where: {
        date: { gte: today },
      },
    });

    const pendingBookings = await prisma.booking.count({
      where: { status: 'PENDING' },
    });

    const activeSubscriptions = await prisma.subscription.count({
      where: { isActive: true },
    });

    const usersTotal = await prisma.user.count();

    const revenueToday = await prisma.payment.aggregate({
      where: {
        createdAt: { gte: today },
        status: 'COMPLETED',
      },
      _sum: { amount: true },
    });

    res.json({
      bookingsToday,
      pendingBookings,
      activeSubscriptions,
      usersTotal,
      revenueToday: revenueToday._sum.amount || 0,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching stats' });
  }
});

export default router;