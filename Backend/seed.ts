import { PrismaClient, NotificationType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const lecturer = await prisma.user.findUnique({
    where: { email: "johndoe@gmail.com" },
  });

  const student = await prisma.user.findUnique({
    where: { email: "janedoe@gmail.com" },
  });
  if (!lecturer) {
    console.error("❌ Lecturer not found. Check email.");
    process.exit(1);
  }
  if (!student) {
    console.error("❌ Student not found. Check email.");
    process.exit(1);
  }

  // Tell TypeScript these are definitely not null from here on
  const lecturerId = lecturer.id;
  const studentId = student.id;

  console.log(`✅ Lecturer: ${lecturerId}`);
  console.log(`✅ Student:  ${studentId}`);

  await prisma.notification.deleteMany({
    where: { userId: { in: [lecturerId, studentId] } },
  });
  console.log("🧹 Cleared existing notifications");

  await prisma.notification.createMany({
    data: [
      {
        userId: lecturerId,
        type: NotificationType.SYSTEM,
        title: "New student enrolled",
        body: "A student has enrolled in your course",
        isRead: false,
        createdAt: new Date(),
      },
      {
        userId: lecturerId,
        type: NotificationType.GRADE_POSTED,
        title: "Assignment submission pending review",
        body: "5 students have submitted Assignment 2",
        isRead: true,
        readAt: new Date(),
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        userId: lecturerId,
        type: NotificationType.RISK_ALERT,
        title: "At-risk student detected",
        body: "A student in your course shows high risk indicators",
        isRead: false,
        createdAt: new Date(),
      },
    ],
  });

  await prisma.notification.createMany({
    data: [
      {
        userId: studentId,
        type: NotificationType.QUIZ_READY,
        title: "New quiz available",
        body: "Quiz 3 is now open — covers modules 4-5",
        isRead: false,
        createdAt: new Date(),
      },
      {
        userId: studentId,
        type: NotificationType.ASSIGNMENT_DUE,
        title: "Assignment due soon",
        body: "Assignment 2 is due in 2 days",
        isRead: false,
        createdAt: new Date(),
      },
      {
        userId: studentId,
        type: NotificationType.GRADE_POSTED,
        title: "Grade posted",
        body: "You received 85/100 on Midterm Exam",
        isRead: true,
        readAt: new Date(),
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        userId: studentId,
        type: NotificationType.SYSTEM,
        title: "Maintenance notice",
        body: "Platform will be offline Sunday 2-4 AM",
        isRead: false,
        createdAt: new Date(),
      },
    ],
  });

  // Add after your notification seeding

const course = await prisma.course.findFirst({
  where: { lecturerId: lecturerId }
});

if (course) {
  await prisma.activityEvent.deleteMany({
    where: { userId: studentId, courseId: course.id }
  });

  await prisma.activityEvent.createMany({
    data: [
      {
        userId: studentId,
        courseId: course.id,
        type: "LOGIN",
        occurredAt: new Date(),
      },
      {
        userId: studentId,
        courseId: course.id,
        type: "LESSON_VIEWED",
        occurredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        userId: studentId,
        courseId: course.id,
        type: "QUIZ_STARTED",
        occurredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        userId: studentId,
        courseId: course.id,
        type: "ASSIGNMENT_SUBMITTED",
        occurredAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        userId: studentId,
        courseId: course.id,
        type: "LESSON_COMPLETED",
        occurredAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
    ],
  });
  console.log(`✅ Seeded activity events for student in course ${course.id}`);
}

  const lCount = await prisma.notification.count({
    where: { userId: lecturerId },
  });
  const sCount = await prisma.notification.count({
    where: { userId: studentId },
  });
  console.log(`📧 Lecturer: ${lCount} notifications`);
  console.log(`📧 Student:  ${sCount} notifications`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
