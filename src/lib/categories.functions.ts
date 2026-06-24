import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

const CategoryInput = z.object({
    token: z.string().min(1),
    id: z.string().uuid().optional(),
    name: z.string().min(1).max(80),
    slug: z
        .string()
        .min(1)
        .max(80)
        .regex(/^[a-z0-9-]+$/),
    description: z.string().max(500).optional().nullable(),
    sort_order: z.number().int().min(0).max(9999).default(0)
});

export const listCategories = createServerFn({ method: 'GET' }).handler(
    async () => {
        const { createClient } = await import('@supabase/supabase-js');
        const sb = createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_PUBLISHABLE_KEY!,
            { auth: { persistSession: false, autoRefreshToken: false } }
        );
        const { data, error } = await sb
            .from('menu_categories')
            .select('*')
            .order('sort_order', { ascending: true });
        if (error) throw new Error(error.message);
        return data ?? [];
    }
);

export const saveCategory = createServerFn({ method: 'POST' })
    .inputValidator(d => CategoryInput.parse(d))
    .handler(async ({ data }) => {
        const { requireClerkOwner } = await import('@/lib/clerk-auth.server');
        await requireClerkOwner(data.token);
        const { supabaseAdmin } =
            await import('@/integrations/supabase/client.server');
        const payload = {
            name: data.name,
            slug: data.slug,
            description: data.description ?? null,
            sort_order: data.sort_order
        };
        if (data.id) {
            const { error } = await supabaseAdmin
                .from('menu_categories')
                .update(payload)
                .eq('id', data.id);
            if (error) throw new Error(error.message);
        } else {
            const { error } = await supabaseAdmin
                .from('menu_categories')
                .insert(payload);
            if (error) throw new Error(error.message);
        }
        return { ok: true };
    });

export const deleteCategory = createServerFn({ method: 'POST' })
    .inputValidator(d =>
        z.object({ token: z.string(), id: z.string().uuid() }).parse(d)
    )
    .handler(async ({ data }) => {
        const { requireClerkOwner } = await import('@/lib/clerk-auth.server');
        await requireClerkOwner(data.token);
        const { supabaseAdmin } =
            await import('@/integrations/supabase/client.server');
        const { error } = await supabaseAdmin
            .from('menu_categories')
            .delete()
            .eq('id', data.id);
        if (error) throw new Error(error.message);
        return { ok: true };
    });
