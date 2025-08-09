import { useEffect, useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dumbbell, CalendarDays, Trophy } from 'lucide-react';

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
        const workoutFromPlan = !isRestDay ? (weeklyPlans[dayName] || null) : null;

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
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                {/* Hero / Sports banner */}
                <div className="rounded-xl border bg-gradient-to-r from-green-500/15 via-emerald-500/10 to-cyan-500/15 p-6 dark:from-green-400/10 dark:via-emerald-400/5 dark:to-cyan-400/10">
                    <div className="flex items-center gap-3">
                        <Dumbbell className="size-6 text-emerald-600 dark:text-emerald-400" />
                        <h1 className="text-xl font-semibold">Buhat-Buddy</h1>
                        <Badge className="bg-emerald-600 text-white dark:bg-emerald-500">Train. Log. Level Up.</Badge>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Calendar */}
                    <Card className="md:col-span-2" id="calendar">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><CalendarDays className="size-5 text-emerald-600" /> Training Calendar</CardTitle>
                            <CardDescription>Log workouts or rest days. Leg day gives bonus XP.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4 flex items-center gap-2">
                                <Button variant="outline" onClick={prevMonth}>
                                    Prev
                                </Button>
                                <div className="min-w-40 text-center font-medium">{monthName} {year}</div>
                                <Button variant="outline" onClick={nextMonth}>
                                    Next
                                </Button>
                            </div>

                            <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-muted-foreground">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                                    <div key={d}>{d}</div>
                                ))}
                            </div>
                            <div className="mt-2 grid grid-cols-7 gap-2">
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
                                                'aspect-square rounded-lg border text-sm transition-colors',
                                                selected ? 'border-emerald-600 ring-2 ring-emerald-600/40' : 'border-sidebar-border/70 dark:border-sidebar-border',
                                                isWorkout ? 'bg-emerald-600/15 text-emerald-800 dark:text-emerald-300' : '',
                                                isRest ? 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-300' : '',
                                            ].join(' ')}
                                        >
                                            <div className="flex h-full flex-col items-center justify-center">
                                                <div className="font-semibold">{day}</div>
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
                                        return `Selected: ${mark.workout_text || weeklyPlans[name] || 'Workout'}`;
                                    }
                                    return `Selected: ${weeklyPlans[name] || '—'}`;
                                })()}
                            </div>

                            <div className="mt-4 flex flex-wrap items-center gap-2">
                                <Button onClick={() => submitCheckIn(false)} className="bg-emerald-600 text-white hover:bg-emerald-600/90">
                                    Workout
                                </Button>
                                <Button variant="outline" onClick={() => submitCheckIn(true)}>
                                    Rest Day
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Profile Stats */}
                    <Card id="profile">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Trophy className="size-5 text-amber-500" /> Profile Stats</CardTitle>
                            <CardDescription>XP, level, title, most active day</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-3xl font-bold">Lvl {profile?.level ?? 1}</div>
                                    <div className="text-sm text-muted-foreground">{profile?.title || 'Novice'}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-semibold">{profile?.xp ?? 0} XP</div>
                                    <div className="text-xs text-muted-foreground">{100 - progressToNext} XP to next level</div>
                                </div>
                            </div>
                            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
                                <div
                                    className="h-full rounded-full bg-emerald-600 transition-all"
                                    style={{ width: `${progressToNext}%` }}
                                />
                            </div>
                            <div className="mt-3 text-sm">
                                Most active: <span className="font-medium">{profile?.most_active_day || '—'}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Weekly Plan */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Dumbbell className="size-5 text-emerald-600" /> Weekly Plan</CardTitle>
                        <CardDescription>Edit your plan for each weekday</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                                <div key={day} className="rounded-lg border p-3">
                                    <div className="mb-2 flex items-center justify-between">
                                        <div className="font-medium">{day}</div>
                                        {weeklyPlans[day] ? (
                                            <Badge className="bg-emerald-600 text-white dark:bg-emerald-500">Planned</Badge>
                                        ) : (
                                            <Badge variant="outline">Empty</Badge>
                                        )}
                                    </div>
                                    <Input
                                        value={weeklyPlans[day] || ''}
                                        placeholder="e.g., leg day"
                                        onChange={(e) => setWeeklyPlans((prev) => ({ ...prev, [day]: e.target.value }))}
                                        onBlur={(e) => upsertPlan(day, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* History */}
                <Card>
                    <CardHeader>
                        <CardTitle>Workout History</CardTitle>
                        <CardDescription>What you logged this month</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-2">
                            {calendarLogs.length === 0 && (
                                <div className="text-sm text-muted-foreground">No logs yet.</div>
                            )}
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
                                                <span>{l.workout_text || weeklyPlans[weekdayName(new Date(l.date).getDay())] || 'Workout'}</span>
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
