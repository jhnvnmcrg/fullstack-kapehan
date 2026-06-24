import { createFileRoute } from '@tanstack/react-router';
import { SiteLayout } from '@/components/site-layout';
import { MenuFull } from '@/components/menu-full';

export const Route = createFileRoute('/menu')({
    head: () => ({
        meta: [
            { title: 'Menu — KAPEHAN' },
            {
                name: 'description',
                content:
                    'Single-origin Philippine coffee, hand-laminated pastries, and savoury bites. Browse the full Kapehan menu.'
            },
            { property: 'og:title', content: 'Menu — KAPEHAN' },
            {
                property: 'og:description',
                content:
                    'Single-origin Philippine coffee, hand-laminated pastries, and savoury bites.'
            }
        ]
    }),
    component: () => (
        <SiteLayout>
            <MenuFull />
        </SiteLayout>
    )
});
