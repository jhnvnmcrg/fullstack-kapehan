import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { toast } from 'sonner';
import { listPublishedReviews, submitReview } from '@/lib/reviews.functions';

export function Reviews({ full = false }: { full?: boolean }) {
    const q = useQuery({
        queryKey: ['reviews-public'],
        queryFn: useServerFn(listPublishedReviews)
    });
    const reviews = q.data ?? [];
    const [i, setI] = useState(0);
    const r = reviews[i] ?? null;

    return (
        <section className='bg-coffee py-20 text-cream md:py-28'>
            <div className='mx-auto max-w-screen-xl px-6'>
                <div className='space-y-6'>
                    <span className='text-xs font-medium uppercase tracking-[0.2em] text-terracotta'>
                        Guest voices
                    </span>
                    {full && (
                        <h1 className='font-serif text-4xl font-medium tracking-tight md:text-6xl'>
                            Reviews
                        </h1>
                    )}

                    {reviews.length === 0 ? (
                        <p className='text-cream/60 text-sm'>
                            No reviews yet — be the first to share yours.
                        </p>
                    ) : full ? (
                        <div className='grid grid-cols-1 gap-10 pt-6 md:grid-cols-3'>
                            {reviews.map(rv => (
                                <figure key={rv.id} className='space-y-4'>
                                    <div className='flex gap-1 text-terracotta'>
                                        {'★'.repeat(rv.rating)}
                                    </div>
                                    <blockquote className='text-balance font-serif text-xl font-medium leading-snug'>
                                        &ldquo;{rv.body}&rdquo;
                                    </blockquote>
                                    <figcaption className='text-sm text-cream/60'>
                                        — {rv.author}
                                    </figcaption>
                                </figure>
                            ))}
                        </div>
                    ) : r ? (
                        <>
                            <div className='flex gap-1 text-terracotta'>
                                {'★'.repeat(r.rating)}
                            </div>
                            <blockquote
                                key={i}
                                className='max-w-3xl text-balance font-serif text-2xl font-medium leading-snug animate-fade-up md:text-3xl'
                            >
                                &ldquo;{r.body}&rdquo;
                            </blockquote>
                            <cite className='block not-italic text-sm text-cream/60'>
                                — {r.author}
                            </cite>
                            <div className='flex gap-2 pt-4'>
                                {reviews.map((_, idx) => (
                                    <button
                                        key={idx}
                                        aria-label={`Review ${idx + 1}`}
                                        onClick={() => setI(idx)}
                                        className={`h-1.5 w-8 rounded-full transition-colors ${
                                            idx === i
                                                ? 'bg-terracotta'
                                                : 'bg-cream/15'
                                        }`}
                                    />
                                ))}
                            </div>
                        </>
                    ) : null}

                    {full && <ReviewSubmitForm />}
                </div>
            </div>
        </section>
    );
}

function ReviewSubmitForm() {
    const qc = useQueryClient();
    const submit = useServerFn(submitReview);
    const [form, setForm] = useState({ author: '', rating: 5, body: '' });
    const mut = useMutation({
        mutationFn: () => submit({ data: form }),
        onSuccess: () => {
            toast.success('Thanks! Your review will appear once approved.');
            setForm({ author: '', rating: 5, body: '' });
            qc.invalidateQueries({ queryKey: ['reviews-public'] });
        },
        onError: e => toast.error((e as Error).message)
    });

    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                if (form.author.trim().length < 1)
                    return toast.error('Add your name');
                if (form.body.trim().length < 5)
                    return toast.error('Tell us a little more');
                mut.mutate();
            }}
            className='mt-10 grid gap-3 rounded-2xl border border-cream/15 bg-cream/5 p-6 max-w-2xl'
        >
            <h3 className='font-serif text-xl text-cream'>Leave a review</h3>
            <input
                placeholder='Your name'
                value={form.author}
                onChange={e => setForm({ ...form, author: e.target.value })}
                className='h-10 rounded-lg bg-cream/10 px-3 text-sm text-cream placeholder:text-cream/40 outline-none focus:bg-cream/15'
            />
            <select
                value={form.rating}
                onChange={e =>
                    setForm({ ...form, rating: Number(e.target.value) })
                }
                className='h-10 rounded-lg bg-cream/10 px-3 text-sm text-cream outline-none focus:bg-cream/15'
            >
                {[5, 4, 3, 2, 1].map(n => (
                    <option key={n} value={n} className='text-coffee'>
                        {'★'.repeat(n)} ({n})
                    </option>
                ))}
            </select>
            <textarea
                rows={4}
                placeholder='What did you enjoy?'
                value={form.body}
                onChange={e => setForm({ ...form, body: e.target.value })}
                className='rounded-lg bg-cream/10 px-3 py-2 text-sm text-cream placeholder:text-cream/40 outline-none focus:bg-cream/15'
            />
            <button
                type='submit'
                disabled={mut.isPending}
                className='inline-flex w-fit items-center rounded-full bg-terracotta px-4 py-2 text-sm font-medium text-cream hover:-translate-y-px disabled:opacity-60'
            >
                {mut.isPending ? 'Submitting…' : 'Submit review'}
            </button>
        </form>
    );
}
