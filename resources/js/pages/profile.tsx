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

                {/* Mobile-friendly cards (replace charts) */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Weekday totals */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Workouts by Weekday</CardTitle>
                            <CardDescription>Count per weekday</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {stats ? (
                                <ul className="divide-y">
                                    {weekdayLabels.map((w, i) => (
                                        <li key={w} className="flex items-center justify-between py-2 text-sm">
                                            <span className="font-medium">{w}</span>
                                            <span className="rounded bg-primary/10 px-2 py-0.5 font-semibold text-primary">
                                                {stats.weekday_counts[i] ?? 0}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-sm text-muted-foreground">No data yet</div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Top labels */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Workout Labels</CardTitle>
                            <CardDescription>Your most frequent routines (top 10)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {stats?.label_distribution?.length ? (
                                <ul className="divide-y">
                                    {stats.label_distribution.map((l) => (
                                        <li key={l.label} className="flex items-center justify-between py-2 text-sm">
                                            <span className="truncate font-medium">{l.label}</span>
                                            <span className="rounded bg-secondary px-2 py-0.5 font-semibold text-secondary-foreground">
                                                {l.count}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-sm text-muted-foreground">No data yet</div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Last 8 weeks summary */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Last 8 Weeks</CardTitle>
                            <CardDescription>Weekly totals (Mon–Sun)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {stats?.weekly_summary?.length ? (
                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                                    {stats.weekly_summary.map((w) => (
                                        <div key={w.week_start} className="rounded-lg border p-3">
                                            <div className="text-xs text-muted-foreground">Week of {new Date(w.week_start).toLocaleDateString()}</div>
                                            <div className="mt-2 flex items-center justify-between">
                                                <div className="text-sm font-medium">Workouts</div>
                                                <div className="rounded bg-primary/10 px-2 py-0.5 text-sm font-semibold text-primary">
                                                    {w.workouts}
                                                </div>
                                            </div>
                                            <div className="mt-1 flex items-center justify-between">
                                                <div className="text-sm font-medium">Rest</div>
                                                <div className="rounded bg-[#222831]/10 px-2 py-0.5 text-sm font-semibold text-[#222831] dark:text-[#f2f2f2]">
                                                    {w.rest}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-sm text-muted-foreground">No data yet</div>
                            )}
                        </CardContent>
                    </Card>

                    {/* XP milestones */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>XP Milestones</CardTitle>
                            <CardDescription>Recent XP checkpoints</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {stats?.xp_over_time?.length ? (
                                <ul className="divide-y">
                                    {stats.xp_over_time.slice(-6).map((p) => (
                                        <li key={p.date} className="flex items-center justify-between py-2 text-sm">
                                            <span className="text-muted-foreground">{new Date(p.date).toLocaleDateString()}</span>
                                            <span className="font-semibold">{p.xp} XP</span>
                                        </li>
                                    ))}
                                </ul>
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
    const xTicks = 4;
    const yTicks = 4;
    const tickXVals = Array.from({ length: xTicks + 1 }, (_, i) => minX + ((maxX - minX) * i) / xTicks);
    const tickYVals = Array.from({ length: yTicks + 1 }, (_, i) => minY + ((maxY - minY) * i) / yTicks);
    return (
        <div className="w-full">
            <svg viewBox={`0 0 ${width} ${height}`} className="h-48 w-full sm:h-56">
                {/* grid */}
                {tickXVals.map((x, i) => (
                    <line key={`gx-${i}`} x1={scaleX(x)} y1={padding} x2={scaleX(x)} y2={height - padding} stroke="#e5e7eb" strokeWidth={1} />
                ))}
                {tickYVals.map((y, i) => (
                    <line key={`gy-${i}`} x1={padding} y1={scaleY(y)} x2={width - padding} y2={scaleY(y)} stroke="#e5e7eb" strokeWidth={1} />
                ))}
                {/* line */}
                <path d={dPath} fill="none" stroke={color} strokeWidth={2} />
                {/* y labels */}
                {tickYVals.map((y, i) => (
                    <text key={`yl-${i}`} x={8} y={scaleY(y)} fontSize={10} fill="#6b7280">
                        {Math.round(y)}
                    </text>
                ))}
                {/* x labels */}
                {tickXVals.map((x, i) => (
                    <text key={`xl-${i}`} x={scaleX(x)} y={height - 8} fontSize={10} fill="#6b7280" textAnchor="middle">
                        {new Date(x).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </text>
                ))}
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
        <div className="w-full">
            <svg viewBox={`0 0 ${width} ${height}`} className="h-48 w-full sm:h-56">
                {/* axes */}
                <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#e5e7eb" />
                <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#e5e7eb" />
                {/* bars */}
                {values.map((v, i) => {
                    const x = padding + i * barW + 6;
                    const h = ((v / maxV) * (height - padding * 2)) | 0;
                    const y = height - padding - h;
                    return <rect key={i} x={x} y={y} width={Math.max(10, barW - 12)} height={h} fill={color} rx={4} />;
                })}
                {/* x labels */}
                {labels.map((l, i) => (
                    <text
                        key={`xl-${i}`}
                        x={padding + i * barW + Math.max(10, barW - 12) / 2 + 6}
                        y={height - padding + 12}
                        fontSize={10}
                        fill="#6b7280"
                        textAnchor="middle"
                    >
                        {l}
                    </text>
                ))}
                {/* y ticks */}
                {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
                    const val = Math.round(maxV * t);
                    const y = height - padding - (height - padding * 2) * t;
                    return (
                        <text key={`yl-${i}`} x={padding - 6} y={y} fontSize={10} fill="#6b7280" textAnchor="end">
                            {val}
                        </text>
                    );
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
        <div className="w-full">
            <svg viewBox={`0 0 ${width} ${height}`} className="h-56 w-full sm:h-60">
                {/* axes */}
                <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#e5e7eb" />
                <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#e5e7eb" />
                {/* grouped bars */}
                {categories.map((_, gi) => {
                    return series.map((s, si) => {
                        const v = s.values[gi] ?? 0;
                        const h = ((v / maxV) * (height - padding * 2)) | 0;
                        const x = padding + gi * groupW + 6 + si * barW;
                        const y = height - padding - h;
                        return <rect key={`${gi}-${si}`} x={x} y={y} width={barW - 4} height={h} fill={s.color} rx={4} />;
                    });
                })}
                {/* legend */}
                {series.map((s, i) => (
                    <g key={`lg-${i}`}>
                        <rect x={padding + i * 100} y={8} width={12} height={12} fill={s.color} rx={2} />
                        <text x={padding + i * 100 + 18} y={18} fontSize={12} fill="#6b7280">
                            {s.name}
                        </text>
                    </g>
                ))}
                {/* x labels */}
                {categories.map((c, i) => (
                    <text
                        key={`xl-${i}`}
                        x={padding + i * groupW + groupW / 2}
                        y={height - padding + 12}
                        fontSize={10}
                        fill="#6b7280"
                        textAnchor="middle"
                    >
                        {new Date(c).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </text>
                ))}
                {/* y ticks */}
                {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
                    const val = Math.round(maxV * t);
                    const y = height - padding - (height - padding * 2) * t;
                    return (
                        <text key={`yl-${i}`} x={padding - 6} y={y} fontSize={10} fill="#6b7280" textAnchor="end">
                            {val}
                        </text>
                    );
                })}
            </svg>
        </div>
    );
}
