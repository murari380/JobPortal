import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "@/hooks/use-auth";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Building2, ArrowLeft } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
  const [, setLocation] = useLocation();
  const { mutate: login, isPending } = useLogin();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    login(data, {
      onSuccess: (user) => {
        toast({ title: "Welcome back!", description: `Logged in as ${user.username}` });
        if (user.role === 'company') {
          setLocation("/dashboard/company");
        } else {
          setLocation("/dashboard/candidate");
        }
      },
      onError: (err) => {
        toast({ title: "Login failed", description: err.message, variant: "destructive" });
      },
    });
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Panel - Hero */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.2),transparent_60%)]" />
        <Link href="/" className="relative z-10 flex items-center gap-2 text-white/80 hover:text-white transition-colors">
          <Building2 className="w-6 h-6" />
          <span className="font-display font-bold text-xl">Elevate.Work</span>
        </Link>
        
        <div className="relative z-10 max-w-lg">
          <h2 className="font-display text-4xl font-bold mb-6">Find your dream team or your dream job.</h2>
          <p className="text-slate-400 text-lg">Join thousands of companies and candidates who are building the future together.</p>
        </div>
        
        <div className="relative z-10 text-sm text-slate-500">
          © 2024 Elevate Workforce Solutions
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center text-sm text-slate-500 hover:text-primary mb-8 lg:hidden">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Link>
          
          <Card className="border-none shadow-xl shadow-slate-200/50">
            <CardHeader className="space-y-1 pb-8">
              <CardTitle className="text-2xl font-bold text-center">Sign in to your account</CardTitle>
              <CardDescription className="text-center">
                Enter your details to access your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter username" {...field} className="h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center">
                          <FormLabel>Password</FormLabel>
                          <span className="text-xs text-primary cursor-pointer hover:underline">Forgot password?</span>
                        </div>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} className="h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full h-11 mt-2" disabled={isPending}>
                    {isPending ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-center border-t p-6">
              <p className="text-sm text-slate-500">
                Don't have an account?{" "}
                <Link href="/register" className="text-primary font-semibold hover:underline">
                  Create an account
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
