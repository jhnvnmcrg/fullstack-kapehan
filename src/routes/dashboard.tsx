import { createFileRoute } from '@tanstack/react-router';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';

export const Route = createFileRoute('/dashboard')({
    head: () => ({
        meta: [
            { title: 'Owner dashboard — KAPEHAN' },
            {
                name: 'description',
                content: 'Manage menu, gallery and reviews for KAPEHAN.'
            },
            { name: 'robots', content: 'noindex' }
        ]
    }),
    component: DashboardShell
});
