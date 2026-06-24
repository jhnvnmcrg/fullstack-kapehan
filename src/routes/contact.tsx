import { createFileRoute } from '@tanstack/react-router';
import { SiteLayout } from '@/components/site-layout';
import { Contact } from '@/components/contact';
import { Toaster } from '@/components/ui/sonner';

export const Route = createFileRoute('/contact')({
    head: () => ({
        meta: [
            { title: 'Contact — KAPEHAN' },
            {
                name: 'description',
                content:
                    'Visit Kapehan at 122 Legaspi Street, Makati. Hours, directions, and a way to say hello.'
            },
            { property: 'og:title', content: 'Contact — KAPEHAN' },
            {
                property: 'og:description',
                content:
                    'Visit Kapehan at 122 Legaspi Street, Makati. Hours, directions, and a way to say hello.'
            }
        ]
    }),
    component: () => (
        <SiteLayout>
            <Contact full />
            <Toaster />
        </SiteLayout>
    )
});
