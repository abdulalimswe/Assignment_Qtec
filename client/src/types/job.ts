// Shape returned from the PostgreSQL backend
export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  category: string;
  description: string;
  created_at: string;
  updated_at: string;
}

// Payload sent when creating a job via POST /api/jobs
export interface CreateJobPayload {
  title: string;
  company: string;
  location: string;
  category: string;
  description: string;
}

// Payload sent when submitting an application via POST /api/applications
export interface JobApplication {
  jobId: number;
  name: string;
  email: string;
  resumeLink: string;
  coverNote?: string;
}

export type JobCategory =
  | "Design"
  | "Sales"
  | "Marketing"
  | "Finance"
  | "Technology"
  | "Engineering"
  | "Business"
  | "Human Resources";
