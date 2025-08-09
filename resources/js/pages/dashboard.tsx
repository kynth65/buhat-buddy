import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { CalendarDays, Dumbbell } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    // Sports-themed dashboard that ties to backend endpoints
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [month, setMonth] = useState<number>(new Date().getMonth() + 1); // 1-12
    const [calendarLogs, setCalendarLogs] = useState<Array<{ date: string; is_rest_day: boolean; workout_text?: string | null }>>([]);
    const [weeklyPlans, setWeeklyPlans] = useState<Record<string, string>>({});
    const [profile, setProfile] = useState<{ xp: number; level: number; title: string; most_active_day: string | null } | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

    const csrf = useMemo(() => {
        const el = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null;
        return el?.content ?? '';
    }, []);

    const daysInMonth = useMemo(() => new Date(year, month, 0).getDate(), [year, month]);
    const firstDayOfWeek = useMemo(() => new Date(year, month - 1, 1).getDay(), [year, month]); // 0=Sun
    const monthName = useMemo(() => new Date(year, month - 1).toLocaleString(undefined, { month: 'long' }), [year, month]);

    const logsByDate = useMemo(() => {
        const map = new Map<string, { is_rest_day: boolean; workout_text?: string | null }>();
        for (const l of calendarLogs) map.set(l.date, { is_rest_day: l.is_rest_day, workout_text: l.workout_text });
        return map;
    }, [calendarLogs]);

    function isoFor(day: number) {
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    function weekdayName(idx: number) {
        return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][idx];
    }

    async function fetchCalendar() {
        const res = await fetch(`/calendar?year=${year}&month=${month}`);
        const data = await res.json();
        setCalendarLogs(data.logs ?? []);
    }

    async function fetchWeeklyPlan() {
        const res = await fetch('/weekly-plan');
        const data = await res.json();
        const map: Record<string, string> = {};
        for (const p of data.plans ?? []) map[p.day_of_week] = p.workout_text ?? '';
        setWeeklyPlans(map);
    }

    async function fetchProfile() {
        const res = await fetch('/profile');
        const data = await res.json();
        setProfile(data);
    }

    useEffect(() => {
        fetchCalendar();
    }, [year, month]);

    useEffect(() => {
        fetchWeeklyPlan();
        fetchProfile();
    }, []);

    function prevMonth() {
        setMonth((m) => {
            if (m === 1) {
                setYear((y) => y - 1);
                return 12;
            }
            return m - 1;
        });
    }

    function nextMonth() {
        setMonth((m) => {
            if (m === 12) {
                setYear((y) => y + 1);
                return 1;
            }
            return m + 1;
        });
    }

    async function submitCheckIn(isRestDay: boolean) {
        const weekdayIdx = new Date(selectedDate).getDay();
        const dayName = weekdayName(weekdayIdx);
        const workoutFromPlan = !isRestDay ? weeklyPlans[dayName] || null : null;

        await fetch('/check-in', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrf,
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify({ date: selectedDate, workout_text: workoutFromPlan, is_rest_day: isRestDay }),
        });
        await Promise.all([fetchCalendar(), fetchProfile()]);
    }

    async function upsertPlan(dayOfWeek: string, text: string) {
        setWeeklyPlans((prev) => ({ ...prev, [dayOfWeek]: text }));
        await fetch('/weekly-plan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrf,
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify({ day_of_week: dayOfWeek, workout_text: text || null }),
        });
    }

    const progressToNext = profile ? profile.xp % 100 : 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buhat-Buddy" />
            <div className="flex h-full flex-1 flex-col gap-3 rounded-xl p-3 sm:gap-6 sm:p-4">
                {/* Hero / Sports banner */}
                <div className="rounded-xl border bg-primary/5 p-4 sm:p-6">
                    <div className="flex items-center gap-3">
                        <Dumbbell className="size-6 text-primary" />
                        <h1 className="text-xl font-semibold text-foreground">Buhat-Buddy</h1>
                        <Badge className="bg-primary text-primary-foreground">Train. Log. Level Up.</Badge>
                    </div>
                </div>

                <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
                    {/* Calendar */}
                    <Card className="md:col-span-3" id="calendar">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CalendarDays className="size-5 text-primary" /> Training Calendar
                            </CardTitle>
                            <CardDescription>Log workouts or rest days. Leg day gives bonus XP.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4 flex flex-wrap items-center gap-2">
                                <Button variant="outline" size="sm" onClick={prevMonth}>
                                    Prev
                                </Button>
                                <div className="min-w-40 text-center text-sm font-medium sm:text-base">
                                    {monthName} {year}
                                </div>
                                <Button variant="outline" size="sm" onClick={nextMonth}>
                                    Next
                                </Button>
                            </div>

                            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-medium text-muted-foreground sm:gap-2 sm:text-xs">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                                    <div key={d}>{d}</div>
                                ))}
                            </div>
                            <div className="mt-2 grid grid-cols-7 gap-1 sm:gap-2">
                                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                                    <div key={`pad-${i}`} />
                                ))}
                                {Array.from({ length: daysInMonth }).map((_, idx) => {
                                    const day = idx + 1;
                                    const dIso = isoFor(day);
                                    const selected = selectedDate === dIso;
                                    const mark = logsByDate.get(dIso);
                                    const isWorkout = mark && !mark.is_rest_day;
                                    const isRest = mark && mark.is_rest_day;
                                    return (
                                        <button
                                            key={dIso}
                                            onClick={() => setSelectedDate(dIso)}
                                            className={[
                                                'aspect-square rounded-lg border text-xs sm:text-sm transition-colors',
                                                selected
                                                    ? 'border-primary ring-2 ring-primary/40'
                                                    : 'border-sidebar-border/70 dark:border-sidebar-border',
                                                isWorkout ? 'bg-primary/15 text-primary' : '',
                                                isRest ? 'bg-[#222831]/10 text-[#222831] dark:text-[#f2f2f2]' : '',
                                            ].join(' ')}
                                        >
                                            <div className="flex h-full flex-col items-center justify-center">
                                                <div className="font-semibold leading-none">{day}</div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Show selected day's workout text derived from log or weekly plan */}
                            <div className="mt-3 text-sm text-muted-foreground">
                                {(() => {
                                    const mark = logsByDate.get(selectedDate);
                                    const name = weekdayName(new Date(selectedDate).getDay());
                                    if (mark) {
                                        if (mark.is_rest_day) return 'Selected: Rest day';
                                        return `Selected: ${mark.workout_text || 'Workout'}`;
                                    }
                                    return `Selected: ${weeklyPlans[name] || '—'}`;
                                })()}
                            </div>

                            <div className="mt-4 flex flex-wrap items-center gap-2">
                                <Button size="sm" onClick={() => submitCheckIn(false)} className="bg-primary text-primary-foreground hover:bg-[#e06100]">
                                    Workout
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => submitCheckIn(true)}>
                                    Rest Day
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* History */}
                <Card>
                    <CardHeader>
                        <CardTitle>Workout History</CardTitle>
                        <CardDescription>What you logged this month</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-2">
                            {calendarLogs.length === 0 && <div className="text-sm text-muted-foreground">No logs yet.</div>}
                            {calendarLogs
                                .slice()
                                .sort((a, b) => a.date.localeCompare(b.date))
                                .map((l) => (
                                    <div key={l.date} className="flex items-center justify-between rounded-lg border p-2 text-sm">
                                        <div className="font-medium">{l.date}</div>
                                        <div className="text-right">
                                            {l.is_rest_day ? (
                                                <span className="text-muted-foreground">Rest day</span>
                                            ) : (
                                                <span>{l.workout_text || 'Workout'}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
