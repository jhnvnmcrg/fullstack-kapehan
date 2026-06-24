import { createFileRoute } from '@tanstack/react-router';
import { SiteLayout } from '@/components/site-layout';
import { Reviews } from '@/components/reviews';

export const Route = createFileRoute('/reviews')({
    head: () => ({
        meta: [
            { title: 'Reviews — KAPEHAN' },
            {
                name: 'description',
                content:
                    'What guests are saying about Kapehan — slow mornings, strong barako, and Sunday rituals.'
            },
            { property: 'og:title', content: 'Reviews — KAPEHAN' },
            {
                property: 'og:description',
                content:
                    'What guests are saying about Kapehan — slow mornings, strong barako, and Sunday rituals.'
            }
        ]
    }),
    component: () => (
        <SiteLayout>
            <Reviews full />
        </SiteLayout>
    )
});
