import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { CheckCircle2, Dumbbell, Flame, Plus, Target, Trash2, Trophy, Zap } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type PlanItem = {
    id: number;
    exercise_name: string;
    estimated_reps: number | null;
    sets: number | null;
    notes: string | null;
    position: number;
    is_completed: boolean;
};

export default function WeeklyDay() {
    const { props } = usePage();
    const day = (props as any).day as string;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Weekly', href: '/weekly' },
        { title: day, href: `/weekly/${day}` },
    ];

    const [planId, setPlanId] = useState<number | null>(null);
    const [items, setItems] = useState<PlanItem[]>([]);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ exercise_name: '', estimated_reps: '', sets: '', notes: '' });
    const [templateFilter, setTemplateFilter] = useState({ category: 'push', equipment: 'bodyweight' });
    const [templates, setTemplates] = useState<any[]>([]);
    const [label, setLabel] = useState('');
    const [showCelebration, setShowCelebration] = useState(false);

    const csrf = useMemo(() => {
        const el = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null;
        return el?.content ?? '';
    }, []);

    // Calculate completion stats
    const completedCount = items.filter((item) => item.is_completed).length;
    const totalCount = items.length;
    const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
    const isFullyCompleted = totalCount > 0 && completedCount === totalCount;

    async function ensureWeeklyPlan() {
        const res = await fetch('/weekly-plan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrf, 'X-Requested-With': 'XMLHttpRequest' },
            body: JSON.stringify({ day_of_week: day }),
        });
        const data = await res.json();
        setPlanId(data.plan.id);
        setLabel(data.plan.workout_text ?? '');
        return data.plan.id as number;
    }

    async function loadItems(planIdValue: number) {
        const res = await fetch(`/weekly-plan/${planIdValue}/items`);
        const data = await res.json();
        setItems(data.items || []);
    }

    useEffect(() => {
        (async () => {
            const id = await ensureWeeklyPlan();
            await loadItems(id);
        })();
    }, [day]);

    useEffect(() => {
        (async () => {
            const params = new URLSearchParams();
            if (templateFilter.category) params.set('category', templateFilter.category);
            if (templateFilter.equipment) params.set('equipment', templateFilter.equipment);
            const res = await fetch(`/workout-templates?${params.toString()}`);
            const data = await res.json();
            setTemplates(data.templates || []);
        })();
    }, [templateFilter]);

    async function applyTemplate(templateId: number) {
        if (!planId) return;
        await fetch(`/weekly-plan/${planId}/apply-template`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrf, 'X-Requested-With': 'XMLHttpRequest' },
            body: JSON.stringify({ template_id: templateId }),
        });
        await loadItems(planId);
    }

    async function saveLabel(newLabel: string) {
        if (!planId) return;
        setLabel(newLabel);
        await fetch('/weekly-plan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrf, 'X-Requested-With': 'XMLHttpRequest' },
            body: JSON.stringify({ day_of_week: day, workout_text: newLabel || null }),
        });
    }

    async function addItem() {
        if (!planId) return;
        const payload = {
            exercise_name: form.exercise_name.trim(),
            estimated_reps: form.estimated_reps ? Number(form.estimated_reps) : null,
            sets: form.sets ? Number(form.sets) : null,
            notes: form.notes || null,
        };
        const res = await fetch(`/weekly-plan/${planId}/items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrf, 'X-Requested-With': 'XMLHttpRequest' },
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        setItems((prev) => [...prev, { ...data.item, is_completed: false }]);
        setOpen(false);
        setForm({ exercise_name: '', estimated_reps: '', sets: '', notes: '' });
    }

    async function removeItem(itemId: number) {
        if (!planId) return;
        await fetch(`/weekly-plan/${planId}/items/${itemId}`, {
            method: 'DELETE',
            headers: { 'X-CSRF-TOKEN': csrf, 'X-Requested-With': 'XMLHttpRequest' },
        });
        setItems((prev) => prev.filter((i) => i.id !== itemId));
    }

    async function toggleItemCompletion(itemId: number, completed: boolean) {
        if (!planId) return;

        // Optimistically update UI
        setItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, is_completed: completed } : item)));

        // Check if this completion makes the workout fully complete
        const updatedItems = items.map((item) => (item.id === itemId ? { ...item, is_completed: completed } : item));
        const newCompletedCount = updatedItems.filter((item) => item.is_completed).length;
        const wasFullyCompleted = completedCount === totalCount;
        const nowFullyCompleted = newCompletedCount === totalCount;

        if (!wasFullyCompleted && nowFullyCompleted && completed) {
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 3000);
        }

        // Send to backend
        await fetch(`/weekly-plan/${planId}/items/${itemId}/toggle`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrf,
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify({ is_completed: completed }),
        });
    }

    function getProgressColor() {
        if (completionPercentage === 0) return 'bg-gray-200';
        if (completionPercentage < 50) return 'bg-gradient-to-r from-red-400 to-orange-400';
        if (completionPercentage < 80) return 'bg-gradient-to-r from-orange-400 to-yellow-400';
        if (completionPercentage < 100) return 'bg-gradient-to-r from-yellow-400 to-green-400';
        return 'bg-gradient-to-r from-green-400 to-emerald-500';
    }

    function getMotivationalMessage() {
        if (completionPercentage === 0) return 'Ready to crush this workout? 💪';
        if (completionPercentage < 50) return 'Great start! Keep pushing! 🔥';
        if (completionPercentage < 80) return "You're on fire! Almost there! ⚡";
        if (completionPercentage < 100) return 'So close! Finish strong! 🚀';
        return "WORKOUT COMPLETE! You're a beast! 🏆";
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Weekly Plan • ${day}`} />

            {/* Celebration Overlay */}
            {showCelebration && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="animate-bounce rounded-2xl bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 p-8 text-center shadow-2xl">
                        <Trophy className="mx-auto mb-4 h-16 w-16 animate-spin text-white" />
                        <h2 className="mb-2 text-3xl font-bold text-white">WORKOUT COMPLETE!</h2>
                        <p className="text-lg text-white/90">You earned some serious XP! 🚀</p>
                        <div className="mt-4 flex justify-center gap-2">
                            <Flame className="h-6 w-6 animate-pulse text-white" />
                            <Zap className="h-6 w-6 animate-pulse text-white delay-100" />
                            <Target className="h-6 w-6 animate-pulse text-white delay-200" />
                        </div>
                    </div>
                </div>
            )}

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-3 sm:gap-6 sm:p-4">
                <div className="rounded-xl border bg-primary/5 p-4 sm:p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <Dumbbell className="size-6 text-primary" />
                            <h1 className="text-xl font-semibold text-foreground">{day} Plan</h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <Input
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                                onBlur={(e) => saveLabel(e.target.value)}
                                placeholder="Add a label (e.g., chest day)"
                                className="w-full text-base font-semibold sm:w-64 sm:text-sm"
                            />
                        </div>
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button variant="default" className="gap-2 bg-primary text-primary-foreground hover:opacity-90">
                                    <Plus className="size-4" /> Add Exercise
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add Exercise</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Exercise</Label>
                                        <Input
                                            id="name"
                                            value={form.exercise_name}
                                            onChange={(e) => setForm((f) => ({ ...f, exercise_name: e.target.value }))}
                                            placeholder="e.g., Push-ups"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="reps">Estimated Reps</Label>
                                            <Input
                                                id="reps"
                                                type="number"
                                                min={0}
                                                value={form.estimated_reps}
                                                onChange={(e) => setForm((f) => ({ ...f, estimated_reps: e.target.value }))}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="sets">Sets</Label>
                                            <Input
                                                id="sets"
                                                type="number"
                                                min={0}
                                                value={form.sets}
                                                onChange={(e) => setForm((f) => ({ ...f, sets: e.target.value }))}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="notes">Notes</Label>
                                        <Input
                                            id="notes"
                                            value={form.notes}
                                            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                                            placeholder="optional notes"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={addItem}>Save</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Progress Card */}
                {totalCount > 0 && (
                    <Card
                        className={`border-2 transition-all duration-500 ${isFullyCompleted ? 'border-green-500 bg-green-50' : 'border-orange-200 bg-orange-50'}`}
                    >
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {isFullyCompleted ? (
                                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                                    ) : (
                                        <Target className="h-6 w-6 text-orange-600" />
                                    )}
                                    <CardTitle className="text-lg">Progress Tracker</CardTitle>
                                </div>
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <span className={isFullyCompleted ? 'text-green-700' : 'text-orange-700'}>
                                        {completedCount}/{totalCount} exercises
                                    </span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm font-medium">
                                    <span className={isFullyCompleted ? 'text-green-700' : 'text-gray-700'}>{getMotivationalMessage()}</span>
                                    <span className={`font-bold ${isFullyCompleted ? 'text-green-600' : 'text-orange-600'}`}>
                                        {Math.round(completionPercentage)}%
                                    </span>
                                </div>
                                <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                                    <div
                                        className={`h-full transition-all duration-700 ease-out ${getProgressColor()} ${isFullyCompleted ? 'animate-pulse' : ''}`}
                                        style={{ width: `${completionPercentage}%` }}
                                    ></div>
                                </div>
                                {isFullyCompleted && (
                                    <div className="flex items-center justify-center gap-2 font-medium text-green-700">
                                        <Trophy className="h-4 w-4" />
                                        <span>Workout Complete! Great job! 🎉</span>
                                        <Trophy className="h-4 w-4" />
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Dumbbell className="size-5 text-primary" /> Exercises
                        </CardTitle>
                        <CardDescription className="flex flex-col gap-3">
                            <span>Add and manage exercises for {day}</span>
                            <div className="flex flex-wrap items-center gap-3">
                                <Select value={templateFilter.category} onValueChange={(v) => setTemplateFilter((f) => ({ ...f, category: v }))}>
                                    <SelectTrigger className="w-[160px]">
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="upper">Upper Body</SelectItem>
                                        <SelectItem value="lower">Lower Body</SelectItem>
                                        <SelectItem value="push">Push</SelectItem>
                                        <SelectItem value="pull">Pull</SelectItem>
                                        <SelectItem value="legs">Legs</SelectItem>
                                        <SelectItem value="chest">Chest</SelectItem>
                                        <SelectItem value="arms">Arms</SelectItem>
                                        <SelectItem value="biceps">Biceps</SelectItem>
                                        <SelectItem value="triceps">Triceps</SelectItem>
                                        <SelectItem value="abs">Abs & Core</SelectItem>
                                        <SelectItem value="back">Back</SelectItem>
                                        <SelectItem value="shoulders">Shoulders</SelectItem>
                                        <SelectItem value="cardio">HIIT Cardio</SelectItem>
                                        <SelectItem value="functional">Functional Movement</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={templateFilter.equipment} onValueChange={(v) => setTemplateFilter((f) => ({ ...f, equipment: v }))}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Equipment" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="bodyweight">Bodyweight</SelectItem>
                                        <SelectItem value="equipment">With Equipment</SelectItem>
                                    </SelectContent>
                                </Select>
                                <div className="flex flex-wrap gap-2">
                                    {templates.map((t) => (
                                        <Button key={t.id} variant="outline" size="sm" onClick={() => applyTemplate(t.id)}>
                                            Use "{t.name}"
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-3">
                            {items.length === 0 ? (
                                <div className="py-8 text-center text-muted-foreground">
                                    <Dumbbell className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                                    <p className="text-lg font-medium">No exercises yet</p>
                                    <p className="text-sm">Click "Add Exercise" or apply a template to get started!</p>
                                </div>
                            ) : (
                                items.map((it) => (
                                    <div
                                        key={it.id}
                                        className={`flex items-center gap-4 rounded-lg border p-4 transition-all duration-300 ${
                                            it.is_completed
                                                ? 'border-green-200 bg-green-50 opacity-75'
                                                : 'border-gray-200 bg-white hover:border-primary/50 hover:shadow-sm'
                                        }`}
                                    >
                                        <div className="flex items-center">
                                            <Checkbox
                                                checked={it.is_completed}
                                                onCheckedChange={(checked) => toggleItemCompletion(it.id, !!checked)}
                                                className="h-5 w-5 data-[state=checked]:border-green-600 data-[state=checked]:bg-green-600"
                                            />
                                        </div>

                                        <div className="flex min-w-0 flex-1 flex-col">
                                            <div
                                                className={`font-medium transition-all duration-200 ${
                                                    it.is_completed ? 'text-green-700 line-through' : 'text-foreground'
                                                }`}
                                            >
                                                {it.exercise_name}
                                                {it.is_completed && <CheckCircle2 className="ml-2 inline-block h-4 w-4 text-green-600" />}
                                            </div>
                                            <div
                                                className={`text-sm transition-all duration-200 ${
                                                    it.is_completed ? 'text-green-600' : 'text-muted-foreground'
                                                }`}
                                            >
                                                {it.estimated_reps ? `${it.estimated_reps} reps` : 'reps: —'} •{' '}
                                                {it.sets ? `${it.sets} sets` : 'sets: —'}
                                                {it.notes ? ` • ${it.notes}` : ''}
                                            </div>
                                        </div>

                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => removeItem(it.id)}
                                            className="shrink-0 opacity-60 hover:opacity-100"
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
