import { useQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { useUser } from '@clerk/clerk-react';
import {
    BarChart3,
    Coffee,
    FolderTree,
    Image as ImageIcon,
    Plus,
    Star,
    TrendingUp
} from 'lucide-react';
import { listMenuItems } from '@/lib/menu-items.functions';
import { listCategories } from '@/lib/categories.functions';
import { listGallery } from '@/lib/gallery.functions';
import { listAllReviews } from '@/lib/reviews.functions';
import { useOwnerToken } from '@/lib/owner-context';

export function OverviewPanel({
    onJump
}: {
    onJump: (s: 'menu' | 'categories' | 'gallery' | 'reviews') => void;
}) {
    const { user } = useUser();
    const getToken = useOwnerToken();
    const items = useQuery({
        queryKey: ['menu-items'],
        queryFn: useServerFn(listMenuItems)
    });
    const cats = useQuery({
        queryKey: ['categories'],
        queryFn: useServerFn(listCategories)
    });
    const gallery = useQuery({
        queryKey: ['gallery'],
        queryFn: useServerFn(listGallery)
    });
    const listAll = useServerFn(listAllReviews);
    const reviews = useQuery({
        queryKey: ['reviews-all'],
        queryFn: async () => listAll({ data: { token: await getToken() } })
    });

    const allReviews = reviews.data ?? [];
    const pending = allReviews.filter(r => !r.is_published).length;
    const avg =
        allReviews.length === 0
            ? '—'
            : (
                  allReviews.reduce((n, r) => n + r.rating, 0) /
                  allReviews.length
              ).toFixed(1);

    const firstName = user?.firstName ?? user?.username ?? 'there';

    const stats = [
        { label: 'Menu items', value: items.data?.length ?? '—', icon: Coffee },
        {
            label: 'Categories',
            value: cats.data?.length ?? '—',
            icon: FolderTree
        },
        {
            label: 'Gallery photos',
            value: gallery.data?.length ?? '—',
            icon: ImageIcon
        },
        { label: 'Avg. rating', value: avg, icon: Star }
    ];

    return (
        <div className='space-y-8'>
            <section className='overflow-hidden rounded-2xl border border-coffee/10 bg-cream p-6 sm:p-8'>
                <div className='flex flex-wrap items-end justify-between gap-4'>
                    <div>
                        <p className='text-xs uppercase tracking-widest text-coffee/50'>
                            Good morning
                        </p>
                        <h2 className='mt-1 font-serif text-3xl tracking-tight sm:text-4xl'>
                            Slow pour kind of day, {firstName}.
                        </h2>
                        <p className='mt-2 max-w-lg text-sm text-coffee/60'>
                            {pending} pending review{pending === 1 ? '' : 's'}{' '}
                            waiting for your approval.
                        </p>
                    </div>
                    <button
                        onClick={() => onJump('menu')}
                        className='inline-flex items-center gap-2 rounded-full bg-terracotta px-4 py-2 text-sm font-medium text-cream shadow-sm transition hover:-translate-y-px'
                    >
                        <Plus className='h-4 w-4' /> New menu item
                    </button>
                </div>
            </section>

            <section className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                {stats.map(s => {
                    const Icon = s.icon;
                    return (
                        <div
                            key={s.label}
                            className='rounded-2xl border border-coffee/10 bg-cream p-5'
                        >
                            <div className='flex items-center justify-between'>
                                <span className='text-xs uppercase tracking-widest text-coffee/50'>
                                    {s.label}
                                </span>
                                <Icon className='h-4 w-4 text-terracotta' />
                            </div>
                            <div className='mt-3 font-serif text-3xl tracking-tight'>
                                {s.value}
                            </div>
                        </div>
                    );
                })}
            </section>

            <section className='grid gap-6 lg:grid-cols-3'>
                <div className='rounded-2xl border border-coffee/10 bg-cream p-6 lg:col-span-2'>
                    <div className='flex items-center justify-between'>
                        <h3 className='font-serif text-xl tracking-tight'>
                            Activity (preview)
                        </h3>
                        <div className='inline-flex items-center gap-1 rounded-full bg-sage/15 px-2.5 py-1 text-xs text-sage'>
                            <TrendingUp className='h-3 w-3' /> Live
                        </div>
                    </div>
                    <div className='mt-6 flex h-44 items-end gap-3'>
                        {[40, 58, 35, 72, 65, 88, 95].map((h, i) => (
                            <div
                                key={i}
                                className='flex flex-1 flex-col items-center gap-2'
                            >
                                <div
                                    className='w-full rounded-md bg-terracotta/80'
                                    style={{ height: `${h}%` }}
                                />
                                <span className='text-[10px] text-coffee/45'>
                                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className='mt-4 flex items-center gap-2 text-xs text-coffee/55'>
                        <BarChart3 className='h-3.5 w-3.5' /> Sample chart —
                        wire to your own analytics later.
                    </div>
                </div>

                <div className='rounded-2xl border border-coffee/10 bg-cream p-6'>
                    <h3 className='font-serif text-xl tracking-tight'>
                        Recent reviews
                    </h3>
                    <ul className='mt-4 space-y-4 text-sm'>
                        {allReviews.slice(0, 4).map(r => (
                            <li key={r.id} className='flex items-start gap-3'>
                                <span
                                    className={`mt-1.5 h-2 w-2 rounded-full ${r.is_published ? 'bg-sage' : 'bg-terracotta'}`}
                                />
                                <div className='flex-1'>
                                    <p className='text-coffee/80'>
                                        {r.author} · {r.rating}★
                                    </p>
                                    <p className='text-xs text-coffee/45 line-clamp-1'>
                                        {r.body}
                                    </p>
                                </div>
                            </li>
                        ))}
                        {allReviews.length === 0 && (
                            <li className='text-xs text-coffee/45'>
                                No reviews yet.
                            </li>
                        )}
                    </ul>
                    <button
                        onClick={() => onJump('reviews')}
                        className='mt-4 text-xs font-medium uppercase tracking-widest text-terracotta hover:underline'
                    >
                        Manage reviews →
                    </button>
                </div>
            </section>
        </div>
    );
}
