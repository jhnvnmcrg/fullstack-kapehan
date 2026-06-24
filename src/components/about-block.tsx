import interior from '@/assets/interior.jpg';
import pour from '@/assets/gallery-pour.jpg';

export function AboutBlock({ compact = false }: { compact?: boolean }) {
    return (
        <section className={compact ? 'py-16' : 'py-20 md:py-28'}>
            <div className='mx-auto max-w-screen-xl px-6'>
                <div className='h-px w-full bg-coffee/10' />
                <div className='mt-12 grid grid-cols-1 gap-12 md:grid-cols-2 md:items-center md:gap-20'>
                    <div className='space-y-6'>
                        <span className='text-xs font-medium uppercase tracking-[0.2em] text-sage'>
                            Our story
                        </span>
                        <h2 className='text-balance font-serif text-4xl font-medium leading-tight tracking-tight md:text-5xl'>
                            Crafted with patience and Filipino heart.
                        </h2>
                        <p className='max-w-[56ch] text-pretty text-base leading-relaxed text-coffee/75'>
                            Founded in 2021, Kapehan began as a small walk-up
                            window in Koronadal. Today we&rsquo;re a corner
                            devoted to the slow ritual of the cup — bridging
                            local farmers and urban coffee drinkers with beans
                            from Benguet, Sagada, and Batangas.
                        </p>
                        {!compact && (
                            <p className='max-w-[56ch] text-pretty text-base leading-relaxed text-coffee/75'>
                                Every batch is hand-roasted in the back of the
                                shop. Every pastry is laminated overnight.
                                Nothing rushed, nothing wasted, everything
                                served warm.
                            </p>
                        )}
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <img
                            src={interior}
                            alt='Warm boutique coffee shop interior with hanging plants'
                            loading='lazy'
                            width={1280}
                            height={800}
                            className='col-span-2 aspect-video w-full rounded-[min(4vw,20px)] object-cover outline outline-1 -outline-offset-1 outline-black/5'
                        />
                        {!compact && (
                            <img
                                src={pour}
                                alt='Barista pouring milk into espresso'
                                loading='lazy'
                                width={800}
                                height={1024}
                                className='col-span-2 aspect-[5/4] w-full rounded-[min(4vw,20px)] object-cover outline outline-1 -outline-offset-1 outline-black/5'
                            />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
