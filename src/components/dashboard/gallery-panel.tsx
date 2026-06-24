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
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/components/ui/alert-dialog';
import {
    listGallery,
    saveGalleryImage,
    deleteGalleryImage
} from '@/lib/gallery.functions';
import { useOwnerToken } from '@/lib/owner-context';
import { ImageUpload } from './image-upload';
import {
    Field,
    IconBtn,
    PanelShell,
    btnGhost,
    btnPrimary,
    fieldClass,
    EmptyState
} from './ui';

type Row = {
    id?: string;
    image_url: string;
    image_public_id: string | null;
    caption: string | null;
    sort_order: number;
};

export function GalleryPanel() {
    const qc = useQueryClient();
    const getToken = useOwnerToken();
    const list = useServerFn(listGallery);
    const save = useServerFn(saveGalleryImage);
    const del = useServerFn(deleteGalleryImage);

    const q = useQuery({ queryKey: ['gallery'], queryFn: () => list() });

    const saveMut = useMutation({
        mutationFn: async (row: Row) => {
            const token = await getToken();
            return save({ data: { ...row, token } });
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['gallery'] });
            toast.success('Photo saved');
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
            qc.invalidateQueries({ queryKey: ['gallery'] });
            toast.success('Photo removed');
        },
        onError: e => toast.error((e as Error).message)
    });

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Row | null>(null);
    const [pendingDelete, setPendingDelete] = useState<{
        id: string;
        caption: string | null;
    } | null>(null);

    function startNew() {
        setEditing({
            image_url: '',
            image_public_id: null,
            caption: '',
            sort_order: 0
        });
        setOpen(true);
    }

    return (
        <PanelShell
            title='Gallery'
            subtitle='The slow, warm moments guests share.'
            action={
                <button onClick={startNew} className={btnPrimary}>
                    <Plus className='h-4 w-4' /> Add photo
                </button>
            }
        >
            {q.isLoading ? (
                <p className='text-sm text-coffee/55'>Loading…</p>
            ) : (q.data ?? []).length === 0 ? (
                <EmptyState>
                    No photos yet. Upload your first to start the gallery.
                </EmptyState>
            ) : (
                <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4'>
                    {(q.data ?? []).map(p => (
                        <figure
                            key={p.id}
                            className='group relative aspect-[4/5] overflow-hidden rounded-xl bg-clay'
                        >
                            <img
                                src={p.image_url}
                                alt={p.caption ?? ''}
                                className='h-full w-full object-cover transition duration-500 group-hover:scale-105'
                            />
                            <div className='absolute inset-0 bg-gradient-to-t from-coffee/80 via-coffee/0 to-coffee/0 opacity-0 transition group-hover:opacity-100' />
                            {p.caption && (
                                <figcaption className='absolute inset-x-0 bottom-0 translate-y-2 p-3 text-xs text-cream opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100'>
                                    {p.caption}
                                </figcaption>
                            )}
                            <div className='absolute right-2 top-2 flex gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100'>
                                <IconBtn
                                    label='Edit'
                                    onClick={() => {
                                        setEditing({
                                            id: p.id,
                                            image_url: p.image_url,
                                            image_public_id: p.image_public_id,
                                            caption: p.caption ?? '',
                                            sort_order: p.sort_order
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
                                    onClick={() =>
                                        p.id &&
                                        setPendingDelete({
                                            id: p.id,
                                            caption: p.caption
                                        })
                                    }
                                >
                                    <Trash2 className='h-3.5 w-3.5' />
                                </IconBtn>
                            </div>
                        </figure>
                    ))}

                    <button
                        onClick={startNew}
                        className='grid aspect-[4/5] place-items-center rounded-xl border-2 border-dashed border-coffee/15 text-coffee/50 transition hover:border-terracotta hover:text-terracotta'
                    >
                        <div className='flex flex-col items-center gap-2 text-xs'>
                            <Plus className='h-5 w-5' /> Add photo
                        </div>
                    </button>
                </div>
            )}

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className='max-h-[90vh] overflow-y-auto'>
                    <DialogHeader>
                        <DialogTitle className='font-serif text-2xl tracking-tight'>
                            {editing?.id ? 'Edit photo' : 'Add photo'}
                        </DialogTitle>
                    </DialogHeader>
                    {editing && (
                        <GalleryForm
                            initial={editing}
                            submitting={saveMut.isPending}
                            onCancel={() => setOpen(false)}
                            onSave={r => saveMut.mutate(r)}
                        />
                    )}
                </DialogContent>
            </Dialog>

            <AlertDialog
                open={pendingDelete !== null}
                onOpenChange={o => {
                    if (!o) setPendingDelete(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className='font-serif text-2xl tracking-tight'>
                            Delete this photo?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {pendingDelete?.caption
                                ? `“${pendingDelete.caption}” will be removed from the gallery and from Cloudinary. This can’t be undone.`
                                : 'The photo will be removed from the gallery and from Cloudinary. This can’t be undone.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            disabled={delMut.isPending}
                            onClick={e => {
                                e.preventDefault();
                                if (!pendingDelete) return;
                                delMut.mutate(pendingDelete.id, {
                                    onSettled: () => setPendingDelete(null)
                                });
                            }}
                            className='bg-terracotta text-cream hover:bg-terracotta/90'
                        >
                            {delMut.isPending ? 'Deleting…' : 'Delete photo'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </PanelShell>
    );
}

function GalleryForm({
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
        if (!row.image_url) return toast.error('Upload an image first');
        onSave(row);
    }
    return (
        <form onSubmit={submit} className='space-y-4'>
            <Field label='Image'>
                <ImageUpload
                    folder='gallery'
                    value={row.image_url || null}
                    onChange={img =>
                        setRow({
                            ...row,
                            image_url: img?.url ?? '',
                            image_public_id: img?.publicId ?? null
                        })
                    }
                    aspect='aspect-[4/5]'
                />
            </Field>
            <Field label='Caption'>
                <input
                    value={row.caption ?? ''}
                    onChange={e => setRow({ ...row, caption: e.target.value })}
                    className={fieldClass}
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
                    {submitting ? 'Saving…' : 'Save photo'}
                </button>
            </DialogFooter>
        </form>
    );
}
