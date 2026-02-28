export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  type: JobType;
  category: JobCategory;
  salary: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  tags: string[];
  postedDate: string;
  featured: boolean;
}

export type JobType = "Full-time" | "Part-time" | "Contract" | "Remote" | "Internship";

export type JobCategory =
  | "Design"
  | "Sales"
  | "Marketing"
  | "Finance"
  | "Technology"
  | "Engineering"
  | "Business"
  | "Human Resources";

export interface JobApplication {
  name: string;
  email: string;
  resumeUrl: string;
  coverNote: string;
}
