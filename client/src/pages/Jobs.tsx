import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, MapPin, AlertCircle } from "lucide-react";
import { useJobsQuery } from "@/hooks/useJobQueries";
import { categories } from "@/data/jobs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const avatarUrl = (company: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(company)}&background=4540DB&color=fff&size=80`;

const JOBS_PER_PAGE = 8;

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [keyword,  setKeyword]  = useState(searchParams.get("q") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [page,     setPage]     = useState(1);

  // Build API query from current state
  const { data, isLoading, isError } = useJobsQuery({
    search:   keyword   || undefined,
    category: category !== "all" ? category : undefined,
    location: location  || undefined,
    page,
    limit: JOBS_PER_PAGE,
  });

  const jobs  = data?.data  ?? [];
  const total = data?.total ?? 0;
  const pages = data?.pages ?? 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    const params = new URLSearchParams();
    if (keyword)           params.set("q",        keyword);
    if (location)          params.set("location",  location);
    if (category !== "all") params.set("category", category);
    setSearchParams(params);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Search header */}
        <section className="bg-secondary py-10">
          <div className="container">
            <h1 className="mb-6 text-3xl font-bold text-foreground">Browse Jobs</h1>
            <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
              <div className="flex flex-1 items-center gap-2 rounded-lg border bg-background px-3">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Job title or keyword"
                  className="border-0 shadow-none focus-visible:ring-0"
                />
              </div>
              <div className="flex flex-1 items-center gap-2 rounded-lg border bg-background px-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location"
                  className="border-0 shadow-none focus-visible:ring-0"
                />
              </div>
              <Select value={category} onValueChange={(v) => { setCategory(v); setPage(1); }}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="submit">Search</Button>
            </form>
          </div>
        </section>

        {/* Results */}
        <section className="py-10">
          <div className="container">
            {/* Error state */}
            {isError && (
              <div className="mb-6 flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-destructive">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p>Failed to load jobs. Please check your connection and try again.</p>
              </div>
            )}

            <p className="mb-6 text-sm text-muted-foreground">
              {isLoading ? "Loading..." : (
                <>Showing <span className="font-semibold text-foreground">{total}</span> results</>
              )}
            </p>

            {/* Loading skeletons */}
            {isLoading && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: JOBS_PER_PAGE }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-4 rounded-xl border bg-card p-5">
                    <div className="flex items-start gap-3">
                      <Skeleton className="h-10 w-10 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                ))}
              </div>
            )}

            {/* Job cards */}
            {!isLoading && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {jobs.map((job) => (
                  <Link
                    key={job.id}
                    to={`/jobs/${job.id}`}
                    className="group flex flex-col gap-4 rounded-xl border bg-card p-5 transition-all hover:border-primary hover:shadow-md"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={avatarUrl(job.company)}
                        alt={job.company}
                        className="h-10 w-10 rounded-lg border bg-background object-contain p-1"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground group-hover:text-primary">{job.title}</h3>
                        <p className="text-sm text-muted-foreground">{job.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" /> {job.location}
                    </div>
                    <Badge variant="secondary" className="w-fit text-xs">{job.category}</Badge>
                  </Link>
                ))}
              </div>
            )}

            {!isLoading && jobs.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-lg text-muted-foreground">No jobs found matching your criteria.</p>
              </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <div className="mt-10 flex justify-center gap-2">
                {Array.from({ length: pages }, (_, i) => (
                  <Button
                    key={i}
                    variant={page === i + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Jobs;
