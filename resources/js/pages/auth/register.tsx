import { Head, useForm } from '@inertiajs/react';
import { Dumbbell, Eye, EyeOff, LoaderCircle, Lock, Mail, Shield, User } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Create Account">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700,800" rel="stylesheet" />
            </Head>

            <div className="relative min-h-screen overflow-hidden bg-[#222831] text-[#f2f2f2]">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 right-10 h-32 w-32 animate-pulse rounded-full bg-[#f96d00] opacity-20 blur-3xl"></div>
                    <div className="absolute bottom-40 left-20 h-40 w-40 animate-pulse rounded-full bg-[#393e46] opacity-30 blur-3xl delay-1000"></div>
                    <div className="absolute top-1/3 right-1/4 h-24 w-24 animate-bounce rounded-full bg-[#f96d00] opacity-10 blur-2xl delay-500"></div>
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
                        {/* Register Card */}
                        <div className="rounded-2xl border border-[#393e46] bg-[#393e46]/50 p-8 backdrop-blur-sm">
                            <div className="mb-8 text-center">
                                <h1 className="mb-2 text-3xl font-bold text-white">Start Your Journey</h1>
                                <p className="text-[#f2f2f2] opacity-80">Create your account and begin leveling up</p>
                            </div>

                            <form className="space-y-6" onSubmit={submit}>
                                {/* Name Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="flex items-center space-x-2 font-medium text-[#f2f2f2]">
                                        <User className="h-4 w-4 text-[#f96d00]" />
                                        <span>Full name</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        disabled={processing}
                                        placeholder="Enter your full name"
                                        className="h-12 border-[#393e46] bg-[#222831] text-[#f2f2f2] transition-all placeholder:text-[#f2f2f2]/50 focus:border-[#f96d00] focus:ring-[#f96d00]/20"
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                {/* Email Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="flex items-center space-x-2 font-medium text-[#f2f2f2]">
                                        <Mail className="h-4 w-4 text-[#f96d00]" />
                                        <span>Email address</span>
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        tabIndex={2}
                                        autoComplete="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        disabled={processing}
                                        placeholder="email@example.com"
                                        className="h-12 border-[#393e46] bg-[#222831] text-[#f2f2f2] transition-all placeholder:text-[#f2f2f2]/50 focus:border-[#f96d00] focus:ring-[#f96d00]/20"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="flex items-center space-x-2 font-medium text-[#f2f2f2]">
                                        <Lock className="h-4 w-4 text-[#f96d00]" />
                                        <span>Password</span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            tabIndex={3}
                                            autoComplete="new-password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            disabled={processing}
                                            placeholder="Create a strong password"
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

                                {/* Password Confirmation Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation" className="flex items-center space-x-2 font-medium text-[#f2f2f2]">
                                        <Shield className="h-4 w-4 text-[#f96d00]" />
                                        <span>Confirm password</span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password_confirmation"
                                            type={showPasswordConfirmation ? 'text' : 'password'}
                                            required
                                            tabIndex={4}
                                            autoComplete="new-password"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            disabled={processing}
                                            placeholder="Confirm your password"
                                            className="h-12 border-[#393e46] bg-[#222831] pr-12 text-[#f2f2f2] transition-all placeholder:text-[#f2f2f2]/50 focus:border-[#f96d00] focus:ring-[#f96d00]/20"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#f2f2f2]/50 transition-colors hover:text-[#f96d00]"
                                        >
                                            {showPasswordConfirmation ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    <InputError message={errors.password_confirmation} />
                                </div>

                                {/* Register Button */}
                                <Button
                                    type="submit"
                                    className="mt-6 h-12 w-full transform rounded-xl bg-[#f96d00] text-base font-bold text-white transition-all hover:scale-105 hover:bg-[#f96d00]/90 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                                    tabIndex={5}
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <>
                                            <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                                            Creating account...
                                        </>
                                    ) : (
                                        'Create your account'
                                    )}
                                </Button>

                                {/* Login Link */}
                                <div className="border-t border-[#393e46] pt-4 text-center">
                                    <p className="text-sm text-[#f2f2f2] opacity-80">
                                        Already have an account?{' '}
                                        <TextLink
                                            href={route('login')}
                                            className="font-medium text-[#f96d00] transition-colors hover:text-[#f96d00]/80"
                                            tabIndex={6}
                                        >
                                            Sign in here
                                        </TextLink>
                                    </p>
                                </div>
                            </form>
                        </div>

                        {/* Footer */}
                        <div className="mt-8 text-center">
                            <p className="text-sm text-[#f2f2f2]/60">Join the fitness revolution and start earning XP! 🚀</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
