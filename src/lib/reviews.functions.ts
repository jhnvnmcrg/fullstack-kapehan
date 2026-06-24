import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

function publicClient() {
    // Lazy-imported so this file stays client-graph-safe.
    return import('@supabase/supabase-js').then(({ createClient }) =>
        createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_PUBLISHABLE_KEY!,
            { auth: { persistSession: false, autoRefreshToken: false } }
        )
    );
}

/** Public site: only published reviews. */
export const listPublishedReviews = createServerFn({ method: 'GET' }).handler(
    async () => {
        const sb = await publicClient();
        const { data, error } = await sb
            .from('reviews')
            .select('*')
            .eq('is_published', true)
            .order('is_featured', { ascending: false })
            .order('created_at', { ascending: false });
        if (error) throw new Error(error.message);
        return data ?? [];
    }
);

/** Owner: all reviews. */
export const listAllReviews = createServerFn({ method: 'POST' })
    .inputValidator(d => z.object({ token: z.string() }).parse(d))
    .handler(async ({ data }) => {
        const { requireClerkOwner } = await import('@/lib/clerk-auth.server');
        await requireClerkOwner(data.token);
        const { supabaseAdmin } =
            await import('@/integrations/supabase/client.server');
        const { data: rows, error } = await supabaseAdmin
            .from('reviews')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw new Error(error.message);
        return rows ?? [];
    });

/** Public submission — always unpublished/unfeatured. */
export const submitReview = createServerFn({ method: 'POST' })
    .inputValidator(d =>
        z
            .object({
                author: z.string().trim().min(1).max(80),
                rating: z.number().int().min(1).max(5),
                body: z.string().trim().min(5).max(1000)
            })
            .parse(d)
    )
    .handler(async ({ data }) => {
        const sb = await publicClient();
        const { error } = await sb.from('reviews').insert({
            author: data.author,
            rating: data.rating,
            body: data.body,
            is_published: false,
            is_featured: false
        });
        if (error) throw new Error(error.message);
        return { ok: true };
    });

export const updateReview = createServerFn({ method: 'POST' })
    .inputValidator(d =>
        z
            .object({
                token: z.string(),
                id: z.string().uuid(),
                is_published: z.boolean().optional(),
                is_featured: z.boolean().optional()
            })
            .parse(d)
    )
    .handler(async ({ data }) => {
        const { requireClerkOwner } = await import('@/lib/clerk-auth.server');
        await requireClerkOwner(data.token);
        const { supabaseAdmin } =
            await import('@/integrations/supabase/client.server');
        const patch: { is_published?: boolean; is_featured?: boolean } = {};
        if (typeof data.is_published === 'boolean')
            patch.is_published = data.is_published;
        if (typeof data.is_featured === 'boolean')
            patch.is_featured = data.is_featured;
        const { error } = await supabaseAdmin
            .from('reviews')
            .update(patch)
            .eq('id', data.id);
        if (error) throw new Error(error.message);
        return { ok: true };
    });

export const deleteReview = createServerFn({ method: 'POST' })
    .inputValidator(d =>
        z.object({ token: z.string(), id: z.string().uuid() }).parse(d)
    )
    .handler(async ({ data }) => {
        const { requireClerkOwner } = await import('@/lib/clerk-auth.server');
        await requireClerkOwner(data.token);
        const { supabaseAdmin } =
            await import('@/integrations/supabase/client.server');
        const { error } = await supabaseAdmin
            .from('reviews')
            .delete()
            .eq('id', data.id);
        if (error) throw new Error(error.message);
        return { ok: true };
    });
