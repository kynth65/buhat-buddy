import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Dumbbell, Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type PlanItem = {
    id: number;
    exercise_name: string;
    estimated_reps: number | null;
    sets: number | null;
    notes: string | null;
    position: number;
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

    const csrf = useMemo(() => {
        const el = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null;
        return el?.content ?? '';
    }, []);

    async function ensureWeeklyPlan() {
        // Create or retrieve this day's plan id via upsert endpoint
        const res = await fetch('/weekly-plan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrf, 'X-Requested-With': 'XMLHttpRequest' },
            // Do NOT send workout_text here to avoid clearing an existing label
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        setItems((prev) => [...prev, data.item]);
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Weekly Plan • ${day}`} />
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
                                className="w-full sm:w-64"
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
                                        <SelectItem value="push">Push</SelectItem>
                                        <SelectItem value="chest">Chest</SelectItem>
                                        <SelectItem value="upper">Upper</SelectItem>
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
                                            Use “{t.name}”
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-3">
                            {items.length === 0 ? (
                                <div className="text-muted-foreground">No exercises yet. Click Add Exercise to start.</div>
                            ) : (
                                items.map((it) => (
                                    <div key={it.id} className="flex items-center justify-between rounded-lg border p-3">
                                        <div className="flex min-w-0 flex-col">
                                            <div className="truncate font-medium">{it.exercise_name}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {it.estimated_reps ? `${it.estimated_reps} reps` : 'reps: —'} •{' '}
                                                {it.sets ? `${it.sets} sets` : 'sets: —'}
                                                {it.notes ? ` • ${it.notes}` : ''}
                                            </div>
                                        </div>
                                        <Button variant="destructive" size="icon" onClick={() => removeItem(it.id)}>
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
