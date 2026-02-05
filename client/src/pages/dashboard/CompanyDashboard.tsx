import { useState } from "react";
import { useUser } from "@/hooks/use-auth";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useJobs, useCreateJob, useDeleteJob } from "@/hooks/use-jobs";
import { useCompanyApplications, useUpdateApplicationStatus } from "@/hooks/use-applications";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, MapPin, DollarSign, Clock, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const jobSchema = z.object({
  title: z.string().min(3, "Title required"),
  location: z.string().min(2, "Location required"),
  type: z.string().min(1, "Type required"),
  salaryRange: z.string().min(1, "Salary required"),
  description: z.string().min(10, "Description required"),
  requirements: z.string().min(10, "Requirements required"),
});

export default function CompanyDashboard() {
  const { data: user } = useUser();
  const { data: jobs } = useJobs(); // In real app, filter by company ID or use specific hook
  const { data: applications } = useCompanyApplications();
  const { mutate: createJob, isPending: isCreating } = useCreateJob();
  const { mutate: deleteJob } = useDeleteJob();
  const { mutate: updateStatus } = useUpdateApplicationStatus();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  // Filter jobs for this company only - in a real app backend should do this
  const myJobs = jobs?.filter(job => job.companyId === user?.id);

  const form = useForm<z.infer<typeof jobSchema>>({
    resolver: zodResolver(jobSchema),
    defaultValues: { type: "Full-time" },
  });

  const onSubmit = (data: z.infer<typeof jobSchema>) => {
    createJob(data, {
      onSuccess: () => {
        toast({ title: "Job Posted", description: "Your job is now live." });
        setOpen(false);
        form.reset();
      },
    });
  };

  const handleStatusUpdate = (id: number, status: "accepted" | "rejected") => {
    updateStatus({ id, status }, {
      onSuccess: () => {
        toast({ 
          title: status === "accepted" ? "Candidate Accepted" : "Candidate Rejected", 
          variant: status === "accepted" ? "default" : "destructive" 
        });
      }
    });
  };

  if (!user || user.role !== 'company') return <div className="p-8">Access Denied</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900">Company Dashboard</h1>
            <p className="text-slate-500">Manage jobs and applications</p>
          </div>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-lg shadow-primary/20">
                <Plus className="w-4 h-4" /> Post New Job
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Post a New Job Opportunity</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Title</FormLabel>
                          <FormControl><Input placeholder="Senior Developer" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl><Input placeholder="Kathmandu, Remote" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Full-time">Full-time</SelectItem>
                              <SelectItem value="Part-time">Part-time</SelectItem>
                              <SelectItem value="Contract">Contract</SelectItem>
                              <SelectItem value="Freelance">Freelance</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="salaryRange"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Salary Range</FormLabel>
                          <FormControl><Input placeholder="e.g. 50k - 80k NPR" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl><Textarea placeholder="Job details..." className="h-24" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="requirements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Requirements</FormLabel>
                        <FormControl><Textarea placeholder="Skills needed..." className="h-24" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isCreating}>
                    {isCreating ? "Posting..." : "Post Job"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="jobs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px] bg-white border border-slate-200">
            <TabsTrigger value="jobs">Active Jobs</TabsTrigger>
            <TabsTrigger value="applications">Applications ({applications?.length || 0})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="jobs" className="space-y-4">
            {myJobs?.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed">
                <p className="text-slate-500">No active jobs posted yet.</p>
              </div>
            ) : (
              myJobs?.map(job => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-bold text-slate-900">{job.title}</CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => deleteJob(job.id)} className="text-destructive hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 text-sm text-slate-500 mb-4">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                      <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {job.salaryRange}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {job.type}</span>
                    </div>
                    <div className="text-sm text-slate-600 line-clamp-2">{job.description}</div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="applications" className="space-y-4">
            {applications?.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed">
                <p className="text-slate-500">No applications received yet.</p>
              </div>
            ) : (
              applications?.map(app => (
                <Card key={app.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-lg text-slate-900">{app.candidate.name}</h3>
                          <Badge variant={app.status === 'accepted' ? 'default' : app.status === 'rejected' ? 'destructive' : 'secondary'}>
                            {app.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-500">Applying for: <span className="font-semibold text-primary">{app.job.title}</span></p>
                        <p className="text-sm text-slate-600 mt-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                          "{app.coverLetter}"
                        </p>
                        <p className="text-xs text-slate-400 mt-1">Applied on {app.createdAt ? format(new Date(app.createdAt), 'PP') : 'N/A'}</p>
                      </div>
                      
                      {app.status === 'pending' && (
                        <div className="flex gap-2 items-start">
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleStatusUpdate(app.id, 'accepted')}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" /> Accept
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleStatusUpdate(app.id, 'rejected')}
                          >
                            <XCircle className="w-4 h-4 mr-2" /> Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
