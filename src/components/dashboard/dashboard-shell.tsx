import { useState } from 'react';
import { Link, Navigate } from '@tanstack/react-router';
import { SignedIn, SignedOut, useUser, useClerk } from '@clerk/clerk-react';
import {
    Coffee,
    FolderTree,
    Image as ImageIcon,
    LayoutDashboard,
    LogOut,
    Menu as MenuIcon,
    MessageSquareQuote,
    Search,
    Settings,
    X
} from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { OverviewPanel } from './overview-panel';
import { MenuItemsPanel } from './menu-items-panel';
import { CategoriesPanel } from './categories-panel';
import { GalleryPanel } from './gallery-panel';
import { ReviewsPanel } from './reviews-panel';
import { SettingsPanel } from './settings-panel';

export type SectionId =
    | 'overview'
    | 'menu'
    | 'categories'
    | 'gallery'
    | 'reviews'
    | 'settings';

const nav: {
    id: SectionId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
}[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'menu', label: 'Menu Items', icon: Coffee },
    { id: 'categories', label: 'Categories', icon: FolderTree },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'reviews', label: 'Reviews', icon: MessageSquareQuote },
    { id: 'settings', label: 'Settings', icon: Settings }
];

export function DashboardShell() {
    return (
        <>
            <SignedOut>
                <Navigate to='/login' />
            </SignedOut>
            <SignedIn>
                <DashboardInner />
            </SignedIn>
        </>
    );
}

function DashboardInner() {
    const [active, setActive] = useState<SectionId>('overview');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user } = useUser();
    const { signOut } = useClerk();

    const activeMeta = nav.find(n => n.id === active)!;
    const initials = (
        user?.firstName?.[0] ??
        user?.username?.[0] ??
        user?.primaryEmailAddress?.emailAddress?.[0] ??
        'K'
    ).toUpperCase();
    const displayName =
        user?.fullName ??
        user?.username ??
        user?.primaryEmailAddress?.emailAddress ??
        'Owner';

    return (
        <div className='min-h-screen bg-clay/40 text-coffee'>
            <Toaster />
            <header className='sticky top-0 z-30 flex h-14 items-center justify-between border-b border-coffee/10 bg-cream/90 px-4 backdrop-blur lg:hidden'>
                <button
                    aria-label='Open menu'
                    onClick={() => setSidebarOpen(true)}
                    className='grid h-9 w-9 place-items-center rounded-full border border-coffee/10'
                >
                    <MenuIcon className='h-4 w-4' />
                </button>
                <Link
                    to='/'
                    className='font-serif text-lg uppercase tracking-tight'
                >
                    Kapehan
                </Link>
                <div className='grid h-9 w-9 place-items-center rounded-full bg-terracotta/90 text-sm font-medium text-cream'>
                    {initials}
                </div>
            </header>

            <div className='mx-auto flex max-w-screen-2xl'>
                <aside
                    className={[
                        'fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-coffee/10 bg-cream transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0',
                        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    ].join(' ')}
                >
                    <div className='flex h-16 items-center justify-between px-6'>
                        <Link
                            to='/'
                            className='inline-flex items-center gap-2 font-serif text-xl uppercase tracking-tight'
                        >
                            <Coffee className='h-4 w-4 text-terracotta' />{' '}
                            Kapehan
                        </Link>
                        <button
                            aria-label='Close menu'
                            onClick={() => setSidebarOpen(false)}
                            className='grid h-9 w-9 place-items-center rounded-full border border-coffee/10 lg:hidden'
                        >
                            <X className='h-4 w-4' />
                        </button>
                    </div>
                    <div className='px-4 pb-2 text-[11px] font-medium uppercase tracking-widest text-coffee/40'>
                        Workspace
                    </div>
                    <nav className='flex-1 space-y-1 px-3'>
                        {nav.map(n => {
                            const Icon = n.icon;
                            const isActive = active === n.id;
                            return (
                                <button
                                    key={n.id}
                                    onClick={() => {
                                        setActive(n.id);
                                        setSidebarOpen(false);
                                    }}
                                    className={[
                                        'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition',
                                        isActive
                                            ? 'bg-coffee text-cream'
                                            : 'text-coffee/75 hover:bg-coffee/5 hover:text-coffee'
                                    ].join(' ')}
                                >
                                    <Icon className='h-4 w-4' /> {n.label}
                                </button>
                            );
                        })}
                    </nav>

                    <div className='border-t border-coffee/10 p-4'>
                        <div className='flex items-center gap-3 rounded-lg p-2'>
                            <div className='grid h-10 w-10 place-items-center rounded-full bg-terracotta text-cream'>
                                {initials}
                            </div>
                            <div className='min-w-0 flex-1'>
                                <div className='truncate text-sm font-medium'>
                                    {displayName}
                                </div>
                                <div className='truncate text-xs text-coffee/55'>
                                    Owner
                                </div>
                            </div>
                            <button
                                aria-label='Sign out'
                                onClick={async () => {
                                    await signOut({ redirectUrl: '/' });
                                    toast.success('Signed out');
                                }}
                                className='grid h-8 w-8 place-items-center rounded-md text-coffee/55 hover:bg-coffee/5 hover:text-coffee'
                            >
                                <LogOut className='h-4 w-4' />
                            </button>
                        </div>
                    </div>
                </aside>

                {sidebarOpen && (
                    <div
                        className='fixed inset-0 z-30 bg-coffee/40 lg:hidden'
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                <main className='min-w-0 flex-1'>
                    <div className='hidden h-16 items-center justify-between border-b border-coffee/10 bg-cream/70 px-8 backdrop-blur lg:flex'>
                        <div>
                            <div className='text-[11px] font-medium uppercase tracking-widest text-coffee/40'>
                                Dashboard
                            </div>
                            <h1 className='font-serif text-xl tracking-tight'>
                                {activeMeta.label}
                            </h1>
                        </div>
                        <div className='flex items-center gap-3'>
                            <div className='relative'>
                                <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-coffee/40' />
                                <input
                                    placeholder='Search…'
                                    className='h-9 w-64 rounded-full border border-coffee/10 bg-cream pl-9 pr-3 text-sm outline-none focus:border-terracotta'
                                />
                            </div>
                            <Link
                                to='/'
                                className='rounded-full border border-coffee/10 px-3 py-1.5 text-xs text-coffee/70 hover:border-coffee/30'
                            >
                                View site
                            </Link>
                        </div>
                    </div>

                    <div className='px-5 py-6 sm:px-8 sm:py-8'>
                        {active === 'overview' && (
                            <OverviewPanel onJump={s => setActive(s)} />
                        )}
                        {active === 'menu' && <MenuItemsPanel />}
                        {active === 'categories' && <CategoriesPanel />}
                        {active === 'gallery' && <GalleryPanel />}
                        {active === 'reviews' && <ReviewsPanel />}
                        {active === 'settings' && <SettingsPanel />}
                    </div>
                </main>
            </div>
        </div>
    );
}
