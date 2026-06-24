import { useQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { listGallery } from '@/lib/gallery.functions';

export function Gallery({
    variant = 'scroll'
}: {
    variant?: 'scroll' | 'grid';
}) {
    const q = useQuery({
        queryKey: ['gallery'],
        queryFn: useServerFn(listGallery)
    });
    const images = (q.data ?? []).map(g => ({
        id: g.id,
        src: g.image_url,
        alt: g.caption ?? 'Inside Kapehan'
    }));

    if (variant === 'grid') {
        return (
            <section className='py-16 md:py-24'>
                <div className='mx-auto max-w-screen-xl px-6'>
                    <div className='mb-10 space-y-3'>
                        <span className='text-xs font-medium uppercase tracking-[0.2em] text-sage'>
                            Inside Kapehan
                        </span>
                        <h1 className='font-serif text-4xl font-medium tracking-tight md:text-6xl'>
                            Gallery
                        </h1>
                    </div>
                    {images.length === 0 ? (
                        <p className='text-coffee/55'>No photos yet.</p>
                    ) : (
                        <div className='grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5'>
                            {images.map((img, i) => (
                                <img
                                    key={img.id}
                                    src={img.src}
                                    alt={img.alt}
                                    loading='lazy'
                                    className={`w-full rounded-2xl object-cover outline outline-1 -outline-offset-1 outline-black/5 ${
                                        i % 5 === 0
                                            ? 'aspect-[4/5] md:row-span-2 md:aspect-[3/4]'
                                            : 'aspect-square'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        );
    }

    if (images.length === 0) return null;

    return (
        <section className='py-16 overflow-hidden'>
            <div className='mx-auto max-w-screen-xl px-6'>
                <div className='mb-8 flex items-end justify-between gap-4'>
                    <h2 className='font-serif text-3xl font-medium tracking-tight md:text-4xl'>
                        A moment inside
                    </h2>
                    <span className='hidden text-xs font-medium uppercase tracking-widest text-coffee/40 md:inline'>
                        Swipe
                    </span>
                </div>
            </div>
            <div className='no-scrollbar flex gap-4 overflow-x-auto px-6 pb-2'>
                {images.map(img => (
                    <img
                        key={img.id}
                        src={img.src}
                        alt={img.alt}
                        loading='lazy'
                        className='aspect-[4/5] w-64 shrink-0 rounded-2xl object-cover outline outline-1 -outline-offset-1 outline-black/5'
                    />
                ))}
            </div>
        </section>
    );
}
