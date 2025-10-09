export type UserRole = "Apprentice" | "Scorer" | "Program Operator" | "Program Orchestrator";

export type User = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  password?: string;
};

export type TaskStatus = "Not Started" | "In Progress" | "Submitted" | "Scored" | "Overdue";

export type Task = {
  id: number;
  title: string;
  phase: string;
  objective: string;
  eta: string; 
  status: TaskStatus;
  assigneeId: number;
  description: string;
  score?: number;
  submissionCount?: number;
};

export type Announcement = {
  id: number;
  title: string;
  content: string;
  date: string;
  author: string;
};

export type ScoreBreakdown = {
    depth: number;
    relevance: number;
    applicability: number;
    novelty: number;
    packaging: number;
};

export type Submission = {
    id: number;
    taskId: number;
    taskTitle: string;
    assigneeId: number;
    assigneeName: string;
    submittedAt: string;
    status: 'Pending Score' | 'Scored';
    fileUrl: string;
    scores?: ScoreBreakdown;
    score?: number;
    scorer?: string;
};

export type AccessRequest = {
    id: number;
    userName: string;
    userEmail: string;
    userRole: string;
    requestedAt: string;
    status: 'Pending' | 'Approved' | 'Rejected';
};
