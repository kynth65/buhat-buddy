import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Dumbbell } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Weekly', href: '/weekly' }];

export default function Weekly() {
    const [weeklyPlans, setWeeklyPlans] = useState<Record<string, string>>({});

    const csrf = useMemo(() => {
        const el = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null;
        return el?.content ?? '';
    }, []);

    async function fetchWeeklyPlan() {
        const res = await fetch('/weekly-plan');
        const data = await res.json();
        const map: Record<string, string> = {};
        for (const p of data.plans ?? []) map[p.day_of_week] = p.workout_text ?? '';
        setWeeklyPlans(map);
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

    useEffect(() => {
        fetchWeeklyPlan();
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Weekly Plan" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div className="rounded-xl border bg-gradient-to-r from-green-500/15 via-emerald-500/10 to-cyan-500/15 p-6 dark:from-green-400/10 dark:via-emerald-400/5 dark:to-cyan-400/10">
                    <div className="flex items-center gap-3">
                        <Dumbbell className="size-6 text-emerald-600 dark:text-emerald-400" />
                        <h1 className="text-xl font-semibold">Weekly Routine</h1>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Dumbbell className="size-5 text-emerald-600" /> Weekly Plan
                        </CardTitle>
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
            </div>
        </AppLayout>
    );
}
