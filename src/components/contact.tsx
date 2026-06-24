import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';

export function Contact({ full = false }: { full?: boolean }) {
    const [submitting, setSubmitting] = useState(false);

    function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSubmitting(true);
        setTimeout(() => {
            setSubmitting(false);
            (e.target as HTMLFormElement).reset();
            toast.success("Salamat! We'll be in touch within a day.");
        }, 700);
    }

    return (
        <section className='py-20 md:py-28'>
            <div className='mx-auto max-w-screen-xl px-6'>
                {full && (
                    <div className='mb-12 space-y-3'>
                        <span className='text-xs font-medium uppercase tracking-[0.2em] text-sage'>
                            Visit us
                        </span>
                        <h1 className='font-serif text-4xl font-medium tracking-tight md:text-6xl'>
                            Get in touch
                        </h1>
                    </div>
                )}
                <div className='grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16'>
                    <div className='space-y-8'>
                        {!full && (
                            <h2 className='font-serif text-3xl font-medium tracking-tight md:text-4xl'>
                                Find us
                            </h2>
                        )}
                        <div className='space-y-6 text-sm text-coffee/75'>
                            <div>
                                <p className='mb-1 text-[10px] font-medium uppercase tracking-[0.2em] text-sage'>
                                    Address
                                </p>
                                <p>
                                    122 Legaspi Street, Salcedo Village
                                    <br />
                                    Koronadal City, South Cotabato 9506
                                </p>
                            </div>
                            <div>
                                <p className='mb-1 text-[10px] font-medium uppercase tracking-[0.2em] text-sage'>
                                    Hours
                                </p>
                                <p>
                                    Mon — Fri: 7:00 to 19:00
                                    <br />
                                    Sat — Sun: 8:00 to 20:00
                                </p>
                            </div>
                            <div>
                                <p className='mb-1 text-[10px] font-medium uppercase tracking-[0.2em] text-sage'>
                                    Reach us
                                </p>
                                <p className='space-y-1'>
                                    <a
                                        href='mailto:hello@kapehan.ph'
                                        className='block underline decoration-terracotta/40 underline-offset-4'
                                    >
                                        hello@kapehan.ph
                                    </a>
                                    <a
                                        href='tel:+6328123456'
                                        className='block underline decoration-terracotta/40 underline-offset-4'
                                    >
                                        +63 2 812 3456
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={onSubmit} className='space-y-1'>
                        <label className='block'>
                            <span className='sr-only'>Name</span>
                            <input
                                required
                                name='name'
                                type='text'
                                placeholder='Name'
                                className='w-full border-b border-coffee/15 bg-transparent py-4 text-sm transition-colors placeholder:text-coffee/40 focus:border-terracotta focus:outline-none'
                            />
                        </label>
                        <label className='block'>
                            <span className='sr-only'>Email</span>
                            <input
                                required
                                name='email'
                                type='email'
                                placeholder='Email'
                                className='w-full border-b border-coffee/15 bg-transparent py-4 text-sm transition-colors placeholder:text-coffee/40 focus:border-terracotta focus:outline-none'
                            />
                        </label>
                        <label className='block'>
                            <span className='sr-only'>Message</span>
                            <textarea
                                required
                                name='message'
                                rows={4}
                                placeholder='Message'
                                className='w-full resize-none border-b border-coffee/15 bg-transparent py-4 text-sm transition-colors placeholder:text-coffee/40 focus:border-terracotta focus:outline-none'
                            />
                        </label>
                        <button
                            type='submit'
                            disabled={submitting}
                            className='mt-6 w-full rounded-full bg-coffee py-4 text-xs font-medium uppercase tracking-widest text-cream transition-transform active:scale-95 disabled:opacity-60'
                        >
                            {submitting ? 'Sending…' : 'Send message'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
