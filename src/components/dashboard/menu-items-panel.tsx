import { useState, type FormEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { toast } from 'sonner';
import { Coffee, Pencil, Plus, Trash2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { listCategories } from '@/lib/categories.functions';
import {
    listMenuItems,
    saveMenuItem,
    deleteMenuItem
} from '@/lib/menu-items.functions';
import { useOwnerToken } from '@/lib/owner-context';
import { ImageUpload } from './image-upload';
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
    category_id: string | null;
    name: string;
    description: string | null;
    price: number;
    image_url: string | null;
    image_public_id: string | null;
    is_featured: boolean;
    is_available: boolean;
    sort_order: number;
};

export function MenuItemsPanel() {
    const qc = useQueryClient();
    const getToken = useOwnerToken();
    const list = useServerFn(listMenuItems);
    const listCats = useServerFn(listCategories);
    const save = useServerFn(saveMenuItem);
    const del = useServerFn(deleteMenuItem);

    const items = useQuery({ queryKey: ['menu-items'], queryFn: () => list() });
    const cats = useQuery({
        queryKey: ['categories'],
        queryFn: () => listCats()
    });

    const saveMut = useMutation({
        mutationFn: async (row: Row) => {
            const token = await getToken();
            return save({ data: { ...row, token } });
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['menu-items'] });
            toast.success('Item saved');
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
            qc.invalidateQueries({ queryKey: ['menu-items'] });
            toast.success('Item removed');
        },
        onError: e => toast.error((e as Error).message)
    });

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Row | null>(null);

    function startNew() {
        setEditing({
            category_id: cats.data?.[0]?.id ?? null,
            name: '',
            description: '',
            price: 0,
            image_url: null,
            image_public_id: null,
            is_featured: false,
            is_available: true,
            sort_order: 0
        });
        setOpen(true);
    }

    return (
        <PanelShell
            title='Menu items'
            subtitle='Everything currently on the chalkboard.'
            action={
                <button
                    onClick={startNew}
                    disabled={!cats.data?.length}
                    title={!cats.data?.length ? 'Add a category first' : ''}
                    className={btnPrimary}
                >
                    <Plus className='h-4 w-4' /> Add item
                </button>
            }
        >
            {items.isLoading ? (
                <p className='text-sm text-coffee/55'>Loading…</p>
            ) : (items.data ?? []).length === 0 ? (
                <EmptyState>No menu items yet.</EmptyState>
            ) : (
                <div className='overflow-hidden rounded-2xl border border-coffee/10 bg-cream'>
                    <table className='w-full text-sm'>
                        <thead className='border-b border-coffee/10 bg-clay/40 text-left text-[11px] uppercase tracking-widest text-coffee/55'>
                            <tr>
                                <th className='px-4 py-3 font-medium'>Item</th>
                                <th className='hidden px-4 py-3 font-medium md:table-cell'>
                                    Category
                                </th>
                                <th className='px-4 py-3 font-medium'>Price</th>
                                <th className='hidden px-4 py-3 font-medium sm:table-cell'>
                                    Status
                                </th>
                                <th className='px-4 py-3' />
                            </tr>
                        </thead>
                        <tbody>
                            {(items.data ?? []).map((r: any) => (
                                <tr
                                    key={r.id}
                                    className='border-b border-coffee/5 last:border-0'
                                >
                                    <td className='px-4 py-3'>
                                        <div className='flex items-center gap-3'>
                                            <div className='h-10 w-10 shrink-0 overflow-hidden rounded-md bg-clay'>
                                                {r.image_url ? (
                                                    <img
                                                        src={r.image_url}
                                                        alt=''
                                                        className='h-full w-full object-cover'
                                                    />
                                                ) : (
                                                    <div className='grid h-full w-full place-items-center text-coffee/30'>
                                                        <Coffee className='h-4 w-4' />
                                                    </div>
                                                )}
                                            </div>
                                            <div className='min-w-0'>
                                                <div className='font-medium'>
                                                    {r.name}
                                                </div>
                                                <div className='truncate text-xs text-coffee/55 max-w-[40ch]'>
                                                    {r.description}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='hidden px-4 py-3 text-coffee/70 md:table-cell'>
                                        {r.menu_categories?.name ?? '—'}
                                    </td>
                                    <td className='px-4 py-3 font-medium text-terracotta'>
                                        ₱{Number(r.price).toFixed(0)}
                                    </td>
                                    <td className='hidden px-4 py-3 sm:table-cell'>
                                        <Badge
                                            tone={
                                                r.is_available
                                                    ? 'sage'
                                                    : 'terracotta'
                                            }
                                        >
                                            {r.is_available
                                                ? 'Available'
                                                : 'Sold out'}
                                        </Badge>
                                    </td>
                                    <td className='px-4 py-3 text-right'>
                                        <div className='flex justify-end gap-1'>
                                            <IconBtn
                                                label='Edit'
                                                onClick={() => {
                                                    setEditing({
                                                        id: r.id,
                                                        category_id:
                                                            r.category_id,
                                                        name: r.name,
                                                        description:
                                                            r.description ?? '',
                                                        price: Number(r.price),
                                                        image_url: r.image_url,
                                                        image_public_id:
                                                            r.image_public_id,
                                                        is_featured:
                                                            r.is_featured,
                                                        is_available:
                                                            r.is_available,
                                                        sort_order: r.sort_order
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
                                                            `Delete "${r.name}"?`
                                                        )
                                                    )
                                                        delMut.mutate(r.id);
                                                }}
                                            >
                                                <Trash2 className='h-3.5 w-3.5' />
                                            </IconBtn>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className='max-h-[90vh] overflow-y-auto'>
                    <DialogHeader>
                        <DialogTitle className='font-serif text-2xl tracking-tight'>
                            {editing?.id ? 'Edit menu item' : 'New menu item'}
                        </DialogTitle>
                    </DialogHeader>
                    {editing && (
                        <ItemForm
                            initial={editing}
                            categories={cats.data ?? []}
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

function ItemForm({
    initial,
    categories,
    onSave,
    onCancel,
    submitting
}: {
    initial: Row;
    categories: Array<{ id: string; name: string }>;
    onSave: (row: Row) => void;
    onCancel: () => void;
    submitting: boolean;
}) {
    const [row, setRow] = useState<Row>(initial);
    function submit(e: FormEvent) {
        e.preventDefault();
        if (!row.name.trim()) return toast.error('Name is required');
        onSave(row);
    }
    return (
        <form onSubmit={submit} className='space-y-4'>
            <Field label='Image'>
                <ImageUpload
                    folder='menu'
                    value={row.image_url}
                    onChange={img =>
                        setRow({
                            ...row,
                            image_url: img?.url ?? null,
                            image_public_id: img?.publicId ?? null
                        })
                    }
                    aspect='aspect-video'
                />
            </Field>
            <Field label='Name'>
                <input
                    required
                    value={row.name}
                    onChange={e => setRow({ ...row, name: e.target.value })}
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
            <div className='grid grid-cols-2 gap-3'>
                <Field label='Price (₱)'>
                    <input
                        type='number'
                        min={0}
                        step='1'
                        required
                        value={row.price}
                        onChange={e =>
                            setRow({ ...row, price: Number(e.target.value) })
                        }
                        className={fieldClass}
                    />
                </Field>
                <Field label='Category'>
                    <select
                        value={row.category_id ?? ''}
                        onChange={e =>
                            setRow({
                                ...row,
                                category_id: e.target.value || null
                            })
                        }
                        className={fieldClass}
                    >
                        <option value=''>—</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </Field>
            </div>
            <div className='grid grid-cols-2 gap-3'>
                <label className='flex items-center gap-2 text-sm'>
                    <input
                        type='checkbox'
                        checked={row.is_available}
                        onChange={e =>
                            setRow({ ...row, is_available: e.target.checked })
                        }
                    />{' '}
                    Available
                </label>
                <label className='flex items-center gap-2 text-sm'>
                    <input
                        type='checkbox'
                        checked={row.is_featured}
                        onChange={e =>
                            setRow({ ...row, is_featured: e.target.checked })
                        }
                    />{' '}
                    Featured on home
                </label>
            </div>
            <DialogFooter className='gap-2'>
                <button type='button' onClick={onCancel} className={btnGhost}>
                    Cancel
                </button>
                <button
                    type='submit'
                    disabled={submitting}
                    className={btnPrimary}
                >
                    {submitting ? 'Saving…' : 'Save item'}
                </button>
            </DialogFooter>
        </form>
    );
}
