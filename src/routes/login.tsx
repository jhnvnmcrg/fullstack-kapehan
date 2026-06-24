import { createFileRoute, Link } from '@tanstack/react-router';
import { SignIn, SignedIn, SignedOut } from '@clerk/clerk-react';
import { Coffee } from 'lucide-react';
import { Navigate } from '@tanstack/react-router';
import interior from '@/assets/interior.jpg';

export const Route = createFileRoute('/login')({
    head: () => ({
        meta: [
            { title: 'Owner sign in — KAPEHAN' },
            {
                name: 'description',
                content: 'Sign in to the KAPEHAN owner dashboard.'
            },
            { name: 'robots', content: 'noindex' }
        ]
    }),
    component: LoginPage
});

function LoginPage() {
    return (
        <main className='min-h-screen bg-cream text-coffee'>
            <SignedIn>
                <Navigate to='/dashboard' />
            </SignedIn>
            <div className='grid min-h-screen lg:grid-cols-2'>
                <aside className='relative hidden overflow-hidden lg:block'>
                    <img
                        src={interior}
                        alt='Inside the KAPEHAN coffee bar'
                        className='absolute inset-0 h-full w-full object-cover'
                    />
                    <div className='absolute inset-0 bg-gradient-to-br from-coffee/80 via-coffee/40 to-transparent' />
                    <div className='relative flex h-full flex-col justify-between p-10 text-cream'>
                        <Link
                            to='/'
                            className='inline-flex items-center gap-2 font-serif text-2xl tracking-tight'
                        >
                            <Coffee className='h-5 w-5' />
                            KAPEHAN
                        </Link>
                        <div className='max-w-sm'>
                            <p className='font-serif text-3xl leading-tight'>
                                “A small bar, a long table, and beans we pulled
                                at dawn.”
                            </p>
                            <p className='mt-3 text-sm text-cream/70'>
                                Owner workspace · Makati
                            </p>
                        </div>
                    </div>
                </aside>

                <section className='flex items-center justify-center px-6 py-12 sm:px-12'>
                    <div className='w-full max-w-sm animate-fade-up'>
                        <Link
                            to='/'
                            className='mb-8 inline-flex items-center gap-2 font-serif text-xl uppercase tracking-tight lg:hidden'
                        >
                            <Coffee className='h-4 w-4' />
                            Kapehan
                        </Link>
                        <div className='mb-6'>
                            <h1 className='font-serif text-3xl tracking-tight'>
                                Owner sign in
                            </h1>
                            <p className='mt-2 text-sm text-coffee/60'>
                                Manage the menu, gallery and reviews for
                                KAPEHAN.
                            </p>
                        </div>
                        <SignedOut>
                            <SignIn
                                routing='hash'
                                signUpUrl='/login'
                                forceRedirectUrl='/dashboard'
                                appearance={{
                                    elements: {
                                        rootBox: 'w-full',
                                        card: 'shadow-none border border-coffee/10 bg-cream',
                                        headerTitle: 'font-serif text-coffee',
                                        headerSubtitle: 'text-coffee/60',
                                        socialButtonsBlockButton:
                                            'border-coffee/15 text-coffee hover:bg-coffee/5',
                                        formButtonPrimary:
                                            'bg-terracotta hover:bg-terracotta/90 text-cream normal-case',
                                        footerActionLink:
                                            'text-terracotta hover:text-terracotta/80'
                                    },
                                    variables: {
                                        colorPrimary: 'oklch(0.55 0.13 40)',
                                        fontFamily:
                                            'Inter Variable, ui-sans-serif, system-ui'
                                    }
                                }}
                            />
                        </SignedOut>
                    </div>
                </section>
            </div>
        </main>
    );
}
