import React, { createContext, useContext, useState, ReactNode } from "react";
import { Job } from "@/types/job";
import { initialJobs } from "@/data/jobs";

interface JobContextType {
  jobs: Job[];
  addJob: (job: Omit<Job, "id">) => void;
  deleteJob: (id: string) => void;
  getJob: (id: string) => Job | undefined;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider = ({ children }: { children: ReactNode }) => {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);

  const addJob = (job: Omit<Job, "id">) => {
    const newJob: Job = { ...job, id: Date.now().toString() };
    setJobs((prev) => [newJob, ...prev]);
  };

  const deleteJob = (id: string) => {
    setJobs((prev) => prev.filter((job) => job.id !== id));
  };

  const getJob = (id: string) => jobs.find((job) => job.id === id);

  return (
    <JobContext.Provider value={{ jobs, addJob, deleteJob, getJob }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) throw new Error("useJobs must be used within JobProvider");
  return context;
};
