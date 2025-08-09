import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// removed per-day inline Input; label is edited on the day page
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
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
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-3 sm:gap-6 sm:p-4">
                <div className="rounded-xl border bg-primary/5 p-4 sm:p-6">
                    <div className="flex items-center gap-3">
                        <Dumbbell className="size-6 text-primary" />
                        <h1 className="text-xl font-semibold text-foreground">Weekly Routine</h1>
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
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                                <div
                                    key={day}
                                    className="cursor-pointer rounded-lg border p-3 hover:bg-muted/30"
                                    onClick={() => router.visit(`/weekly/${day}`)}
                                >
                                    <div className="mb-2 flex items-center justify-between">
                                        <div className="font-medium text-foreground">{day}</div>
                                        {weeklyPlans[day] ? (
                                            <Badge className="bg-primary text-primary-foreground">Planned</Badge>
                                        ) : (
                                            <Badge className="bg-secondary text-secondary-foreground">Empty</Badge>
                                        )}
                                    </div>
                                    <div className="text-sm text-muted-foreground">{weeklyPlans[day] ? weeklyPlans[day] : 'No label yet'}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
