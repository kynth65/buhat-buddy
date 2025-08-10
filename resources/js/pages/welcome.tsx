import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Calendar, Dumbbell, LogIn, Menu, Star, Target, TrendingUp, Trophy, UserPlus, X, Zap } from 'lucide-react';
import { useState } from 'react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <Head title="Welcome to Buhat-Buddy">
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

                {/* Main Content */}
                <div className="relative z-10 pb-32 md:pb-20">
                    {/* Header */}
                    <header className="flex items-center justify-between p-4 md:p-6">
                        <div className="flex items-center space-x-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f96d00]">
                                <Dumbbell className="h-5 w-5 text-white" />
                            </div>
                            <span className="hidden text-sm text-[#f2f2f2] opacity-75 sm:block">Available for workouts</span>
                        </div>

                        <div className="text-right">
                            <div className="text-sm font-medium text-[#f2f2f2]">2:42 PM</div>
                            <div className="text-xs text-[#f96d00]">(GMT+7)</div>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:block">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="hover:bg-opacity-90 rounded-lg bg-[#f96d00] px-4 py-2 font-medium text-white transition-all"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <div className="flex space-x-3">
                                    <Link
                                        href={route('login')}
                                        className="rounded-lg border border-[#393e46] px-4 py-2 text-sm font-medium text-[#f2f2f2] transition-all hover:border-[#f96d00] hover:text-[#f96d00]"
                                    >
                                        Log In
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="hover:bg-opacity-90 rounded-lg bg-[#f96d00] px-4 py-2 text-sm font-medium text-white transition-all"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button onClick={() => setMobileMenuOpen(true)} className="text-[#f2f2f2] transition-colors hover:text-[#f96d00]">
                                <Menu className="h-6 w-6" />
                            </button>
                        </div>
                    </header>

                    {/* Hero Section */}
                    <section className="flex min-h-[80vh] items-center justify-center px-4 md:px-6">
                        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
                            {/* Left Content */}
                            <div className="space-y-6 md:space-y-8">
                                <div className="space-y-4 md:space-y-6">
                                    <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl lg:text-8xl">
                                        BUHAT
                                        <br />
                                        <span className="text-[#f96d00]">BUDDY</span>
                                    </h1>

                                    <div className="space-y-3 md:space-y-4">
                                        <h2 className="text-xl font-bold text-[#f2f2f2] sm:text-2xl md:text-3xl lg:text-4xl">
                                            Beyond Limits.
                                            <br />
                                            Built with
                                            <br />
                                            <span className="text-[#f96d00]">Determination.</span>
                                        </h2>

                                        <p className="max-w-md text-base leading-relaxed text-[#f2f2f2] opacity-80 md:text-lg">
                                            We build consistency, track progress, and level up your fitness journey with
                                            <span className="font-medium text-[#f96d00]"> gamified workouts</span>,
                                            <span className="font-medium text-[#f96d00]"> XP rewards</span>, and
                                            <span className="font-medium text-[#f96d00]"> personalized plans</span>.
                                        </p>
                                    </div>
                                </div>

                                {/* Feature Pills */}
                                <div className="flex flex-wrap gap-2 md:gap-3">
                                    <div className="flex items-center space-x-2 rounded-full bg-[#393e46] px-3 py-2 md:px-4">
                                        <Calendar className="h-3 w-3 text-[#f96d00] md:h-4 md:w-4" />
                                        <span className="text-xs font-medium md:text-sm">Calendar Tracking</span>
                                    </div>
                                    <div className="flex items-center space-x-2 rounded-full bg-[#393e46] px-3 py-2 md:px-4">
                                        <Zap className="h-3 w-3 text-[#f96d00] md:h-4 md:w-4" />
                                        <span className="text-xs font-medium md:text-sm">XP System</span>
                                    </div>
                                    <div className="flex items-center space-x-2 rounded-full bg-[#393e46] px-3 py-2 md:px-4">
                                        <Trophy className="h-3 w-3 text-[#f96d00] md:h-4 md:w-4" />
                                        <span className="text-xs font-medium md:text-sm">Level Up</span>
                                    </div>
                                </div>

                                {/* CTA Button */}
                                {!auth.user && (
                                    <div className="space-y-4">
                                        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                                            <Link
                                                href={route('register')}
                                                className="hover:bg-opacity-90 transform rounded-lg bg-[#f96d00] px-6 py-3 text-center text-base font-bold text-white transition-all hover:scale-105 md:px-8 md:py-4 md:text-lg"
                                            >
                                                Start Your Journey
                                            </Link>
                                            <Link
                                                href={route('login')}
                                                className="rounded-lg border-2 border-[#393e46] px-6 py-3 text-center text-base font-medium text-[#f2f2f2] transition-all hover:border-[#f96d00] hover:text-[#f96d00] md:px-8 md:py-4 md:text-lg"
                                            >
                                                Log In
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Content - Visual Element */}
                            <div className="relative">
                                <div className="relative h-80 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#393e46] via-[#222831] to-[#f96d00] p-1 md:h-96 lg:h-[500px]">
                                    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-[#222831]">
                                        {/* Simulated App Interface */}
                                        <div className="absolute inset-3 space-y-3 md:inset-4 md:space-y-4">
                                            {/* Calendar Grid Preview */}
                                            <div className="space-y-2 rounded-xl bg-[#393e46] p-3 md:space-y-3 md:p-4">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-sm font-bold text-white md:text-base">Your Progress</h3>
                                                    <span className="text-xs font-medium text-[#f96d00] md:text-sm">Level 8</span>
                                                </div>
                                                <div className="grid grid-cols-7 gap-1">
                                                    {Array.from({ length: 21 }, (_, i) => (
                                                        <div
                                                            key={i}
                                                            className={`h-4 w-4 rounded md:h-6 md:w-6 ${
                                                                i % 3 === 0
                                                                    ? 'bg-[#f96d00]'
                                                                    : i % 5 === 0
                                                                      ? 'bg-[#f96d00] opacity-60'
                                                                      : 'bg-[#222831]'
                                                            }`}
                                                        ></div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* XP Bar */}
                                            <div className="rounded-xl bg-[#393e46] p-3 md:p-4">
                                                <div className="mb-2 flex items-center justify-between">
                                                    <span className="text-sm font-medium text-white md:text-base">XP Progress</span>
                                                    <span className="text-sm font-bold text-[#f96d00] md:text-base">750/1000</span>
                                                </div>
                                                <div className="h-2 w-full rounded-full bg-[#222831] md:h-3">
                                                    <div
                                                        className="h-2 rounded-full bg-gradient-to-r from-[#f96d00] to-orange-400 md:h-3"
                                                        style={{ width: '75%' }}
                                                    ></div>
                                                </div>
                                            </div>

                                            {/* Weekly Plan Preview */}
                                            <div className="space-y-2 rounded-xl bg-[#393e46] p-3 md:p-4">
                                                <h4 className="text-xs font-bold text-white md:text-sm">This Week</h4>
                                                <div className="space-y-1">
                                                    <div className="flex justify-between">
                                                        <span className="text-xs text-[#f2f2f2] md:text-sm">Monday</span>
                                                        <span className="text-xs text-[#f96d00] md:text-sm">Chest & Arms</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-xs text-[#f2f2f2] md:text-sm">Wednesday</span>
                                                        <span className="text-xs text-[#f96d00] md:text-sm">Leg Day</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-xs text-[#f2f2f2] md:text-sm">Friday</span>
                                                        <span className="text-xs text-[#f96d00] md:text-sm">Back & Core</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Floating Elements */}
                                        <div className="absolute top-4 right-4 flex h-8 w-8 animate-bounce items-center justify-center rounded-full bg-[#f96d00] md:top-8 md:right-8 md:h-12 md:w-12">
                                            <Trophy className="h-4 w-4 text-white md:h-6 md:w-6" />
                                        </div>

                                        <div className="absolute bottom-4 left-4 h-6 w-6 animate-pulse rounded-full bg-gradient-to-r from-[#f96d00] to-orange-400 md:bottom-8 md:left-8 md:h-10 md:w-10"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Features Section */}
                    <section className="px-4 py-16 md:px-6 md:py-24">
                        <div className="mx-auto max-w-7xl">
                            <div className="mb-12 text-center md:mb-16">
                                <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                                    Why Choose <span className="text-[#f96d00]">Buhat-Buddy?</span>
                                </h2>
                                <p className="mx-auto max-w-3xl text-lg text-[#f2f2f2] opacity-80">
                                    Experience the perfect blend of fitness tracking and gaming that keeps you motivated every step of the way.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
                                <div className="rounded-xl bg-[#393e46] p-6 transition-transform hover:scale-105 md:p-8">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f96d00]">
                                        <Calendar className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="mb-3 text-xl font-bold text-white">Smart Calendar</h3>
                                    <p className="text-[#f2f2f2] opacity-80">
                                        Track your workouts and rest days with our intuitive calendar system that visualizes your progress.
                                    </p>
                                </div>

                                <div className="rounded-xl bg-[#393e46] p-6 transition-transform hover:scale-105 md:p-8">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f96d00]">
                                        <Zap className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="mb-3 text-xl font-bold text-white">XP Rewards</h3>
                                    <p className="text-[#f2f2f2] opacity-80">
                                        Earn XP for every workout, with bonus points for leg days. Level up and unlock new achievements!
                                    </p>
                                </div>

                                <div className="rounded-xl bg-[#393e46] p-6 transition-transform hover:scale-105 md:p-8">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f96d00]">
                                        <Target className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="mb-3 text-xl font-bold text-white">Custom Plans</h3>
                                    <p className="text-[#f2f2f2] opacity-80">
                                        Create personalized weekly workout plans that fit your schedule and fitness goals.
                                    </p>
                                </div>

                                <div className="rounded-xl bg-[#393e46] p-6 transition-transform hover:scale-105 md:p-8">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f96d00]">
                                        <Trophy className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="mb-3 text-xl font-bold text-white">Level System</h3>
                                    <p className="text-[#f2f2f2] opacity-80">
                                        Progress from Novice to God Mode as you build consistency and reach new milestones.
                                    </p>
                                </div>

                                <div className="rounded-xl bg-[#393e46] p-6 transition-transform hover:scale-105 md:p-8">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f96d00]">
                                        <TrendingUp className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="mb-3 text-xl font-bold text-white">Progress Analytics</h3>
                                    <p className="text-[#f2f2f2] opacity-80">
                                        Track your most active days, workout streaks, and detailed fitness statistics.
                                    </p>
                                </div>

                                <div className="rounded-xl bg-[#393e46] p-6 transition-transform hover:scale-105 md:p-8">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f96d00]">
                                        <Star className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="mb-3 text-xl font-bold text-white">Achievements</h3>
                                    <p className="text-[#f2f2f2] opacity-80">
                                        Unlock titles and badges as you reach new fitness milestones and maintain consistency.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Stats Section */}
                    <section className="bg-[#393e46]/30 px-4 py-16 md:px-6 md:py-24">
                        <div className="mx-auto max-w-7xl text-center">
                            <h2 className="mb-12 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                                Join the <span className="text-[#f96d00]">Fitness Revolution</span>
                            </h2>

                            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                                <div className="space-y-2">
                                    <div className="text-3xl font-black text-[#f96d00] md:text-4xl lg:text-5xl">10K+</div>
                                    <div className="text-sm text-[#f2f2f2] opacity-80 md:text-base">Workouts Logged</div>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-3xl font-black text-[#f96d00] md:text-4xl lg:text-5xl">500+</div>
                                    <div className="text-sm text-[#f2f2f2] opacity-80 md:text-base">Active Users</div>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-3xl font-black text-[#f96d00] md:text-4xl lg:text-5xl">95%</div>
                                    <div className="text-sm text-[#f2f2f2] opacity-80 md:text-base">Success Rate</div>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-3xl font-black text-[#f96d00] md:text-4xl lg:text-5xl">30</div>
                                    <div className="text-sm text-[#f2f2f2] opacity-80 md:text-base">Day Avg Streak</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="px-4 py-16 md:px-6 md:py-24">
                        <div className="mx-auto max-w-4xl text-center">
                            <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                                Ready to Level Up Your <span className="text-[#f96d00]">Fitness Game?</span>
                            </h2>
                            <p className="mx-auto mb-8 max-w-2xl text-lg text-[#f2f2f2] opacity-80">
                                Join thousands of users who are already transforming their fitness journey with our gamified approach to working out.
                            </p>

                            {!auth.user && (
                                <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-6">
                                    <Link
                                        href={route('register')}
                                        className="hover:bg-opacity-90 transform rounded-xl bg-[#f96d00] px-8 py-4 text-lg font-bold text-white transition-all hover:scale-105"
                                    >
                                        Get Started Free
                                    </Link>
                                    <Link
                                        href={route('login')}
                                        className="rounded-xl border-2 border-[#393e46] px-8 py-4 text-lg font-medium text-[#f2f2f2] transition-all hover:border-[#f96d00] hover:text-[#f96d00]"
                                    >
                                        Sign In
                                    </Link>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Mobile Floating Navigation */}
                {!auth.user && (
                    <div className="fixed right-4 bottom-6 left-4 z-50 md:hidden">
                        <div className="flex items-center justify-center space-x-3 rounded-2xl border border-[#f96d00]/20 bg-[#393e46]/95 p-4 shadow-2xl backdrop-blur-md">
                            <Link
                                href={route('login')}
                                className="flex flex-1 items-center justify-center space-x-2 rounded-xl bg-[#222831] px-4 py-3 text-white transition-all hover:bg-[#f96d00]"
                            >
                                <LogIn className="h-4 w-4" />
                                <span className="text-sm font-medium">Log In</span>
                            </Link>
                            <Link
                                href={route('register')}
                                className="hover:bg-opacity-90 flex flex-1 items-center justify-center space-x-2 rounded-xl bg-[#f96d00] px-4 py-3 text-white transition-all"
                            >
                                <UserPlus className="h-4 w-4" />
                                <span className="text-sm font-medium">Sign Up</span>
                            </Link>
                        </div>
                    </div>
                )}

                {/* Mobile Menu Overlay */}
                {mobileMenuOpen && (
                    <div className="fixed inset-0 z-50 md:hidden">
                        <div className="absolute inset-0 bg-black/60" onClick={() => setMobileMenuOpen(false)}></div>
                        <div className="absolute top-0 right-0 h-full w-80 bg-[#222831] p-6 shadow-2xl">
                            <div className="mb-8 flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f96d00]">
                                        <Dumbbell className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="font-bold text-white">Buhat-Buddy</span>
                                </div>
                                <button onClick={() => setMobileMenuOpen(false)} className="text-[#f2f2f2] hover:text-[#f96d00]">
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <Link
                                        href={route('login')}
                                        className="block rounded-lg border border-[#393e46] px-4 py-3 text-center font-medium text-[#f2f2f2] transition-all hover:border-[#f96d00] hover:text-[#f96d00]"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Log In
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="hover:bg-opacity-90 block rounded-lg bg-[#f96d00] px-4 py-3 text-center font-medium text-white transition-all"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Sign Up
                                    </Link>
                                </div>

                                <div className="border-t border-[#393e46] pt-6">
                                    <h3 className="mb-4 font-bold text-white">Quick Access</h3>
                                    <div className="space-y-3">
                                        <a href="#features" className="block text-[#f2f2f2] hover:text-[#f96d00]">
                                            Features
                                        </a>
                                        <a href="#stats" className="block text-[#f2f2f2] hover:text-[#f96d00]">
                                            Statistics
                                        </a>
                                        <a href="#cta" className="block text-[#f2f2f2] hover:text-[#f96d00]">
                                            Get Started
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
