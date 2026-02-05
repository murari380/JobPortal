import { useUser } from "@/hooks/use-auth";
import { useCandidateApplications } from "@/hooks/use-applications";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function CandidateDashboard() {
  const { data: user } = useUser();
  const { data: applications, isLoading } = useCandidateApplications();

  if (!user || user.role !== 'candidate') return <div className="p-8">Access Denied</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-slate-900">Candidate Dashboard</h1>
          <p className="text-slate-500">Track your job applications</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>My Applications</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2].map(i => <div key={i} className="h-24 bg-slate-100 rounded-lg animate-pulse" />)}
                </div>
              ) : applications?.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-500 mb-4">You haven't applied to any jobs yet.</p>
                  <Link href="/jobs">
                    <Button>Browse Jobs</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications?.map((app) => (
                    <div key={app.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 rounded-xl border border-slate-100 bg-white hover:border-primary/20 hover:shadow-md transition-all">
                      <div className="space-y-2 mb-4 md:mb-0">
                        <h3 className="font-bold text-lg text-slate-900">{app.job.title}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" /> {app.job.company.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {app.job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> Applied: {app.createdAt ? format(new Date(app.createdAt), 'MMM dd, yyyy') : 'N/A'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                         <Badge 
                           className="px-3 py-1 text-sm capitalize"
                           variant={
                             app.status === 'accepted' ? 'default' : 
                             app.status === 'rejected' ? 'destructive' : 
                             'secondary'
                           }
                         >
                           {app.status}
                         </Badge>
                         <Link href={`/jobs/${app.jobId}`}>
                           <Button variant="outline" size="sm">View Job</Button>
                         </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
