import { Link, useLocation } from "wouter";
import { useUser } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User as UserIcon, Building2, Briefcase } from "lucide-react";

export function Navbar() {
  const { data: user } = useUser();
  const [location] = useLocation();

  const isAuthPage = location === "/login" || location === "/register";
  if (isAuthPage) return null;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-slate-900">
            Elevate<span className="text-primary">.Work</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/jobs" className={`text-sm font-medium transition-colors hover:text-primary ${location === '/jobs' ? 'text-primary' : 'text-slate-600'}`}>
            Browse Jobs
          </Link>
          <Link href="/about" className="text-sm font-medium text-slate-600 transition-colors hover:text-primary">
            About Us
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link href={user.role === 'company' ? '/dashboard/company' : '/dashboard/candidate'}>
                <Button variant="ghost" className="hidden sm:flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border-2 border-primary/10">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary/5 text-primary font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-2 mb-2 border-b">
                    <p className="font-semibold text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                  </div>
                  <DropdownMenuItem asChild className="text-destructive cursor-pointer">
                    <Link href="/logout">
                      <LogOut className="w-4 h-4 mr-2" />
                      Log out
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-primary text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-0.5">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
