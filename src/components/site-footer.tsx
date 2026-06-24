import { Link } from '@tanstack/react-router';

export function SiteFooter() {
    return (
        <footer className='border-t border-coffee/5 py-12'>
            <div className='mx-auto flex max-w-screen-xl flex-col items-center gap-6 px-6 text-center'>
                <Link
                    to='/'
                    className='font-serif text-lg font-semibold uppercase tracking-tight'
                >
                    Kapehan
                </Link>
                <p className='max-w-sm text-sm text-coffee/60'>
                    A neighborhood corner for slow mornings, deep conversations,
                    and beans roasted with Filipino heart.
                </p>
                <div className='flex gap-8 text-[10px] font-medium uppercase tracking-widest text-coffee/50'>
                    <a
                        href='https://instagram.com'
                        target='_blank'
                        rel='noreferrer'
                    >
                        Instagram
                    </a>
                    <a
                        href='https://facebook.com'
                        target='_blank'
                        rel='noreferrer'
                    >
                        Facebook
                    </a>
                    <a
                        href='https://open.spotify.com'
                        target='_blank'
                        rel='noreferrer'
                    >
                        Spotify
                    </a>
                </div>
                <p className='text-[10px] italic uppercase tracking-tight text-coffee/40'>
                    Slow roasted in South Cotabato &bull; ©{' '}
                    {new Date().getFullYear()} Kapehan Coffee Co.
                </p>
            </div>
        </footer>
    );
}
