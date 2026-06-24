import { Link } from '@tanstack/react-router';
import heroCup from '@/assets/hero-cup.jpg';

export function Hero() {
    return (
        <section className='pt-4 pb-16'>
            <div className='mx-auto max-w-screen-xl px-6'>
                <div className='grid items-center gap-10 md:grid-cols-2 md:gap-16'>
                    <div className='order-2 md:order-1 space-y-6 animate-fade-up'>
                        <span className='text-xs font-medium uppercase tracking-[0.2em] text-sage'>
                            Est. 2026 &bull; Koronadal
                        </span>
                        <h1 className='text-balance font-serif text-5xl font-medium leading-none tracking-tight md:text-7xl'>
                            Kape <span className='italic'>tayo.</span>
                        </h1>
                        <p className='max-w-[52ch] text-pretty text-base leading-relaxed text-coffee/75 md:text-lg'>
                            A corner for slow mornings and deep conversations.
                            We roast in small batches to bring out the soul of
                            every bean from the mountains of Benguet and Sagada.
                        </p>
                        <div className='flex flex-wrap gap-3 pt-2'>
                            <Link
                                to='/menu'
                                className='rounded-full bg-terracotta px-6 py-3 text-sm font-medium text-cream shadow-sm ring-1 ring-terracotta transition-transform hover:-translate-y-px active:translate-y-0'
                            >
                                Explore Menu
                            </Link>
                            <Link
                                to='/about'
                                className='rounded-full border border-coffee/15 px-6 py-3 text-sm font-medium text-coffee transition-colors hover:border-coffee/40'
                            >
                                Our story
                            </Link>
                        </div>
                    </div>
                    <div className='order-1 md:order-2'>
                        <img
                            src={heroCup}
                            alt='Steam rising from a ceramic coffee cup in warm morning light'
                            width={1024}
                            height={1280}
                            className='aspect-[4/5] w-full rounded-[min(4vw,28px)] object-cover outline outline-1 -outline-offset-1 outline-black/5'
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
