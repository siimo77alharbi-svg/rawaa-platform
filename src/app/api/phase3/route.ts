import { PrismaClient } from '@prisma/client';
import { analyzeCustomerBehavior, generateHealthProfile } from '@/lib/ai-recommendations';
import { createCourse, enrollInCourse, administerHealthTest, submitTestResults } from '@/lib/courses';

const prisma = new PrismaClient();

// Get customer recommendations
export async function GET_recommendations(req: Request) {
  const url = new URL(req.url);
  const customerId = parseInt(url.searchParams.get('customerId') || '');

  if (!customerId) {
    return Response.json({ error: 'customerId required' }, { status: 400 });
  }

  const recommendations = await analyzeCustomerBehavior(customerId);
  return Response.json(recommendations);
}

// Health assessment
export async function POST_health_assessment(req: Request) {
  const body = await req.json();
  const { customerId, answers } = body;

  if (!customerId || !answers) {
    return Response.json({ error: 'customerId and answers required' }, { status: 400 });
  }

  const profile = await generateHealthProfile(customerId, answers);
  return Response.json(profile);
}

// Course enrollment
export async function POST_course_enrollment(req: Request) {
  const body = await req.json();
  const { customerId, courseId } = body;

  if (!customerId || !courseId) {
    return Response.json({ error: 'customerId and courseId required' }, { status: 400 });
  }

  const enrollment = await enrollInCourse(customerId, courseId);
  return Response.json(enrollment);
}

// Health test
export async function POST_health_test(req: Request) {
  const body = await req.json();
  const { customerId, questions } = body;

  if (!customerId || !questions) {
    return Response.json({ error: 'customerId and questions required' }, { status: 400 });
  }

  const test = await administerHealthTest(customerId, questions);
  return Response.json(test);
}

// Submit health test results
export async function POST_health_test_results(req: Request) {
  const body = await req.json();
  const { testId, answers } = body;

  if (!testId || !answers) {
    return Response.json({ error: 'testId and answers required' }, { status: 400 });
  }

  const results = await submitTestResults(testId, answers);
  return Response.json(results);
}

// Get health profile
export async function GET_health_profile(req: Request) {
  const url = new URL(req.url);
  const customerId = parseInt(url.searchParams.get('customerId') || '');

  if (!customerId) {
    return Response.json({ error: 'customerId required' }, { status: 400 });
  }

  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    select: {
      healthProfile: true,
      healthAssessmentDate: true
    }
  });

  if (!customer) {
    return Response.json({ error: 'Customer not found' }, { status: 404 });
  }

  return Response.json(customer);
}