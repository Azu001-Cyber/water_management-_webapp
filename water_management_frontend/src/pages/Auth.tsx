import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Droplets, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form';
import { useToast } from '../hooks/use-toast';

    const loginSchema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    });

    const signupSchema = loginSchema.extend({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    confirmPassword: z.string(),
    }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
    });

    type LoginFormData = z.infer<typeof loginSchema>;
    type SignupFormData = z.infer<typeof signupSchema>;

    export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login, signup } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();

    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

    const loginForm = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    });

    const signupForm = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        defaultValues: { email: '', password: '', name: '', confirmPassword: '' },
    });

    const handleLogin = async (data: LoginFormData) => {
        setIsSubmitting(true);
        try {
        await login(data.email, data.password);
        toast({ title: 'Welcome back!', description: 'You have successfully logged in.' });
        navigate(from, { replace: true });
        } catch (error) {
        toast({
            title: 'Login failed',
            description: error instanceof Error ? error.message : 'Invalid credentials',
            variant: 'destructive',
        });
        } finally {
        setIsSubmitting(false);
        }
    };

    const handleSignup = async (data: SignupFormData) => {
        setIsSubmitting(true);
        try {
        await signup(data.email, data.password, data.name);
        toast({ title: 'Account created!', description: 'Welcome to Water Tracker.' });
        navigate(from, { replace: true });
        } catch (error) {
        toast({
            title: 'Signup failed',
            description: error instanceof Error ? error.message : 'Could not create account',
            variant: 'destructive',
        });
        } finally {
        setIsSubmitting(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        loginForm.reset();
        signupForm.reset();
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Droplets className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Water Tracker</CardTitle>
            <CardDescription>
                {isLogin ? 'Sign in to manage your water usage' : 'Create an account to get started'}
            </CardDescription>
            </CardHeader>
            <CardContent>
            {isLogin ? (
                <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                    <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="you@example.com"
                                className="pl-10"
                                {...field}
                            />
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="password"
                                placeholder="••••••••"
                                className="pl-10"
                                {...field}
                            />
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Signing in...' : 'Sign In'}
                    </Button>
                </form>
                </Form>
            ) : (
                <Form {...signupForm}>
                <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                    <FormField
                    control={signupForm.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Your name"
                                className="pl-10"
                                {...field}
                            />
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={signupForm.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="you@example.com"
                                className="pl-10"
                                {...field}
                            />
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={signupForm.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="password"
                                placeholder="••••••••"
                                className="pl-10"
                                {...field}
                            />
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={signupForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                            <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="password"
                                placeholder="••••••••"
                                className="pl-10"
                                {...field}
                            />
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating account...' : 'Create Account'}
                    </Button>
                </form>
                </Form>
            )}
            
            <div className="mt-6 text-center">
                <button
                type="button"
                onClick={toggleMode}
                className="text-sm text-primary hover:underline"
                >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                </button>
            </div>

            {isLogin && (
                <div className="mt-4 rounded-lg bg-muted p-3 text-center text-sm text-muted-foreground">
                <p>Demo credentials:</p>
                <p className="font-mono">demo@example.com / password123</p>
                </div>
            )}
            </CardContent>
        </Card>
        </div>
    );
}