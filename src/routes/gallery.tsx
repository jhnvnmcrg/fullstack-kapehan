import { createFileRoute } from '@tanstack/react-router';
import { SiteLayout } from '@/components/site-layout';
import { Gallery } from '@/components/gallery';

export const Route = createFileRoute('/gallery')({
    head: () => ({
        meta: [
            { title: 'Gallery — KAPEHAN' },
            {
                name: 'description',
                content:
                    'A look inside Kapehan — the bar, the beans, the cups, the quiet corners.'
            },
            { property: 'og:title', content: 'Gallery — KAPEHAN' },
            {
                property: 'og:description',
                content:
                    'A look inside Kapehan — the bar, the beans, the cups, the quiet corners.'
            }
        ]
    }),
    component: () => (
        <SiteLayout>
            <Gallery variant='grid' />
        </SiteLayout>
    )
});
