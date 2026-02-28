import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";

const HeroSection = () => {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set("q", keyword);
    if (location) params.set("location", location);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden bg-secondary py-20 md:py-28">
      <div className="container">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="space-y-8">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
                No.1 Job Board Platform
              </p>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
                Discover more than{" "}
                <span className="text-primary">5000+</span> Jobs
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Great platform for job seekers looking for new career heights and passionate about startups.
              </p>
            </div>

            <form onSubmit={handleSearch} className="flex flex-col gap-3 rounded-xl border bg-background p-3 shadow-lg sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-2 px-3">
                <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
                <Input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Job title or keyword"
                  className="border-0 p-0 shadow-none focus-visible:ring-0"
                />
              </div>
              <div className="hidden h-8 w-px bg-border sm:block" />
              <div className="flex flex-1 items-center gap-2 px-3">
                <MapPin className="h-5 w-5 shrink-0 text-muted-foreground" />
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location"
                  className="border-0 p-0 shadow-none focus-visible:ring-0"
                />
              </div>
              <Button type="submit" size="lg" className="shrink-0">
                Search
              </Button>
            </form>

            <p className="text-sm text-muted-foreground">
              Popular: <span className="font-medium text-foreground">UI Designer, UX Researcher, Android, Admin</span>
            </p>
          </div>

          <div className="hidden md:block">
            <div className="relative">
              <div className="aspect-square overflow-hidden rounded-3xl bg-primary/10">
                <img
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=600&fit=crop"
                  alt="Professional at work"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-4 -left-4 rounded-xl border bg-background p-4 shadow-lg">
                <p className="text-2xl font-bold text-primary">10k+</p>
                <p className="text-sm text-muted-foreground">People got hired</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
