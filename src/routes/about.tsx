import { createFileRoute } from '@tanstack/react-router';
import { SiteLayout } from '@/components/site-layout';
import { AboutBlock } from '@/components/about-block';

export const Route = createFileRoute('/about')({
    head: () => ({
        meta: [
            { title: 'About — KAPEHAN' },
            {
                name: 'description',
                content:
                    'Founded in 2021 as a small Makati window, Kapehan is a corner devoted to the slow ritual of the cup and to Philippine coffee farmers.'
            },
            { property: 'og:title', content: 'About — KAPEHAN' },
            {
                property: 'og:description',
                content:
                    'A corner devoted to the slow ritual of the cup and to Philippine coffee farmers.'
            }
        ]
    }),
    component: () => (
        <SiteLayout>
            <AboutBlock />
        </SiteLayout>
    )
});
