export interface Candidate {
  id: string;
  name: string;
  email: string;
  position: string;
  overallScore: number;
  communicationScore: number;
  technicalScore: number;
  confidenceScore: number;
  status: "Pending" | "Completed" | "In Progress" | "Failed";
  date: string;
  resumeUrl?: string;
  transcript: string;
  flags: string[];
  answers: CandidateAnswer[];
}

export interface CandidateAnswer {
  questionId: number;
  question: string;
  answer: string;
  confidence: number;
  duration: number;
  timestamp: string;
  keywordsCovered: string[];
  mistakes: string[];
}

export interface QuestionBankItem {
  id: string;
  question: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  tags: string[];
  expectedKeywords: string[];
  createdAt: string;
}

export interface InterviewTemplate {
  id: string;
  name: string;
  questionIds: string[];
  timePerQuestion: number;
  strictnessLevel: "Low" | "Medium" | "High";
  createdAt: string;
}

export const mockCandidates: Candidate[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    position: "Frontend Developer",
    overallScore: 87,
    communicationScore: 92,
    technicalScore: 84,
    confidenceScore: 85,
    status: "Completed",
    date: "2026-02-15",
    transcript: "Sample transcript of interview responses...",
    flags: [],
    answers: [
      {
        questionId: 1,
        question: "Tell me about yourself and your background.",
        answer: "I have 5 years of experience in frontend development...",
        confidence: 85,
        duration: 120,
        timestamp: "2026-02-15T10:00:00Z",
        keywordsCovered: ["experience", "skills", "background"],
        mistakes: [],
      },
    ],
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@email.com",
    position: "Backend Developer",
    overallScore: 76,
    communicationScore: 72,
    technicalScore: 82,
    confidenceScore: 74,
    status: "Completed",
    date: "2026-02-14",
    transcript: "Sample transcript of interview responses...",
    flags: ["Tab switching detected"],
    answers: [],
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.r@email.com",
    position: "Full Stack Developer",
    overallScore: 92,
    communicationScore: 94,
    technicalScore: 91,
    confidenceScore: 90,
    status: "Completed",
    date: "2026-02-13",
    transcript: "Sample transcript of interview responses...",
    flags: [],
    answers: [],
  },
  {
    id: "4",
    name: "David Kim",
    email: "david.kim@email.com",
    position: "DevOps Engineer",
    overallScore: 68,
    communicationScore: 65,
    technicalScore: 72,
    confidenceScore: 67,
    status: "Completed",
    date: "2026-02-12",
    transcript: "Sample transcript of interview responses...",
    flags: ["Multiple persons detected", "Background noise"],
    answers: [],
  },
  {
    id: "5",
    name: "Jessica Taylor",
    email: "jessica.t@email.com",
    position: "Frontend Developer",
    overallScore: 0,
    communicationScore: 0,
    technicalScore: 0,
    confidenceScore: 0,
    status: "In Progress",
    date: "2026-02-16",
    transcript: "",
    flags: [],
    answers: [],
  },
];

export const mockQuestions: QuestionBankItem[] = [
  {
    id: "q1",
    question: "Tell me about yourself and your background.",
    difficulty: "Easy",
    category: "General",
    tags: ["introduction", "experience"],
    expectedKeywords: ["experience", "skills", "background", "passion"],
    createdAt: "2026-01-15",
  },
  {
    id: "q2",
    question: "What are your greatest strengths?",
    difficulty: "Medium",
    category: "Behavioral",
    tags: ["strengths", "self-assessment"],
    expectedKeywords: ["strength", "skill", "ability", "value"],
    createdAt: "2026-01-15",
  },
  {
    id: "q3",
    question: "Describe a challenging project you worked on.",
    difficulty: "Hard",
    category: "Technical",
    tags: ["problem-solving", "experience"],
    expectedKeywords: ["challenge", "problem", "solution", "team", "result"],
    createdAt: "2026-01-15",
  },
  {
    id: "q4",
    question: "How do you handle tight deadlines?",
    difficulty: "Medium",
    category: "Behavioral",
    tags: ["time-management", "stress"],
    expectedKeywords: ["prioritize", "organize", "communicate", "deliver"],
    createdAt: "2026-01-16",
  },
  {
    id: "q5",
    question: "What is your experience with REST APIs?",
    difficulty: "Hard",
    category: "Technical",
    tags: ["backend", "api"],
    expectedKeywords: ["REST", "HTTP", "endpoints", "methods", "authentication"],
    createdAt: "2026-01-16",
  },
];

export const mockTemplates: InterviewTemplate[] = [
  {
    id: "t1",
    name: "Junior Developer Interview",
    questionIds: ["q1", "q2", "q4"],
    timePerQuestion: 180,
    strictnessLevel: "Low",
    createdAt: "2026-01-20",
  },
  {
    id: "t2",
    name: "Senior Developer Interview",
    questionIds: ["q1", "q3", "q5"],
    timePerQuestion: 240,
    strictnessLevel: "High",
    createdAt: "2026-01-21",
  },
];

export const analyticsData = {
  totalCandidates: 48,
  averageScore: 78.5,
  passRate: 72,
  todayInterviews: 5,
  scoreDistribution: [
    { range: "0-20", count: 2 },
    { range: "21-40", count: 5 },
    { range: "41-60", count: 8 },
    { range: "61-80", count: 18 },
    { range: "81-100", count: 15 },
  ],
  performanceTrends: [
    { month: "Sep", score: 72 },
    { month: "Oct", score: 75 },
    { month: "Nov", score: 77 },
    { month: "Dec", score: 76 },
    { month: "Jan", score: 79 },
    { month: "Feb", score: 78.5 },
  ],
  topicWeakness: [
    { topic: "Communication", score: 82 },
    { topic: "Technical", score: 75 },
    { topic: "Problem Solving", score: 78 },
    { topic: "Leadership", score: 71 },
  ],
};

export const modelPerformanceData = {
  precision: 0.89,
  recall: 0.86,
  f1Score: 0.875,
  accuracy: 0.91,
  confidenceReliability: 0.88,
  driftDetection: {
    status: "Normal",
    lastChecked: "2026-02-16T08:00:00Z",
  },
  confusionMatrix: {
    truePositive: 156,
    trueNegative: 142,
    falsePositive: 18,
    falseNegative: 24,
  },
  monthlyAccuracy: [
    { month: "Sep", accuracy: 0.87 },
    { month: "Oct", accuracy: 0.88 },
    { month: "Nov", accuracy: 0.89 },
    { month: "Dec", accuracy: 0.90 },
    { month: "Jan", accuracy: 0.91 },
    { month: "Feb", accuracy: 0.91 },
  ],
};
