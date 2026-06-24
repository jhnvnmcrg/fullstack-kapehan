import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { listCategories } from '@/lib/categories.functions';
import { listMenuItems } from '@/lib/menu-items.functions';

export function MenuFull() {
    const cats = useQuery({
        queryKey: ['categories'],
        queryFn: useServerFn(listCategories)
    });
    const items = useQuery({
        queryKey: ['menu-items'],
        queryFn: useServerFn(listMenuItems)
    });

    const categories = cats.data ?? [];
    const allItems = items.data ?? [];
    const [activeId, setActiveId] = useState<string | null>(null);
    const effective = activeId ?? categories[0]?.id ?? null;
    const active = categories.find(c => c.id === effective) ?? null;
    const activeItems = useMemo(
        () =>
            allItems.filter(
                (i: any) => i.category_id === effective && i.is_available
            ),
        [allItems, effective]
    );

    return (
        <section className='py-16 md:py-24'>
            <div className='mx-auto max-w-screen-xl px-6'>
                <div className='mb-10 space-y-4'>
                    <span className='text-xs font-medium uppercase tracking-[0.2em] text-sage'>
                        The Daily Brew
                    </span>
                    <h1 className='font-serif text-4xl font-medium tracking-tight md:text-6xl'>
                        Our menu
                    </h1>
                </div>

                {cats.isLoading || items.isLoading ? (
                    <p className='text-coffee/55'>Loading menu…</p>
                ) : categories.length === 0 ? (
                    <p className='text-coffee/55'>Menu coming soon.</p>
                ) : (
                    <>
                        <div className='mb-12 flex flex-wrap gap-2 border-b border-coffee/10'>
                            {categories.map(c => {
                                const count = allItems.filter(
                                    (i: any) => i.category_id === c.id
                                ).length;
                                return (
                                    <button
                                        key={c.id}
                                        onClick={() => setActiveId(c.id)}
                                        className={`-mb-px border-b-2 px-4 py-3 text-sm transition-colors ${
                                            effective === c.id
                                                ? 'border-terracotta text-coffee'
                                                : 'border-transparent text-coffee/50 hover:text-coffee'
                                        }`}
                                    >
                                        {c.name}{' '}
                                        <span className='ml-1 text-xs text-coffee/40'>
                                            ({count})
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {active?.description && (
                            <p className='mb-10 max-w-prose text-pretty text-coffee/70'>
                                {active.description}
                            </p>
                        )}

                        <div className='grid grid-cols-1 gap-10 md:grid-cols-2'>
                            {activeItems.map((item: any) => (
                                <article
                                    key={item.id}
                                    className='flex gap-5 border-b border-coffee/10 pb-8'
                                >
                                    {item.image_url && (
                                        <img
                                            src={item.image_url}
                                            alt={item.name}
                                            loading='lazy'
                                            className='size-24 shrink-0 rounded-2xl object-cover outline outline-1 -outline-offset-1 outline-black/5'
                                        />
                                    )}
                                    <div className='flex min-w-0 flex-1 flex-col'>
                                        <div className='flex items-baseline justify-between gap-3'>
                                            <h3 className='truncate font-serif text-xl font-medium'>
                                                {item.name}
                                            </h3>
                                            <span className='shrink-0 font-medium text-sm text-terracotta'>
                                                ₱{Number(item.price).toFixed(0)}
                                            </span>
                                        </div>
                                        <p className='mt-1 text-pretty text-sm text-coffee/65'>
                                            {item.description}
                                        </p>
                                    </div>
                                </article>
                            ))}
                            {activeItems.length === 0 && (
                                <p className='text-sm text-coffee/55'>
                                    No items in this category yet.
                                </p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
