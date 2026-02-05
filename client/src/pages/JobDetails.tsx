import { useParams, Link } from "wouter";
import { useJob } from "@/hooks/use-jobs";
import { useUser } from "@/hooks/use-auth";
import { useApplyForJob } from "@/hooks/use-applications";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, MapPin, Building2, Banknote, Clock, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const applySchema = z.object({
  coverLetter: z.string().min(10, "Cover letter must be at least 10 characters"),
});

export default function JobDetails() {
  const { id } = useParams();
  const { data: job, isLoading } = useJob(Number(id));
  const { data: user } = useUser();
  const { mutate: apply, isPending } = useApplyForJob();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof applySchema>>({
    resolver: zodResolver(applySchema),
  });

  if (isLoading) return <div className="flex h-screen items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  if (!job) return <div className="flex h-screen items-center justify-center text-xl text-slate-500">Job not found</div>;

  const onSubmit = (data: z.infer<typeof applySchema>) => {
    apply({
      jobId: job.id,
      coverLetter: data.coverLetter,
    }, {
      onSuccess: () => {
        toast({ title: "Application Submitted", description: "Good luck! The company will review your application soon." });
        setOpen(false);
      },
      onError: (err) => {
        toast({ title: "Failed to submit", description: err.message, variant: "destructive" });
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white pt-12 pb-24">
        <div className="container mx-auto px-4">
          <Link href="/jobs" className="inline-flex items-center text-slate-400 hover:text-white transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Jobs
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div>
              <h1 className="font-display text-3xl md:text-5xl font-bold mb-4">{job.title}</h1>
              <div className="flex flex-wrap gap-6 text-slate-300">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  {job.company.name}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  {job.location}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  {job.type}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-3">
              <div className="text-xl font-bold text-primary flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700">
                <Banknote className="w-5 h-5" />
                {job.salaryRange}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
              <h2 className="text-xl font-bold font-display text-slate-900 mb-4">Job Description</h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{job.description}</p>
              
              <h2 className="text-xl font-bold font-display text-slate-900 mt-8 mb-4">Requirements</h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{job.requirements}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-4 text-slate-900">Interested in this role?</h3>
              
              {!user ? (
                <div className="space-y-4">
                  <p className="text-sm text-slate-500">You need to be logged in to apply for this position.</p>
                  <Link href={`/login`}>
                    <Button className="w-full">Log in to Apply</Button>
                  </Link>
                </div>
              ) : user.role === 'company' ? (
                <div className="p-4 bg-amber-50 text-amber-800 rounded-lg text-sm border border-amber-100">
                  Company accounts cannot apply to jobs.
                </div>
              ) : (
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full h-12 text-lg shadow-lg shadow-primary/20">Apply Now</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Apply for {job.title}</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        <FormField
                          control={form.control}
                          name="coverLetter"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cover Letter</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Explain why you're a good fit for this role..." 
                                  className="min-h-[200px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full" disabled={isPending}>
                          {isPending ? "Submitting..." : "Submit Application"}
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              )}
              
              <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                <div className="flex items-start gap-3 text-sm text-slate-600">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                  <span>Your profile will be shared with the employer</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-slate-600">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                  <span>Receive feedback directly in your dashboard</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
