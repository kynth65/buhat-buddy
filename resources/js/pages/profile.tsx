import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Trophy } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Profile', href: '/profile' }];

export default function Profile() {
    const [profile, setProfile] = useState<{ xp: number; level: number; title: string; most_active_day: string | null } | null>(null);
    const [stats, setStats] = useState<{
        xp_over_time: Array<{ date: string; xp: number }>;
        weekday_counts: number[]; // 0..6
        label_distribution: Array<{ label: string; count: number }>;
        weekly_summary: Array<{ week_start: string; workouts: number; rest: number }>;
    } | null>(null);

    async function fetchProfile() {
        const res = await fetch('/api/profile');
        const data = await res.json();
        setProfile(data);
    }

    async function fetchStats() {
        const res = await fetch('/api/profile/stats');
        const data = await res.json();
        setStats(data);
    }

    useEffect(() => {
        fetchProfile();
        fetchStats();
    }, []);

    const progressToNext = profile ? profile.xp % 100 : 0;

    const weekdayLabels = useMemo(() => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-3 sm:gap-6 sm:p-4">
                <div className="rounded-xl border bg-primary/5 p-4 sm:p-6">
                    <div className="flex items-center gap-3">
                        <Trophy className="size-6 text-primary" />
                        <h1 className="text-xl font-semibold text-foreground">Profile</h1>
                        <Badge className="bg-primary text-primary-foreground">Stats</Badge>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="size-5 text-primary" /> Profile Stats
                        </CardTitle>
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
                        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progressToNext}%` }} />
                        </div>
                        <div className="mt-3 text-sm">
                            Most active: <span className="font-medium">{profile?.most_active_day || '—'}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Charts */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* XP over time (line) */}
                    <Card>
                        <CardHeader>
                            <CardTitle>XP Over Time</CardTitle>
                            <CardDescription>Your cumulative XP progression</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {stats?.xp_over_time?.length ? (
                                <SimpleLineChart data={stats.xp_over_time} color="var(--color-primary)" />
                            ) : (
                                <div className="text-sm text-muted-foreground">No data yet</div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Weekday distribution (bar) */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Workouts by Weekday</CardTitle>
                            <CardDescription>When you train the most</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {stats ? (
                                <SimpleBarChart labels={weekdayLabels} values={stats.weekday_counts} color="var(--color-primary)" />
                            ) : (
                                <div className="text-sm text-muted-foreground">No data yet</div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Label distribution (bar) */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Workout Labels</CardTitle>
                            <CardDescription>Your most frequent routines</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {stats?.label_distribution?.length ? (
                                <SimpleBarChart
                                    labels={stats.label_distribution.map((l) => l.label)}
                                    values={stats.label_distribution.map((l) => l.count)}
                                    color="var(--color-secondary)"
                                />
                            ) : (
                                <div className="text-sm text-muted-foreground">No data yet</div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Weekly summary (stacked-ish) */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Last 8 Weeks</CardTitle>
                            <CardDescription>Workouts vs Rest</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {stats?.weekly_summary?.length ? (
                                <GroupedBarChart
                                    categories={stats.weekly_summary.map((w) => w.week_start)}
                                    series={[
                                        { name: 'Workouts', values: stats.weekly_summary.map((w) => w.workouts), color: 'var(--color-primary)' },
                                        { name: 'Rest', values: stats.weekly_summary.map((w) => w.rest), color: '#222831' },
                                    ]}
                                />
                            ) : (
                                <div className="text-sm text-muted-foreground">No data yet</div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

// Minimal charts with SVG-only (no extra deps)
function SimpleLineChart({ data, color }: { data: Array<{ date: string; xp: number }>; color: string }) {
    const width = 600;
    const height = 200;
    const padding = 32;
    const xs = data.map((d) => new Date(d.date).getTime());
    const ys = data.map((d) => d.xp);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = 0;
    const maxY = Math.max(10, Math.max(...ys));
    const scaleX = (x: number) => padding + ((x - minX) / Math.max(1, maxX - minX)) * (width - padding * 2);
    const scaleY = (y: number) => height - padding - ((y - minY) / Math.max(1, maxY - minY)) * (height - padding * 2);
    const dPath = data.map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(new Date(p.date).getTime())} ${scaleY(p.xp)}`).join(' ');
    return (
        <div className="w-full overflow-x-auto">
            <svg viewBox={`0 0 ${width} ${height}`} className="h-48 w-[600px]">
                <path d={dPath} fill="none" stroke={color} strokeWidth={2} />
            </svg>
        </div>
    );
}

function SimpleBarChart({ labels, values, color }: { labels: string[]; values: number[]; color: string }) {
    const width = 600;
    const height = 200;
    const padding = 32;
    const maxV = Math.max(1, ...values);
    const barW = (width - padding * 2) / Math.max(1, values.length);
    return (
        <div className="w-full overflow-x-auto">
            <svg viewBox={`0 0 ${width} ${height}`} className="h-48 w-[600px]">
                {values.map((v, i) => {
                    const x = padding + i * barW + 6;
                    const h = ((v / maxV) * (height - padding * 2)) | 0;
                    const y = height - padding - h;
                    return <rect key={i} x={x} y={y} width={Math.max(10, barW - 12)} height={h} fill={color} rx={4} />;
                })}
            </svg>
        </div>
    );
}

function GroupedBarChart({ categories, series }: { categories: string[]; series: Array<{ name: string; values: number[]; color: string }> }) {
    const width = 600;
    const height = 220;
    const padding = 32;
    const groups = categories.length;
    const barsPerGroup = series.length;
    const groupW = (width - padding * 2) / Math.max(1, groups);
    const barW = Math.max(8, (groupW - 12) / Math.max(1, barsPerGroup));
    const maxV = Math.max(1, ...series.flatMap((s) => s.values));
    return (
        <div className="w-full overflow-x-auto">
            <svg viewBox={`0 0 ${width} ${height}`} className="h-52 w-[600px]">
                {categories.map((_, gi) => {
                    return series.map((s, si) => {
                        const v = s.values[gi] ?? 0;
                        const h = ((v / maxV) * (height - padding * 2)) | 0;
                        const x = padding + gi * groupW + 6 + si * barW;
                        const y = height - padding - h;
                        return <rect key={`${gi}-${si}`} x={x} y={y} width={barW - 4} height={h} fill={s.color} rx={4} />;
                    });
                })}
            </svg>
        </div>
    );
}
