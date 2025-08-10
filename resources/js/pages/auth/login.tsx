import { Head, useForm } from '@inertiajs/react';
import { Dumbbell, Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Log in">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700,800" rel="stylesheet" />
            </Head>

            <div className="relative min-h-screen overflow-hidden bg-[#222831] text-[#f2f2f2]">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 left-10 h-32 w-32 animate-pulse rounded-full bg-[#f96d00] opacity-20 blur-3xl"></div>
                    <div className="absolute right-20 bottom-40 h-40 w-40 animate-pulse rounded-full bg-[#393e46] opacity-30 blur-3xl delay-1000"></div>
                    <div className="absolute top-1/2 left-1/4 h-24 w-24 animate-bounce rounded-full bg-[#f96d00] opacity-10 blur-2xl delay-500"></div>
                </div>

                {/* Header */}
                <header className="relative z-10 flex items-center justify-between p-4 md:p-6">
                    <TextLink href={route('home')} className="flex items-center space-x-2 text-[#f2f2f2] transition-colors hover:text-[#f96d00]">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f96d00]">
                            <Dumbbell className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-bold text-[#f2f2f2]">Buhat-Buddy</span>
                    </TextLink>
                </header>

                {/* Main Content */}
                <div className="relative z-10 flex min-h-[calc(100vh-100px)] items-center justify-center px-4 py-8">
                    <div className="w-full max-w-md">
                        {/* Status Message */}
                        {status && (
                            <div className="mb-6 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-center">
                                <div className="text-sm font-medium text-green-400">{status}</div>
                            </div>
                        )}

                        {/* Login Card */}
                        <div className="rounded-2xl border border-[#393e46] bg-[#393e46]/50 p-8 backdrop-blur-sm">
                            <div className="mb-8 text-center">
                                <h1 className="mb-2 text-3xl font-bold text-white">Welcome Back</h1>
                                <p className="text-[#f2f2f2] opacity-80">Log in to continue your fitness journey</p>
                            </div>

                            <form className="space-y-6" onSubmit={submit}>
                                {/* Email Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="font-medium text-[#f2f2f2]">
                                        Email address
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="email@example.com"
                                        className="h-12 border-[#393e46] bg-[#222831] text-[#f2f2f2] transition-all placeholder:text-[#f2f2f2]/50 focus:border-[#f96d00] focus:ring-[#f96d00]/20"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password" className="font-medium text-[#f2f2f2]">
                                            Password
                                        </Label>
                                        {canResetPassword && (
                                            <TextLink
                                                href={route('password.request')}
                                                className="text-sm text-[#f96d00] transition-colors hover:text-[#f96d00]/80"
                                                tabIndex={5}
                                            >
                                                Forgot password?
                                            </TextLink>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            tabIndex={2}
                                            autoComplete="current-password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="Enter your password"
                                            className="h-12 border-[#393e46] bg-[#222831] pr-12 text-[#f2f2f2] transition-all placeholder:text-[#f2f2f2]/50 focus:border-[#f96d00] focus:ring-[#f96d00]/20"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#f2f2f2]/50 transition-colors hover:text-[#f96d00]"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    <InputError message={errors.password} />
                                </div>

                                {/* Remember Me */}
                                <div className="flex items-center space-x-3">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        checked={data.remember}
                                        onClick={() => setData('remember', !data.remember)}
                                        tabIndex={3}
                                        className="border-[#393e46] data-[state=checked]:border-[#f96d00] data-[state=checked]:bg-[#f96d00]"
                                    />
                                    <Label htmlFor="remember" className="cursor-pointer font-medium text-[#f2f2f2]">
                                        Remember me for 30 days
                                    </Label>
                                </div>

                                {/* Login Button */}
                                <Button
                                    type="submit"
                                    className="h-12 w-full transform rounded-xl bg-[#f96d00] text-base font-bold text-white transition-all hover:scale-105 hover:bg-[#f96d00]/90 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                                    tabIndex={4}
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <>
                                            <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                                            Logging in...
                                        </>
                                    ) : (
                                        'Log in to your account'
                                    )}
                                </Button>

                                {/* Sign Up Link */}
                                <div className="border-t border-[#393e46] pt-4 text-center">
                                    <p className="text-sm text-[#f2f2f2] opacity-80">
                                        Don't have an account?{' '}
                                        <TextLink
                                            href={route('register')}
                                            className="font-medium text-[#f96d00] transition-colors hover:text-[#f96d00]/80"
                                            tabIndex={6}
                                        >
                                            Create one now
                                        </TextLink>
                                    </p>
                                </div>
                            </form>
                        </div>

                        {/* Footer */}
                        <div className="mt-8 text-center">
                            <p className="text-sm text-[#f2f2f2]/60">Ready to level up your fitness game? 💪</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
