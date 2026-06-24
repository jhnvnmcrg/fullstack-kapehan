import { useState, type FormEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { toast } from 'sonner';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import {
    listCategories,
    saveCategory,
    deleteCategory
} from '@/lib/categories.functions';
import { useOwnerToken } from '@/lib/owner-context';
import {
    Field,
    IconBtn,
    PanelShell,
    btnGhost,
    btnPrimary,
    fieldClass,
    EmptyState,
    Badge
} from './ui';

type Row = {
    id?: string;
    name: string;
    slug: string;
    description: string | null;
    sort_order: number;
};

const slugify = (s: string) =>
    s
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

export function CategoriesPanel() {
    const qc = useQueryClient();
    const getToken = useOwnerToken();
    const list = useServerFn(listCategories);
    const save = useServerFn(saveCategory);
    const del = useServerFn(deleteCategory);

    const q = useQuery({ queryKey: ['categories'], queryFn: () => list() });

    const saveMut = useMutation({
        mutationFn: async (row: Row) => {
            const token = await getToken();
            return save({ data: { ...row, token } });
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['categories'] });
            toast.success('Category saved');
            setOpen(false);
        },
        onError: e => toast.error((e as Error).message)
    });

    const delMut = useMutation({
        mutationFn: async (id: string) => {
            const token = await getToken();
            return del({ data: { token, id } });
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['categories'] });
            qc.invalidateQueries({ queryKey: ['menu-items'] });
            toast.success('Category removed');
        },
        onError: e => toast.error((e as Error).message)
    });

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Row | null>(null);

    return (
        <PanelShell
            title='Menu categories'
            subtitle='Group items the way guests browse them.'
            action={
                <button
                    className={btnPrimary}
                    onClick={() => {
                        setEditing({
                            name: '',
                            slug: '',
                            description: '',
                            sort_order: 0
                        });
                        setOpen(true);
                    }}
                >
                    <Plus className='h-4 w-4' /> New category
                </button>
            }
        >
            {q.isLoading ? (
                <p className='text-sm text-coffee/55'>Loading…</p>
            ) : (q.data ?? []).length === 0 ? (
                <EmptyState>
                    No categories yet. Add one to start building your menu.
                </EmptyState>
            ) : (
                <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                    {(q.data ?? []).map(c => (
                        <article
                            key={c.id}
                            className='group rounded-2xl border border-coffee/10 bg-cream p-5 transition hover:border-coffee/20'
                        >
                            <div className='flex items-start justify-between'>
                                <div>
                                    <h3 className='font-serif text-xl tracking-tight'>
                                        {c.name}
                                    </h3>
                                    <p className='mt-1 text-xs text-coffee/55'>
                                        /{c.slug}
                                    </p>
                                </div>
                                <div className='flex gap-1'>
                                    <IconBtn
                                        label='Edit'
                                        onClick={() => {
                                            setEditing({
                                                id: c.id,
                                                name: c.name,
                                                slug: c.slug,
                                                description:
                                                    c.description ?? '',
                                                sort_order: c.sort_order
                                            });
                                            setOpen(true);
                                        }}
                                    >
                                        <Pencil className='h-3.5 w-3.5' />
                                    </IconBtn>
                                    <IconBtn
                                        label='Remove'
                                        danger
                                        disabled={delMut.isPending}
                                        onClick={() => {
                                            if (
                                                confirm(
                                                    `Delete category "${c.name}"?`
                                                )
                                            )
                                                delMut.mutate(c.id);
                                        }}
                                    >
                                        <Trash2 className='h-3.5 w-3.5' />
                                    </IconBtn>
                                </div>
                            </div>
                            <p className='mt-4 text-sm text-coffee/70'>
                                {c.description}
                            </p>
                            <div className='mt-5'>
                                <Badge tone='sage'>Published</Badge>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className='font-serif text-2xl tracking-tight'>
                            {editing?.id ? 'Edit category' : 'New category'}
                        </DialogTitle>
                    </DialogHeader>
                    {editing && (
                        <CategoryForm
                            initial={editing}
                            submitting={saveMut.isPending}
                            onCancel={() => setOpen(false)}
                            onSave={r => saveMut.mutate(r)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </PanelShell>
    );
}

function CategoryForm({
    initial,
    onSave,
    onCancel,
    submitting
}: {
    initial: Row;
    onSave: (row: Row) => void;
    onCancel: () => void;
    submitting: boolean;
}) {
    const [row, setRow] = useState<Row>(initial);
    function submit(e: FormEvent) {
        e.preventDefault();
        onSave({ ...row, slug: row.slug || slugify(row.name) });
    }
    return (
        <form onSubmit={submit} className='space-y-4'>
            <Field label='Name'>
                <input
                    required
                    value={row.name}
                    onChange={e => setRow({ ...row, name: e.target.value })}
                    className={fieldClass}
                />
            </Field>
            <Field label='Slug (URL)'>
                <input
                    required
                    value={row.slug}
                    onChange={e =>
                        setRow({ ...row, slug: slugify(e.target.value) })
                    }
                    placeholder={slugify(row.name) || 'coffee'}
                    className={fieldClass}
                />
            </Field>
            <Field label='Description'>
                <textarea
                    rows={3}
                    value={row.description ?? ''}
                    onChange={e =>
                        setRow({ ...row, description: e.target.value })
                    }
                    className={`${fieldClass} h-auto py-2`}
                />
            </Field>
            <Field label='Sort order'>
                <input
                    type='number'
                    min={0}
                    value={row.sort_order}
                    onChange={e =>
                        setRow({ ...row, sort_order: Number(e.target.value) })
                    }
                    className={fieldClass}
                />
            </Field>
            <DialogFooter className='gap-2'>
                <button type='button' onClick={onCancel} className={btnGhost}>
                    Cancel
                </button>
                <button
                    type='submit'
                    disabled={submitting}
                    className={btnPrimary}
                >
                    {submitting ? 'Saving…' : 'Save category'}
                </button>
            </DialogFooter>
        </form>
    );
}
