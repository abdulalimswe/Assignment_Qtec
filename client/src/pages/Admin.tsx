import { useState } from "react";
import { useJobsQuery, useCreateJobMutation, useDeleteJobMutation } from "@/hooks/useJobQueries";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2 } from "lucide-react";
import { categories } from "@/data/jobs";
import { Job, JobCategory } from "@/types/job";
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const jobSchema = z.object({
  title:       z.string().trim().min(1, "Title is required").max(100),
  company:     z.string().trim().min(1, "Company is required").max(100),
  location:    z.string().trim().min(1, "Location is required").max(100),
  description: z.string().trim().min(1, "Description is required").max(5000),
});

type JobForm = z.infer<typeof jobSchema>;

const Admin = () => {
  const { data, isLoading } = useJobsQuery({ limit: 100 });
  const createJob = useCreateJobMutation();
  const deleteJob = useDeleteJobMutation();
  const { toast } = useToast();

  const [showForm,    setShowForm]    = useState(false);
  const [jobCategory, setJobCategory] = useState<JobCategory>("Technology");

  const { register, handleSubmit, formState: { errors }, reset } = useForm<JobForm>({
    resolver: zodResolver(jobSchema),
  });

  const jobs = data?.data ?? [];

  const onSubmit = async (data: JobForm) => {
    try {
      await createJob.mutateAsync({
        title:       data.title,
        company:     data.company,
        location:    data.location,
        category:    jobCategory,
        description: data.description,
      });
      toast({ title: "Job Created", description: `"${data.title}" has been posted.` });
      reset();
      setShowForm(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create job";
      sonnerToast.error(msg);
    }
  };

  const handleDelete = async (job: Job) => {
    try {
      await deleteJob.mutateAsync(job.id);
      toast({ title: "Job Deleted", description: `"${job.title}" has been removed.` });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete job";
      sonnerToast.error(msg);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-10">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
              <p className="text-muted-foreground">Manage job listings</p>
            </div>
            <Button onClick={() => setShowForm(!showForm)}>
              <Plus className="mr-2 h-4 w-4" /> Add Job
            </Button>
          </div>

          {/* Add Job Form */}
          {showForm && (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mb-10 space-y-4 rounded-xl border bg-card p-6"
            >
              <h2 className="text-xl font-bold">New Job Listing</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input {...register("title")} placeholder="Senior Developer" />
                  {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Company *</Label>
                  <Input {...register("company")} placeholder="Acme Inc" />
                  {errors.company && <p className="text-sm text-destructive">{errors.company.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Location *</Label>
                  <Input {...register("location")} placeholder="Remote" />
                  {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={jobCategory}
                    onValueChange={(v) => setJobCategory(v as JobCategory)}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description *</Label>
                <Textarea
                  {...register("description")}
                  placeholder="Job description..."
                  rows={4}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>
              <div className="flex gap-3">
                <Button type="submit" disabled={createJob.isPending}>
                  {createJob.isPending ? "Posting…" : "Create Job"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { setShowForm(false); reset(); }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {/* Jobs Table */}
          <div className="rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead className="hidden sm:table-cell">Company</TableHead>
                  <TableHead className="hidden md:table-cell">Location</TableHead>
                  <TableHead className="hidden lg:table-cell">Category</TableHead>
                  <TableHead className="hidden lg:table-cell">Posted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        {Array.from({ length: 6 }).map((__, j) => (
                          <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                        ))}
                      </TableRow>
                    ))
                  : jobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">{job.title}</TableCell>
                        <TableCell className="hidden sm:table-cell">{job.company}</TableCell>
                        <TableCell className="hidden md:table-cell">{job.location}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <Badge variant="secondary">{job.category}</Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {new Date(job.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Job</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{job.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(job)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
