import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin } from "lucide-react";
import { useJobsQuery } from "@/hooks/useJobQueries";
import FeaturedJobCard from "./FeaturedJobCard";

const avatarUrl = (company: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(company)}&background=4540DB&color=fff&size=96`;

const FeaturedJobs = () => {
  const { data, isLoading } = useJobsQuery({ limit: 6 });
  const jobs = data?.data ?? [];

  return (
    <>
      {/* Featured Jobs (horizontal scroll) */}
      <section className="bg-secondary py-20">
        <div className="container">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                Featured <span className="text-primary">Jobs</span>
              </h2>
              <p className="mt-2 text-muted-foreground">Choose jobs from the top employers</p>
            </div>
            <Button variant="outline" asChild className="hidden sm:flex">
              <Link to="/jobs">View All</Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="flex gap-6 overflow-x-auto pb-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex min-w-[280px] flex-col gap-4 rounded-xl border bg-card p-6"
                >
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex gap-6 overflow-x-auto pb-4">
              {jobs.map((job) => (
                <FeaturedJobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Latest Jobs (list) */}
      <section className="py-20">
        <div className="container">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                Latest <span className="text-primary">Jobs Open</span>
              </h2>
              <p className="mt-2 text-muted-foreground">Find your next career opportunity</p>
            </div>
            <Button variant="outline" asChild className="hidden sm:flex">
              <Link to="/jobs">View All</Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 rounded-xl border bg-card p-5">
                  <Skeleton className="h-12 w-12 shrink-0 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                  <Skeleton className="hidden h-5 w-20 rounded-full sm:block" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <Link
                  key={job.id}
                  to={`/jobs/${job.id}`}
                  className="group flex flex-col gap-4 rounded-xl border bg-card p-5 transition-all hover:border-primary hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={avatarUrl(job.company)}
                      alt={job.company}
                      className="h-12 w-12 rounded-lg border bg-background object-contain p-1"
                    />
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary">
                        {job.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{job.company}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" /> {job.location}
                    </span>
                    <Badge variant="secondary" className="text-xs">{job.category}</Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default FeaturedJobs;
