import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { toast } from 'sonner';
import { Star, Trash2 } from 'lucide-react';
import {
    listAllReviews,
    updateReview,
    deleteReview
} from '@/lib/reviews.functions';
import { useOwnerToken } from '@/lib/owner-context';
import { Badge, EmptyState, PanelShell } from './ui';

export function ReviewsPanel() {
    const qc = useQueryClient();
    const getToken = useOwnerToken();
    const list = useServerFn(listAllReviews);
    const upd = useServerFn(updateReview);
    const del = useServerFn(deleteReview);

    const q = useQuery({
        queryKey: ['reviews-all'],
        queryFn: async () => list({ data: { token: await getToken() } })
    });

    const updMut = useMutation({
        mutationFn: async (vars: {
            id: string;
            is_published?: boolean;
            is_featured?: boolean;
        }) => {
            const token = await getToken();
            return upd({ data: { token, ...vars } });
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['reviews-all'] });
            qc.invalidateQueries({ queryKey: ['reviews-public'] });
        },
        onError: e => toast.error((e as Error).message)
    });

    const delMut = useMutation({
        mutationFn: async (id: string) => {
            const token = await getToken();
            return del({ data: { token, id } });
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['reviews-all'] });
            qc.invalidateQueries({ queryKey: ['reviews-public'] });
            toast.success('Review removed');
        },
        onError: e => toast.error((e as Error).message)
    });

    const rows = q.data ?? [];

    return (
        <PanelShell
            title='Guest reviews'
            subtitle='Approve which voices appear on the public site.'
        >
            {q.isLoading ? (
                <p className='text-sm text-coffee/55'>Loading…</p>
            ) : rows.length === 0 ? (
                <EmptyState>No reviews yet.</EmptyState>
            ) : (
                <div className='grid gap-4 lg:grid-cols-2'>
                    {rows.map(r => (
                        <article
                            key={r.id}
                            className='rounded-2xl border border-coffee/10 bg-cream p-5'
                        >
                            <div className='flex items-start gap-3'>
                                <div className='grid h-10 w-10 shrink-0 place-items-center rounded-full bg-terracotta/15 text-sm font-medium text-terracotta'>
                                    {r.author.slice(0, 2).toUpperCase()}
                                </div>
                                <div className='min-w-0 flex-1'>
                                    <div className='flex flex-wrap items-center gap-2'>
                                        <span className='font-medium'>
                                            {r.author}
                                        </span>
                                        <span className='text-xs text-coffee/45'>
                                            ·{' '}
                                            {new Date(
                                                r.created_at
                                            ).toLocaleDateString()}
                                        </span>
                                        {r.is_featured && (
                                            <Badge tone='terracotta'>
                                                Featured
                                            </Badge>
                                        )}
                                        <Badge
                                            tone={
                                                r.is_published
                                                    ? 'sage'
                                                    : 'coffee'
                                            }
                                        >
                                            {r.is_published
                                                ? 'Published'
                                                : 'Pending'}
                                        </Badge>
                                    </div>
                                    <div className='mt-1 flex items-center gap-0.5'>
                                        {Array.from({ length: 5 }).map(
                                            (_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-3.5 w-3.5 ${i < r.rating ? 'fill-terracotta text-terracotta' : 'text-coffee/15'}`}
                                                />
                                            )
                                        )}
                                    </div>
                                    <p className='mt-3 text-sm leading-relaxed text-coffee/80'>
                                        “{r.body}”
                                    </p>
                                    <div className='mt-4 flex flex-wrap items-center gap-2'>
                                        <button
                                            disabled={updMut.isPending}
                                            onClick={() =>
                                                updMut.mutate({
                                                    id: r.id,
                                                    is_published:
                                                        !r.is_published
                                                })
                                            }
                                            className='rounded-full bg-coffee px-3 py-1.5 text-xs font-medium text-cream hover:bg-coffee/90 disabled:opacity-50'
                                        >
                                            {r.is_published
                                                ? 'Unpublish'
                                                : 'Publish'}
                                        </button>
                                        <button
                                            disabled={
                                                updMut.isPending ||
                                                !r.is_published
                                            }
                                            onClick={() =>
                                                updMut.mutate({
                                                    id: r.id,
                                                    is_featured: !r.is_featured
                                                })
                                            }
                                            title={
                                                !r.is_published
                                                    ? 'Publish first'
                                                    : ''
                                            }
                                            className='rounded-full border border-coffee/15 px-3 py-1.5 text-xs text-coffee/70 hover:border-coffee/30 disabled:opacity-50'
                                        >
                                            {r.is_featured
                                                ? 'Unfeature'
                                                : 'Feature'}
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (
                                                    confirm(
                                                        'Delete this review?'
                                                    )
                                                )
                                                    delMut.mutate(r.id);
                                            }}
                                            className='ml-auto inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs text-coffee/55 hover:text-destructive'
                                        >
                                            <Trash2 className='h-3.5 w-3.5' />{' '}
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </PanelShell>
    );
}
