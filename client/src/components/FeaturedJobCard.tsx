import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { Job } from "@/types/job";

const avatarUrl = (company: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(company)}&background=4540DB&color=fff&size=96`;

const FeaturedJobCard = ({ job }: { job: Job }) => {
  return (
    <Link
      to={`/jobs/${job.id}`}
      className="group flex min-w-[280px] flex-col gap-4 rounded-xl border bg-card p-6 transition-all hover:border-primary hover:shadow-md"
    >
      <div className="flex items-start gap-4">
        <img
          src={avatarUrl(job.company)}
          alt={job.company}
          className="h-12 w-12 rounded-lg border bg-background object-contain p-1"
        />
        <div className="flex-1 min-w-0">
          <h3 className="truncate font-semibold text-foreground group-hover:text-primary">
            {job.title}
          </h3>
          <p className="text-sm text-muted-foreground">{job.company}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4 shrink-0" />
        <span className="truncate">{job.location}</span>
      </div>
      <Badge variant="secondary" className="w-fit text-xs">{job.category}</Badge>
    </Link>
  );
};

export default FeaturedJobCard;
