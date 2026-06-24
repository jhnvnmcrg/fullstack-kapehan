import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Menu, X } from 'lucide-react';

const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/menu', label: 'Menu' },
    { to: '/about', label: 'About' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/reviews', label: 'Reviews' },
    { to: '/contact', label: 'Contact' }
] as const;

export function SiteHeader() {
    const [open, setOpen] = useState(false);

    return (
        <header className='sticky top-0 z-50 border-b border-coffee/5 bg-cream/85 backdrop-blur-md'>
            <nav className='mx-auto flex h-14 max-w-screen-xl items-center justify-between px-6'>
                <Link
                    to='/'
                    className='font-serif text-xl font-semibold uppercase tracking-tight'
                >
                    Kapehan
                </Link>

                <div className='hidden items-center gap-8 md:flex'>
                    {navLinks.map(l => (
                        <Link
                            key={l.to}
                            to={l.to}
                            className='text-sm text-coffee/70 transition-colors hover:text-coffee'
                            activeProps={{
                                className: 'text-coffee font-medium'
                            }}
                            activeOptions={{ exact: l.to === '/' }}
                        >
                            {l.label}
                        </Link>
                    ))}
                </div>

                <div className='flex items-center gap-2'>
                    <Link
                        to='/menu'
                        className='hidden rounded-full bg-terracotta px-4 py-1.5 text-sm font-medium text-cream shadow-sm ring-1 ring-terracotta transition-transform hover:-translate-y-px active:translate-y-0 md:inline-flex'
                    >
                        Order
                    </Link>
                    <button
                        type='button'
                        aria-label='Toggle menu'
                        onClick={() => setOpen(v => !v)}
                        className='grid h-9 w-9 place-items-center rounded-full border border-coffee/10 md:hidden'
                    >
                        {open ? (
                            <X className='h-4 w-4' />
                        ) : (
                            <Menu className='h-4 w-4' />
                        )}
                    </button>
                </div>
            </nav>

            {open && (
                <div className='border-t border-coffee/5 bg-cream md:hidden'>
                    <ul className='mx-auto flex max-w-screen-xl flex-col px-6 py-4'>
                        {navLinks.map(l => (
                            <li key={l.to}>
                                <Link
                                    to={l.to}
                                    onClick={() => setOpen(false)}
                                    className='block py-3 font-serif text-2xl tracking-tight'
                                    activeProps={{
                                        className: 'text-terracotta'
                                    }}
                                    activeOptions={{ exact: l.to === '/' }}
                                >
                                    {l.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </header>
    );
}
