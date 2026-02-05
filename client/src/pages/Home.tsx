import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { useJobs } from "@/hooks/use-jobs";
import { JobCard } from "@/components/jobs/JobCard";
import { Link } from "wouter";
import { ArrowRight, Search, Briefcase, Users, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { data: jobs, isLoading } = useJobs();

  // Show only first 6 jobs
  const featuredJobs = jobs?.slice(0, 6);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pb-16 pt-24 md:pt-32 lg:pt-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent_40%)]" />
        <div className="container relative z-10 px-4 mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-primary uppercase bg-primary/10 rounded-full">
              #1 Job Portal in Nepal
            </span>
            <h1 className="max-w-4xl mx-auto font-display text-5xl font-bold tracking-tight text-slate-900 md:text-7xl">
              Elevate Your Career to <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                New Heights
              </span>
            </h1>
            <p className="max-w-2xl mx-auto mt-6 text-lg text-slate-600 md:text-xl leading-relaxed">
              Connect with top employers and discover opportunities that match your potential. 
              We bridge the gap between talent and success.
            </p>
            
            <div className="flex flex-col gap-4 mt-10 sm:flex-row justify-center">
              <Link href="/jobs">
                <Button size="lg" className="h-14 px-8 text-lg bg-primary hover:bg-blue-600 shadow-xl shadow-blue-500/20 rounded-xl">
                  Find a Job
                  <Search className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-2 rounded-xl">
                  Post a Job
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center justify-center gap-4 p-6 bg-slate-50 rounded-2xl">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-slate-900">1,500+</h3>
                <p className="text-sm text-slate-500">Live Jobs</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 p-6 bg-slate-50 rounded-2xl">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-slate-900">800+</h3>
                <p className="text-sm text-slate-500">Companies</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 p-6 bg-slate-50 rounded-2xl">
              <div className="p-3 bg-green-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-slate-900">12k+</h3>
                <p className="text-sm text-slate-500">Candidates Hired</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-display text-3xl font-bold text-slate-900">Featured Opportunities</h2>
              <p className="mt-2 text-slate-600">Hand-picked roles from top companies</p>
            </div>
            <Link href="/jobs">
              <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/5">
                View all jobs <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-slate-200 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredJobs?.map((job) => (
                <JobCard key={job.id} job={job} featured />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
