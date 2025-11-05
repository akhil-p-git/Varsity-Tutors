import { TutorSession } from '../types';

// Generate dates within the last 7 days
const now = new Date();

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Tutor IDs: 3-10 (from mock-tutors)
// Student IDs: 1 (Alex Chen from mockUsers), 101-106 (mockFriends)

export const mockTutorSessions: TutorSession[] = [
  {
    id: 'tutor-session-1',
    tutorId: 3, // Dr. Smith
    studentId: 1, // Alex Chen
    subject: 'Algebra',
    startTime: randomDate(new Date(now.getTime() - 2 * 60 * 60 * 1000), now),
    endTime: new Date(),
    preScore: 68,
    postScore: 85,
    improvement: 17,
    studentSatisfaction: 5,
    topics: ['Linear Equations', 'Quadratic Functions', 'Factoring'],
  },
  {
    id: 'tutor-session-2',
    tutorId: 3, // Dr. Smith
    studentId: 101, // Jordan Kim
    subject: 'Geometry',
    startTime: randomDate(new Date(now.getTime() - 24 * 60 * 60 * 1000), new Date(now.getTime() - 20 * 60 * 60 * 1000)),
    endTime: new Date(now.getTime() - 23 * 60 * 60 * 1000),
    preScore: 72,
    postScore: 88,
    improvement: 16,
    studentSatisfaction: 5,
    topics: ['Triangles', 'Area Calculations', 'Pythagorean Theorem'],
  },
  {
    id: 'tutor-session-3',
    tutorId: 4, // Ms. Chen
    studentId: 102, // Sam Patel
    subject: 'Chemistry',
    startTime: randomDate(new Date(now.getTime() - 18 * 60 * 60 * 1000), new Date(now.getTime() - 16 * 60 * 60 * 1000)),
    endTime: new Date(now.getTime() - 17 * 60 * 60 * 1000),
    preScore: 75,
    postScore: 89,
    improvement: 14,
    studentSatisfaction: 5,
    topics: ['Chemical Reactions', 'Balancing Equations', 'Stoichiometry'],
  },
  {
    id: 'tutor-session-4',
    tutorId: 5, // Prof. Johnson
    studentId: 105, // Riley Johnson
    subject: 'Calculus',
    startTime: randomDate(new Date(now.getTime() - 36 * 60 * 60 * 1000), new Date(now.getTime() - 34 * 60 * 60 * 1000)),
    endTime: new Date(now.getTime() - 35 * 60 * 60 * 1000),
    preScore: 78,
    postScore: 91,
    improvement: 13,
    studentSatisfaction: 5,
    topics: ['Derivatives', 'Chain Rule', 'Applications'],
  },
  {
    id: 'tutor-session-5',
    tutorId: 6, // Ms. Rodriguez
    studentId: 103, // Alex Morgan
    subject: 'Algebra',
    startTime: randomDate(new Date(now.getTime() - 48 * 60 * 60 * 1000), new Date(now.getTime() - 46 * 60 * 60 * 1000)),
    endTime: new Date(now.getTime() - 47 * 60 * 60 * 1000),
    preScore: 58,
    postScore: 74,
    improvement: 16,
    studentSatisfaction: 4,
    topics: ['Basic Equations', 'Fractions', 'Order of Operations'],
  },
  {
    id: 'tutor-session-6',
    tutorId: 7, // Mr. Kim
    studentId: 1, // Alex Chen
    subject: 'Physics',
    startTime: randomDate(new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000)),
    endTime: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
    preScore: 81,
    postScore: 92,
    improvement: 11,
    studentSatisfaction: 5,
    topics: ['Kinematics', 'Forces', 'Newton\'s Laws'],
  },
  {
    id: 'tutor-session-7',
    tutorId: 3, // Dr. Smith
    studentId: 104, // Taylor Chen
    subject: 'Algebra',
    startTime: randomDate(new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000), new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000)),
    endTime: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000),
    preScore: 65,
    postScore: 82,
    improvement: 17,
    studentSatisfaction: 5,
    topics: ['Graphing Linear Equations', 'Slope', 'Intercepts'],
  },
  {
    id: 'tutor-session-8',
    tutorId: 8, // Dr. Williams
    studentId: 101, // Jordan Kim
    subject: 'Chemistry',
    startTime: randomDate(new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000)),
    endTime: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000 + 75 * 60 * 1000),
    preScore: 70,
    postScore: 86,
    improvement: 16,
    studentSatisfaction: 4,
    topics: ['Atomic Structure', 'Periodic Table', 'Chemical Bonds'],
  },
  {
    id: 'tutor-session-9',
    tutorId: 9, // Ms. Patel
    studentId: 102, // Sam Patel
    subject: 'Geometry',
    startTime: randomDate(new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000)),
    endTime: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000),
    preScore: 77,
    postScore: 90,
    improvement: 13,
    studentSatisfaction: 5,
    topics: ['Circles', 'Angles', 'Arc Length'],
  },
  {
    id: 'tutor-session-10',
    tutorId: 10, // Mr. Thompson
    studentId: 106, // Casey Williams
    subject: 'Geometry',
    startTime: randomDate(new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000), new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000)),
    endTime: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000),
    preScore: 52,
    postScore: 71,
    improvement: 19,
    studentSatisfaction: 4,
    topics: ['Basic Shapes', 'Perimeter', 'Area'],
  },
  {
    id: 'tutor-session-11',
    tutorId: 5, // Prof. Johnson
    studentId: 1, // Alex Chen
    subject: 'Calculus',
    startTime: randomDate(new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000)),
    endTime: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
    preScore: 82,
    postScore: 94,
    improvement: 12,
    studentSatisfaction: 5,
    topics: ['Integration', 'Fundamental Theorem', 'Applications'],
  },
  {
    id: 'tutor-session-12',
    tutorId: 4, // Ms. Chen
    studentId: 105, // Riley Johnson
    subject: 'Physics',
    startTime: randomDate(new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000)),
    endTime: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000 + 75 * 60 * 1000),
    preScore: 68,
    postScore: 84,
    improvement: 16,
    studentSatisfaction: 5,
    topics: ['Energy', 'Work', 'Power'],
  },
  {
    id: 'tutor-session-13',
    tutorId: 3, // Dr. Smith
    studentId: 101, // Jordan Kim
    subject: 'Algebra',
    startTime: randomDate(new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000)),
    endTime: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
    preScore: 71,
    postScore: 87,
    improvement: 16,
    studentSatisfaction: 5,
    topics: ['Systems of Equations', 'Substitution', 'Elimination'],
  },
  {
    id: 'tutor-session-14',
    tutorId: 7, // Mr. Kim
    studentId: 104, // Taylor Chen
    subject: 'Physics',
    startTime: randomDate(new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000)),
    endTime: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000),
    preScore: 85,
    postScore: 95,
    improvement: 10,
    studentSatisfaction: 5,
    topics: ['Electromagnetism', 'Circuits', 'Ohm\'s Law'],
  },
  {
    id: 'tutor-session-15',
    tutorId: 6, // Ms. Rodriguez
    studentId: 103, // Alex Morgan
    subject: 'Geometry',
    startTime: randomDate(new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000)),
    endTime: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
    preScore: 61,
    postScore: 78,
    improvement: 17,
    studentSatisfaction: 4,
    topics: ['Congruence', 'Similarity', 'Transformations'],
  },
  {
    id: 'tutor-session-16',
    tutorId: 9, // Ms. Patel
    studentId: 1, // Alex Chen
    subject: 'Algebra',
    startTime: randomDate(new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000), new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000)),
    endTime: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000),
    preScore: 74,
    postScore: 88,
    improvement: 14,
    studentSatisfaction: 5,
    topics: ['Polynomials', 'Factoring', 'Quadratic Formula'],
  },
  {
    id: 'tutor-session-17',
    tutorId: 8, // Dr. Williams
    studentId: 102, // Sam Patel
    subject: 'Chemistry',
    startTime: randomDate(new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000), new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000)),
    endTime: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000),
    preScore: 73,
    postScore: 87,
    improvement: 14,
    studentSatisfaction: 4,
    topics: ['Acids and Bases', 'pH Scale', 'Titration'],
  },
  {
    id: 'tutor-session-18',
    tutorId: 10, // Mr. Thompson
    studentId: 106, // Casey Williams
    subject: 'Calculus',
    startTime: randomDate(new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000), new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000)),
    endTime: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000),
    preScore: 55,
    postScore: 72,
    improvement: 17,
    studentSatisfaction: 4,
    topics: ['Limits', 'Continuity', 'Basic Derivatives'],
  },
  {
    id: 'tutor-session-19',
    tutorId: 3, // Dr. Smith
    studentId: 104, // Taylor Chen
    subject: 'Geometry',
    startTime: randomDate(new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000), new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000)),
    endTime: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000 + 11 * 60 * 60 * 1000),
    preScore: 69,
    postScore: 84,
    improvement: 15,
    studentSatisfaction: 5,
    topics: ['Volume', 'Surface Area', '3D Shapes'],
  },
  {
    id: 'tutor-session-20',
    tutorId: 5, // Prof. Johnson
    studentId: 105, // Riley Johnson
    subject: 'Calculus',
    startTime: randomDate(new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000), new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000)),
    endTime: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000),
    preScore: 79,
    postScore: 92,
    improvement: 13,
    studentSatisfaction: 5,
    topics: ['Optimization', 'Related Rates', 'Applications'],
  },
  {
    id: 'tutor-session-21',
    tutorId: 4, // Ms. Chen
    studentId: 1, // Alex Chen
    subject: 'Chemistry',
    startTime: randomDate(new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000), new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000)),
    endTime: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000),
    preScore: 76,
    postScore: 91,
    improvement: 15,
    studentSatisfaction: 5,
    topics: ['Thermodynamics', 'Enthalpy', 'Entropy'],
  },
  {
    id: 'tutor-session-22',
    tutorId: 7, // Mr. Kim
    studentId: 101, // Jordan Kim
    subject: 'Calculus',
    startTime: randomDate(new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000), new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000)),
    endTime: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000 + 13 * 60 * 60 * 1000),
    preScore: 83,
    postScore: 94,
    improvement: 11,
    studentSatisfaction: 5,
    topics: ['Series', 'Convergence', 'Taylor Series'],
  },
  {
    id: 'tutor-session-23',
    tutorId: 6, // Ms. Rodriguez
    studentId: 103, // Alex Morgan
    subject: 'Algebra',
    startTime: randomDate(new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000), new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000)),
    endTime: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000 + 11 * 60 * 60 * 1000),
    preScore: 63,
    postScore: 79,
    improvement: 16,
    studentSatisfaction: 4,
    topics: ['Inequalities', 'Absolute Value', 'Word Problems'],
  },
  {
    id: 'tutor-session-24',
    tutorId: 9, // Ms. Patel
    studentId: 102, // Sam Patel
    subject: 'Geometry',
    startTime: randomDate(new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000), new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000)),
    endTime: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000 + 15 * 60 * 60 * 1000),
    preScore: 80,
    postScore: 93,
    improvement: 13,
    studentSatisfaction: 5,
    topics: ['Coordinate Geometry', 'Distance Formula', 'Midpoint'],
  },
  {
    id: 'tutor-session-25',
    tutorId: 8, // Dr. Williams
    studentId: 105, // Riley Johnson
    subject: 'Physics',
    startTime: randomDate(new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000), new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000)),
    endTime: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000),
    preScore: 72,
    postScore: 87,
    improvement: 15,
    studentSatisfaction: 5,
    topics: ['Waves', 'Sound', 'Frequency'],
  },
  {
    id: 'tutor-session-26',
    tutorId: 10, // Mr. Thompson
    studentId: 106, // Casey Williams
    subject: 'Algebra',
    startTime: randomDate(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000)),
    endTime: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000),
    preScore: 49,
    postScore: 68,
    improvement: 19,
    studentSatisfaction: 4,
    topics: ['Basic Operations', 'Fractions', 'Decimals'],
  },
  {
    id: 'tutor-session-27',
    tutorId: 3, // Dr. Smith
    studentId: 104, // Taylor Chen
    subject: 'Calculus',
    startTime: randomDate(new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000), new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000)),
    endTime: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000 + 13 * 60 * 60 * 1000),
    preScore: 75,
    postScore: 89,
    improvement: 14,
    studentSatisfaction: 5,
    topics: ['Derivatives', 'Product Rule', 'Quotient Rule'],
  },
  {
    id: 'tutor-session-28',
    tutorId: 5, // Prof. Johnson
    studentId: 1, // Alex Chen
    subject: 'Geometry',
    startTime: randomDate(new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000), new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000)),
    endTime: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 13 * 60 * 60 * 1000),
    preScore: 84,
    postScore: 96,
    improvement: 12,
    studentSatisfaction: 5,
    topics: ['Proofs', 'Theorems', 'Logical Reasoning'],
  },
];

export function getTutorSessionsByTutor(tutorId: number): TutorSession[] {
  return mockTutorSessions.filter(session => session.tutorId === tutorId);
}

export function getTutorSessionsByStudent(studentId: number): TutorSession[] {
  return mockTutorSessions.filter(session => session.studentId === studentId);
}

export function getRecentTutorSessions(days: number = 7): TutorSession[] {
  const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return mockTutorSessions.filter(session => new Date(session.startTime) >= cutoff);
}

