import {
    HeadContent,
    Scripts,
    createRootRouteWithContext
} from '@tanstack/react-router';

import ClerkProvider from '../integrations/clerk/provider';

import appCss from '../styles.css?url';

import type { QueryClient } from '@tanstack/react-query';

interface MyRouterContext {
    queryClient: QueryClient;
}

function NotFoundComponent() {
    return (
        <div className='flex min-h-screen items-center justify-center bg-background px-4'>
            <div className='max-w-md text-center'>
                <h1 className='text-7xl font-bold text-foreground'>404</h1>
                <h2 className='mt-4 text-xl font-semibold text-foreground'>
                    Page not found
                </h2>
                <p className='mt-2 text-sm text-muted-foreground'>
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <div className='mt-6'>
                    <Link
                        to='/'
                        className='inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90'
                    >
                        Go home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
    head: () => ({
        meta: [
            {
                charSet: 'utf-8'
            },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1'
            },
            {
                title: 'KAPEHAN — Tara kape tayo'
            },
            {
                name: 'description',
                content:
                    'A cozy Makati coffee shop serving small-batch Philippine beans and slow mornings.'
            },
            { name: 'author', content: 'Kapehan Coffee Co.' },
            { property: 'og:title', content: 'KAPEHAN — Tara kape tayo' },
            {
                property: 'og:description',
                content:
                    'A cozy Makati coffee shop serving small-batch Philippine beans and slow mornings.'
            },
            { property: 'og:type', content: 'website' },
            { name: 'twitter:card', content: 'summary' },
            { name: 'twitter:site', content: '@kapehan' }
        ],
        links: [
            {
                rel: 'stylesheet',
                href: appCss
            }
        ]
    }),
    shellComponent: RootDocument,
    notFoundComponent: NotFoundComponent
});

function RootDocument({ children }: { children: React.ReactNode }) {
    return (
        <html lang='en'>
            <head>
                <HeadContent />
            </head>
            <body>
                <ClerkProvider>{children}</ClerkProvider>
                <Scripts />
            </body>
        </html>
    );
}
