import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { Job } from "@/types/job";

const FeaturedJobCard = ({ job }: { job: Job }) => {
  return (
    <Link
      to={`/jobs/${job.id}`}
      className="group flex min-w-[300px] flex-col gap-4 rounded-xl border bg-card p-6 transition-all hover:border-primary hover:shadow-md"
    >
      <div className="flex items-start gap-4">
        <img
          src={job.companyLogo}
          alt={job.company}
          className="h-12 w-12 rounded-lg border bg-background object-contain p-1"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-foreground group-hover:text-primary">{job.title}</h3>
          <p className="text-sm text-muted-foreground">{job.company}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4" />
        {job.location}
      </div>
      <div className="flex flex-wrap gap-2">
        {job.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>
      <p className="mt-auto font-semibold text-primary">{job.salary}</p>
    </Link>
  );
};

export default FeaturedJobCard;
