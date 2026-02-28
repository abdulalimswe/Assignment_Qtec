import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { Job } from "@/types/job";
import { useJobs } from "@/context/JobContext";
import FeaturedJobCard from "./FeaturedJobCard";

const FeaturedJobs = () => {
  const { jobs } = useJobs();
  const featured = jobs.filter((j) => j.featured).slice(0, 6);
  const latest = jobs.slice(0, 6);

  return (
    <>
      {/* Featured Jobs */}
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
          <div className="flex gap-6 overflow-x-auto pb-4">
            {featured.map((job) => (
              <FeaturedJobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Jobs */}
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
          <div className="space-y-4">
            {latest.map((job) => (
              <Link
                key={job.id}
                to={`/jobs/${job.id}`}
                className="group flex flex-col gap-4 rounded-xl border bg-card p-5 transition-all hover:border-primary hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={job.companyLogo}
                    alt={job.company}
                    className="h-12 w-12 rounded-lg border bg-background object-contain p-1"
                  />
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary">{job.title}</h3>
                    <p className="text-sm text-muted-foreground">{job.company}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" /> {job.location}
                  </span>
                  {job.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  <span className="font-semibold text-primary">{job.salary}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default FeaturedJobs;
