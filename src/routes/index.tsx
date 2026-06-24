import { createFileRoute } from '@tanstack/react-router';
import { SiteLayout } from '@/components/site-layout';
import { Hero } from '@/components/hero';
import { MenuPreview } from '@/components/menu-preview';
import { AboutBlock } from '@/components/about-block';
import { Gallery } from '@/components/gallery';
import { Reviews } from '@/components/reviews';
import { Toaster } from '@/components/ui/sonner';

export const Route = createFileRoute('/')({
    head: () => ({
        meta: [
            { title: 'KAPEHAN — Tara kape tayo' },
            {
                name: 'description',
                content:
                    'A cozy Makati coffee shop serving small-batch Philippine beans, hand-laminated pastries, and slow mornings worth lingering for.'
            },
            { property: 'og:title', content: 'KAPEHAN — Tara kape tayo' },
            {
                property: 'og:description',
                content:
                    'A cozy Makati coffee shop serving small-batch Philippine beans, hand-laminated pastries, and slow mornings worth lingering for.'
            }
        ]
    }),
    component: Index
});

function Index() {
    return (
        <SiteLayout>
            <Hero />
            <MenuPreview />
            <AboutBlock compact />
            <Gallery variant='scroll' />
            <Reviews />
            <Toaster />
        </SiteLayout>
    );
}
