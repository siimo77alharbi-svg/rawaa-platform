import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Enroll in course
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { courseId, userId } = body;

    if (!courseId || !userId) {
      return Response.json({ error: 'courseId and userId required' }, { status: 400 });
    }

    // Check if already enrolled
    const existing = await prisma.courseEnrollment.findUnique({
      where: { courseId_userId: { courseId, userId } }
    });

    if (existing) {
      return Response.json({ error: 'Already enrolled' }, { status: 400 });
    }

    // Check available seats
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { enrollments: true }
    });

    if (!course) {
      return Response.json({ error: 'Course not found' }, { status: 404 });
    }

    if (course.enrollments.length >= course.maxParticipants) {
      return Response.json({ error: 'Course full' }, { status: 400 });
    }

    // Enroll
    const enrollment = await prisma.courseEnrollment.create({
      data: {
        courseId,
        userId
      }
    });

    return Response.json(enrollment);
  } catch (error) {
    console.error('Error enrolling in course:', error);
    return Response.json({ error: 'Failed to enroll' }, { status: 500 });
  }
}