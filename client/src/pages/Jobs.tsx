import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { useJobs } from "@/hooks/use-jobs";
import { JobCard } from "@/components/jobs/JobCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Briefcase } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Jobs() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  
  // Debounce search could be added here for better performance
  const { data: jobs, isLoading } = useJobs({ search, location, type });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Search Header */}
      <div className="bg-white border-b border-slate-200 pt-16 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl font-bold text-slate-900 mb-8">Browse Jobs</h1>
          
          <div className="p-4 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <Input 
                placeholder="Job title or keywords" 
                className="pl-10 h-11 border-slate-200" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <Input 
                placeholder="Location" 
                className="pl-10 h-11 border-slate-200" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="relative">
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="h-11 border-slate-200 pl-10 relative">
                   <Briefcase className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="h-11 w-full bg-primary hover:bg-blue-600">
              Search Jobs
            </Button>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            <p className="mt-4 text-slate-500">Finding opportunities...</p>
          </div>
        ) : jobs?.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <div className="p-4 bg-slate-50 rounded-full w-fit mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No jobs found</h3>
            <p className="text-slate-500 mt-2">Try adjusting your search filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs?.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
