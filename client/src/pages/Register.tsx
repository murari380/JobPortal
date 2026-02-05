import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister } from "@/hooks/use-auth";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Building2, User, ArrowLeft } from "lucide-react";


const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["candidate", "company"]),
  bio: z.string().optional(),
});

export default function Register() {
  const [, setLocation] = useLocation();
  const { mutate: register, isPending } = useRegister();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "candidate",
      bio: "",
    },
  });

  const role = form.watch("role");

  const onSubmit = (data: z.infer<typeof registerSchema>) => {
    register(data, {
      onSuccess: (user) => {
        toast({ title: "Account created!", description: "Welcome to Elevate Workforce Solutions." });
        if (user.role === 'company') {
          setLocation("/dashboard/company");
        } else {
          setLocation("/dashboard/candidate");
        }
      },
      onError: (err) => {
        toast({ title: "Registration failed", description: err.message, variant: "destructive" });
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center text-sm text-slate-500 hover:text-primary mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>

        <Card className="border-none shadow-xl shadow-slate-200/50">
          <CardHeader className="space-y-1 text-center border-b bg-slate-50/50 rounded-t-xl pb-8">
            <CardTitle className="text-2xl font-bold">Create your account</CardTitle>
            <CardDescription>
              Join the fastest growing job network in Nepal
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>I am a...</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-2 gap-4"
                        >
                          <div>
                            <RadioGroupItem value="candidate" id="candidate" className="peer sr-only" />
                            <label
                              htmlFor="candidate"
                              className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-transparent p-4 hover:bg-slate-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                            >
                              <User className="mb-3 h-6 w-6 text-slate-600 peer-data-[state=checked]:text-primary" />
                              <span className="text-sm font-bold text-slate-900">Job Seeker</span>
                            </label>
                          </div>
                          <div>
                            <RadioGroupItem value="company" id="company" className="peer sr-only" />
                            <label
                              htmlFor="company"
                              className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-transparent p-4 hover:bg-slate-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                            >
                              <Building2 className="mb-3 h-6 w-6 text-slate-600 peer-data-[state=checked]:text-primary" />
                              <span className="text-sm font-bold text-slate-900">Company</span>
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{role === 'company' ? 'Company Name' : 'Full Name'}</FormLabel>
                        <FormControl>
                          <Input placeholder={role === 'company' ? 'Acme Corp' : 'John Doe'} {...field} className="h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" {...field} className="h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="unique_username" {...field} className="h-11" />
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
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} className="h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{role === 'company' ? 'Company Description' : 'Professional Summary'}</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder={role === 'company' ? 'Tell us about your company culture...' : 'Tell us about your skills and experience...'} 
                          {...field} 
                          className="min-h-[100px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full h-12 text-lg" disabled={isPending}>
                  {isPending ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="justify-center border-t p-6">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
