import { Link } from '@inertiajs/react';
import { CalendarDays, Dumbbell, Trophy } from 'lucide-react';

export default function AppHeaderNav() {
    return (
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
            <div className="mx-auto grid max-w-7xl grid-cols-3">
                <Link href="/dashboard" className="flex items-center justify-center gap-1 py-3 text-xs font-medium">
                    <Dumbbell className="size-5 text-primary" />
                    <span>Home</span>
                </Link>
                <Link href="/weekly" className="flex items-center justify-center gap-1 py-3 text-xs font-medium">
                    <CalendarDays className="size-5 text-primary" />
                    <span>Weekly</span>
                </Link>
                <Link href="/profile" className="flex items-center justify-center gap-1 py-3 text-xs font-medium">
                    <Trophy className="size-5 text-primary" />
                    <span>Profile</span>
                </Link>
            </div>
        </nav>
    );
}
