import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

const ItemInput = z.object({
    token: z.string().min(1),
    id: z.string().uuid().optional(),
    category_id: z.string().uuid().nullable().optional(),
    name: z.string().min(1).max(120),
    description: z.string().max(800).optional().nullable(),
    price: z.number().min(0).max(100000),
    image_url: z.string().url().nullable().optional(),
    image_public_id: z.string().nullable().optional(),
    is_featured: z.boolean().default(false),
    is_available: z.boolean().default(true),
    sort_order: z.number().int().min(0).max(9999).default(0)
});

export const listMenuItems = createServerFn({ method: 'GET' }).handler(
    async () => {
        const { createClient } = await import('@supabase/supabase-js');
        const sb = createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_PUBLISHABLE_KEY!,
            { auth: { persistSession: false, autoRefreshToken: false } }
        );
        const { data, error } = await sb
            .from('menu_items')
            .select('*, menu_categories(id,name,slug)')
            .order('sort_order', { ascending: true })
            .order('created_at', { ascending: false });
        if (error) throw new Error(error.message);
        return data ?? [];
    }
);

export const saveMenuItem = createServerFn({ method: 'POST' })
    .inputValidator(d => ItemInput.parse(d))
    .handler(async ({ data }) => {
        const { requireClerkOwner } = await import('@/lib/clerk-auth.server');
        await requireClerkOwner(data.token);
        const { supabaseAdmin } =
            await import('@/integrations/supabase/client.server');
        const { token: _t, id, ...rest } = data;
        if (id) {
            const { error } = await supabaseAdmin
                .from('menu_items')
                .update(rest)
                .eq('id', id);
            if (error) throw new Error(error.message);
        } else {
            const { error } = await supabaseAdmin
                .from('menu_items')
                .insert(rest);
            if (error) throw new Error(error.message);
        }
        return { ok: true };
    });

export const deleteMenuItem = createServerFn({ method: 'POST' })
    .inputValidator(d =>
        z.object({ token: z.string(), id: z.string().uuid() }).parse(d)
    )
    .handler(async ({ data }) => {
        const { requireClerkOwner } = await import('@/lib/clerk-auth.server');
        await requireClerkOwner(data.token);
        const { supabaseAdmin } =
            await import('@/integrations/supabase/client.server');
        const { cloudinaryDelete } = await import('@/lib/cloudinary.server');
        // Fetch publicId so we can clean up the image too.
        const { data: row } = await supabaseAdmin
            .from('menu_items')
            .select('image_public_id')
            .eq('id', data.id)
            .maybeSingle();
        const { error } = await supabaseAdmin
            .from('menu_items')
            .delete()
            .eq('id', data.id);
        if (error) throw new Error(error.message);
        if (row?.image_public_id) await cloudinaryDelete(row.image_public_id);
        return { ok: true };
    });
