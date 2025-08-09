import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Profile', href: '/profile' }];

export default function Profile() {
    const [profile, setProfile] = useState<{ xp: number; level: number; title: string; most_active_day: string | null } | null>(null);

    async function fetchProfile() {
        const res = await fetch('/api/profile');
        const data = await res.json();
        setProfile(data);
    }

    useEffect(() => {
        fetchProfile();
    }, []);

    const progressToNext = profile ? profile.xp % 100 : 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <div className="rounded-xl border bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-orange-500/15 p-6 dark:from-amber-400/10 dark:via-yellow-400/5 dark:to-orange-400/10">
                    <div className="flex items-center gap-3">
                        <Trophy className="size-6 text-amber-600 dark:text-amber-400" />
                        <h1 className="text-xl font-semibold">Profile</h1>
                        <Badge variant="outline">Stats</Badge>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="size-5 text-amber-500" /> Profile Stats
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
                        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
                            <div className="h-full rounded-full bg-amber-500 transition-all" style={{ width: `${progressToNext}%` }} />
                        </div>
                        <div className="mt-3 text-sm">
                            Most active: <span className="font-medium">{profile?.most_active_day || '—'}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
