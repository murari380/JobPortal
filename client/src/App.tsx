import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Home from "@/pages/Home";
import Jobs from "@/pages/Jobs";
import JobDetails from "@/pages/JobDetails";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Logout from "@/pages/Logout";
import CompanyDashboard from "@/pages/dashboard/CompanyDashboard";
import CandidateDashboard from "@/pages/dashboard/CandidateDashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/jobs" component={Jobs} />
      <Route path="/jobs/:id" component={JobDetails} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/logout" component={Logout} />
      
      <Route path="/dashboard/company" component={CompanyDashboard} />
      <Route path="/dashboard/candidate" component={CandidateDashboard} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
