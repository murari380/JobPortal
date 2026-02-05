import { type Job } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { MapPin, Banknote, Clock, Building } from "lucide-react";
import { Link } from "wouter";

interface JobCardProps {
  job: Job & { company: { name: string } };
  featured?: boolean;
}

export function JobCard({ job, featured = false }: JobCardProps) {
  return (
    <Card className={`group relative overflow-hidden transition-all duration-300 border-border/50 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 ${featured ? 'bg-gradient-to-br from-white to-blue-50/50 border-primary/20' : 'bg-white'}`}>
      {featured && (
        <div className="absolute top-0 right-0 px-3 py-1 bg-primary text-xs font-bold text-white rounded-bl-xl z-10">
          Featured
        </div>
      )}
      
      <CardHeader className="p-6 pb-2">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <h3 className="font-display font-bold text-lg md:text-xl text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
              {job.title}
            </h3>
            <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
              <Building className="w-4 h-4 text-primary/60" />
              {job.company.name}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 py-4">
        <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400" />
            {job.location}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            {job.type}
          </div>
          <div className="flex items-center gap-2 col-span-2">
            <Banknote className="w-4 h-4 text-slate-400" />
            <span className="font-medium text-slate-900">{job.salaryRange}</span>
          </div>
        </div>
        
        <p className="mt-4 text-sm text-slate-500 line-clamp-2">
          {job.description}
        </p>
      </CardContent>

      <CardFooter className="p-6 pt-2">
        <Link href={`/jobs/${job.id}`} className="w-full">
          <Button className="w-full bg-slate-900 text-white hover:bg-primary transition-all duration-300">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
