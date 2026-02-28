import { useParams, Link } from "react-router-dom";
import { useJobQuery, useSubmitApplicationMutation } from "@/hooks/useJobQueries";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Briefcase, Calendar, ArrowLeft, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";

const applicationSchema = z.object({
  name:       z.string().trim().min(1, "Name is required").max(100),
  email:      z.string().trim().email("Invalid email address").max(255),
  resumeLink: z.string().trim().url("Must be a valid URL (https://...)").max(500),
  coverNote:  z.string().trim().max(2000).optional(),
});

type ApplicationForm = z.infer<typeof applicationSchema>;

const avatarUrl = (company: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(company)}&background=4540DB&color=fff&size=128`;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const numericId = parseInt(id ?? "0", 10);

  const { data, isLoading, isError } = useJobQuery(numericId);
  const submitApplication = useSubmitApplicationMutation();
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ApplicationForm>({
    resolver: zodResolver(applicationSchema),
  });

  const onSubmit = async (formData: ApplicationForm) => {
    try {
      await submitApplication.mutateAsync({
        jobId:      numericId,
        name:       formData.name,
        email:      formData.email,
        resumeLink: formData.resumeLink,
        coverNote:  formData.coverNote,
      });
      toast({
        title:       "Application Submitted!",
        description: `Thanks ${formData.name}, your application has been received.`,
      });
      reset();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Submission failed";
      sonnerToast.error(msg);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <section className="bg-secondary py-10">
            <div className="container space-y-4">
              <Skeleton className="h-8 w-48" />
              <div className="flex gap-4">
                <Skeleton className="h-16 w-16 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-64" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  // Error / not found state
  if (isError || !data?.data) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
            <h1 className="text-2xl font-bold">Job not found</h1>
            <Button asChild className="mt-4"><Link to="/jobs">Browse Jobs</Link></Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const job = data.data;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Job header */}
        <section className="bg-secondary py-10">
          <div className="container">
            <Button variant="ghost" size="sm" asChild className="mb-4">
              <Link to="/jobs"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs</Link>
            </Button>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <img
                  src={avatarUrl(job.company)}
                  alt={job.company}
                  className="h-16 w-16 rounded-xl border bg-background object-contain p-2"
                />
                <div>
                  <h1 className="text-2xl font-bold text-foreground md:text-3xl">{job.title}</h1>
                  <p className="mt-1 text-lg text-muted-foreground">{job.company}</p>
                  <div className="mt-3">
                    <Badge variant="secondary">{job.category}</Badge>
                  </div>
                </div>
              </div>
              <a href="#apply">
                <Button size="lg">Apply Now</Button>
              </a>
            </div>
          </div>
        </section>

        <div className="container grid gap-10 py-10 lg:grid-cols-3">
          {/* Description */}
          <div className="space-y-8 lg:col-span-2">
            <div>
              <h2 className="mb-4 text-xl font-bold text-foreground">Job Description</h2>
              <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">{job.description}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-xl border bg-card p-6">
              <h3 className="mb-4 font-bold text-foreground">Job Overview</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium text-foreground">{job.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium text-foreground">{job.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Posted</p>
                    <p className="font-medium text-foreground">{formatDate(job.created_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Apply Form */}
        <section id="apply" className="border-t bg-secondary py-16">
          <div className="container max-w-2xl">
            <h2 className="mb-8 text-center text-2xl font-bold text-foreground">Apply for this Job</h2>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5 rounded-xl border bg-card p-8"
            >
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" {...register("name")} placeholder="John Doe" />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" {...register("email")} placeholder="john@example.com" />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="resumeLink">Resume URL *</Label>
                <Input
                  id="resumeLink"
                  {...register("resumeLink")}
                  placeholder="https://drive.google.com/your-resume"
                />
                {errors.resumeLink && (
                  <p className="text-sm text-destructive">{errors.resumeLink.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="coverNote">Cover Note</Label>
                <Textarea
                  id="coverNote"
                  {...register("coverNote")}
                  placeholder="Tell us why you're a great fit..."
                  rows={4}
                />
                {errors.coverNote && (
                  <p className="text-sm text-destructive">{errors.coverNote.message}</p>
                )}
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={submitApplication.isPending}
              >
                {submitApplication.isPending ? "Submitting…" : "Submit Application"}
              </Button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default JobDetail;
