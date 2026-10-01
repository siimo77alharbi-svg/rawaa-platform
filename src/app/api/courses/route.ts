import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all active courses
export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      where: { status: 'active' },
      include: {
        enrollments: {
          select: { id: true }
        }
      }
    });

    // Add participant count
    const result = courses.map(course => ({
      ...course,
      participants: course.enrollments.length
    }));

    return Response.json(result);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return Response.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}