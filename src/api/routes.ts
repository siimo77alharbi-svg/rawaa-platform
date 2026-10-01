import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth';
import {
  sendBookingConfirmation,
  sendAppointmentReminder,
  sendPromoMessage,
  sendGeneralNotification,
  getNotificationLogs,
} from '../lib/notifications';

const router = Router();

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
    const id = req.params.id as string;
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
router.get('/payments', authenticate(), async (req, res) => {
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

// Get payment history for user
router.get('/payments/history', authenticate(), async (req, res) => {
  try {
    const userId = req.user.id;
    const payments = await prisma.payment.findMany({
      where: { userId },
      include: {
        booking: {
          include: {
            service: true,
            therapist: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching payment history' });
  }
});

// Process payment
router.post('/payments/process', authenticate(), async (req, res) => {
  try {
    const { bookingId, amount, method, notes } = req.body;
    const userId = req.user.id;

    if (!bookingId) {
      return res.status(400).json({ error: 'bookingId is required' });
    }
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }
    if (!['CASH', 'CARD', 'TRANSFER'].includes(method)) {
      return res.status(400).json({ error: 'Invalid payment method' });
    }

    // Generate receipt number
    const receiptNo = `REC-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    const payment = await prisma.payment.create({
      data: {
        bookingId,
        userId,
        amount,
        method,
        status: 'COMPLETED',
        receiptNo,
      },
      include: {
        booking: {
          include: {
            service: true,
            user: { select: { name: true, email: true } },
          },
        },
      },
    });

    // Update booking status to confirmed
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CONFIRMED' },
    });

    res.status(201).json(payment);
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ error: 'Error processing payment' });
  }
});

// Get payment by ID
router.get('/payments/:id', authenticate(), async (req, res) => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: req.params.id as string },
      include: {
        booking: {
          include: {
            service: true,
            user: { select: { name: true, email: true } },
            therapist: { select: { name: true } },
          },
        },
      },
    });
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching payment' });
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

// ===== Notification Routes =====

// Send booking confirmation
router.post('/notifications/booking-confirmation', authenticate(['admin', 'receptionist']), async (req, res) => {
  try {
    const { userId, serviceId, bookingId } = req.body;
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { user: true, service: true },
    });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    const results = await sendBookingConfirmation(
      booking.user.id,
      booking.user.name,
      booking.user.phone,
      booking.user.email,
      booking.service.name,
      booking.date.toISOString().split('T')[0]
    );
    res.json({ success: true, results });
  } catch (error) {
    console.error('Error sending booking confirmation:', error);
    res.status(500).json({ error: 'Error sending booking confirmation' });
  }
});

// Send appointment reminder
router.post('/notifications/reminder', authenticate(['admin', 'receptionist']), async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { user: true, service: true },
    });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    const results = await sendAppointmentReminder(
      booking.user.id,
      booking.user.name,
      booking.user.phone,
      booking.user.email,
      booking.service.name,
      booking.date.toISOString().split('T')[0]
    );
    res.json({ success: true, results });
  } catch (error) {
    console.error('Error sending reminder:', error);
    res.status(500).json({ error: 'Error sending reminder' });
  }
});

// Send promo message
router.post('/notifications/promo', authenticate(['admin', 'super_admin']), async (req, res) => {
  try {
    const { userId, offer } = req.body;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const results = await sendPromoMessage(user.id, user.name, user.phone, user.email, offer);
    res.json({ success: true, results });
  } catch (error) {
    console.error('Error sending promo:', error);
    res.status(500).json({ error: 'Error sending promo' });
  }
});

// Send general notification
router.post('/notifications/general', authenticate(['admin', 'super_admin']), async (req, res) => {
  try {
    const { userId, message } = req.body;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const results = await sendGeneralNotification(user.id, user.name, user.phone, user.email, message);
    res.json({ success: true, results });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: 'Error sending notification' });
  }
});

// Get notification logs
router.get('/notifications/logs', authenticate(['admin', 'receptionist', 'therapist']), async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const logs = await getNotificationLogs(limit);
    res.json(logs);
  } catch (error) {
    console.error('Error fetching notification logs:', error);
    res.status(500).json({ error: 'Error fetching notification logs' });
  }
});

export default router;