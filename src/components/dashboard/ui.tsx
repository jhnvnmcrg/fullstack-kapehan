import type { ReactNode } from 'react';

export const fieldClass =
    'h-10 w-full rounded-lg border border-coffee/15 bg-cream px-3 text-sm outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20';

export const btnPrimary =
    'inline-flex items-center gap-2 rounded-full bg-terracotta px-4 py-2 text-sm font-medium text-cream shadow-sm transition hover:-translate-y-px disabled:opacity-60';

export const btnGhost =
    'inline-flex items-center gap-2 rounded-full border border-coffee/15 px-4 py-2 text-sm text-coffee/70 hover:border-coffee/30';

export function Field({
    label,
    children
}: {
    label: string;
    children: ReactNode;
}) {
    return (
        <label className='block'>
            <span className='text-xs font-medium uppercase tracking-wider text-coffee/55'>
                {label}
            </span>
            <div className='mt-1.5'>{children}</div>
        </label>
    );
}

export function PanelShell({
    title,
    subtitle,
    action,
    children
}: {
    title: string;
    subtitle: string;
    action?: ReactNode;
    children: ReactNode;
}) {
    return (
        <div className='space-y-6'>
            <div className='flex flex-wrap items-end justify-between gap-3'>
                <div>
                    <h2 className='font-serif text-3xl tracking-tight'>
                        {title}
                    </h2>
                    <p className='mt-1 text-sm text-coffee/55'>{subtitle}</p>
                </div>
                {action}
            </div>
            {children}
        </div>
    );
}

export function Badge({
    children,
    tone
}: {
    children: ReactNode;
    tone: 'sage' | 'terracotta' | 'coffee';
}) {
    const map = {
        sage: 'bg-sage/15 text-sage',
        terracotta: 'bg-terracotta/15 text-terracotta',
        coffee: 'bg-coffee/10 text-coffee'
    };
    return (
        <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${map[tone]}`}
        >
            {children}
        </span>
    );
}

export function IconBtn({
    children,
    label,
    onClick,
    danger,
    disabled
}: {
    children: ReactNode;
    label: string;
    onClick?: () => void;
    danger?: boolean;
    disabled?: boolean;
}) {
    return (
        <button
            type='button'
            aria-label={label}
            onClick={onClick}
            disabled={disabled}
            className={[
                'grid h-8 w-8 place-items-center rounded-md border border-coffee/10 bg-cream transition disabled:opacity-50',
                danger
                    ? 'hover:border-destructive/40 hover:text-destructive'
                    : 'hover:border-coffee/30'
            ].join(' ')}
        >
            {children}
        </button>
    );
}

export function EmptyState({ children }: { children: ReactNode }) {
    return (
        <div className='rounded-2xl border border-dashed border-coffee/15 bg-cream/40 px-6 py-10 text-center text-sm text-coffee/55'>
            {children}
        </div>
    );
}

export function useDashboardGuard() {
    // Place-holder used by panels — actual gating is at the route level via Clerk.
    return true;
}
