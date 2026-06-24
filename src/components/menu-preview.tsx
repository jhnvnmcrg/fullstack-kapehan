import { Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { listMenuItems } from '@/lib/menu-items.functions';

export function MenuPreview() {
    const items = useQuery({
        queryKey: ['menu-items'],
        queryFn: useServerFn(listMenuItems)
    });
    const all = items.data ?? [];
    const featured = (
        all.filter((i: any) => i.is_featured && i.is_available).slice(0, 3)
            .length
            ? all.filter((i: any) => i.is_featured && i.is_available)
            : all.filter((i: any) => i.is_available)
    ).slice(0, 3);

    return (
        <section className='bg-clay/30 py-20'>
            <div className='mx-auto max-w-screen-xl px-6'>
                <div className='mb-12 flex items-end justify-between gap-4'>
                    <div className='space-y-2'>
                        <span className='text-xs font-medium uppercase tracking-[0.2em] text-sage'>
                            The Daily Brew
                        </span>
                        <h2 className='font-serif text-3xl font-medium tracking-tight md:text-4xl'>
                            House favourites
                        </h2>
                    </div>
                    <Link
                        to='/menu'
                        className='text-xs font-medium uppercase tracking-widest text-coffee/60 transition-colors hover:text-terracotta'
                    >
                        Full menu →
                    </Link>
                </div>
                {featured.length === 0 ? (
                    <p className='text-coffee/55'>Menu coming soon.</p>
                ) : (
                    <div className='grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8'>
                        {featured.map((item: any) => (
                            <article key={item.id} className='group space-y-4'>
                                <div className='overflow-hidden rounded-[min(4vw,20px)] outline outline-1 -outline-offset-1 outline-black/5'>
                                    {item.image_url ? (
                                        <img
                                            src={item.image_url}
                                            alt={item.name}
                                            loading='lazy'
                                            className='aspect-square w-full bg-clay object-cover transition-transform duration-700 group-hover:scale-[1.03]'
                                        />
                                    ) : (
                                        <div className='aspect-square w-full bg-clay' />
                                    )}
                                </div>
                                <div className='flex items-start justify-between gap-4'>
                                    <div className='max-w-[30ch]'>
                                        <h3 className='font-serif text-xl font-medium'>
                                            {item.name}
                                        </h3>
                                        <p className='mt-1 text-pretty text-sm text-coffee/60'>
                                            {item.description}
                                        </p>
                                    </div>
                                    <span className='shrink-0 font-medium text-sm text-terracotta'>
                                        ₱{Number(item.price).toFixed(0)}
                                    </span>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
