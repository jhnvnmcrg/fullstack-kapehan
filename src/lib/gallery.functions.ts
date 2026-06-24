import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

const GalleryInput = z.object({
    token: z.string().min(1),
    id: z.string().uuid().optional(),
    image_url: z.string().url(),
    image_public_id: z.string().nullable().optional(),
    caption: z.string().max(280).optional().nullable(),
    sort_order: z.number().int().min(0).max(9999).default(0)
});

export const listGallery = createServerFn({ method: 'GET' }).handler(
    async () => {
        const { createClient } = await import('@supabase/supabase-js');
        const sb = createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_PUBLISHABLE_KEY!,
            { auth: { persistSession: false, autoRefreshToken: false } }
        );
        const { data, error } = await sb
            .from('gallery_images')
            .select('*')
            .order('sort_order', { ascending: true })
            .order('created_at', { ascending: false });
        if (error) throw new Error(error.message);
        return data ?? [];
    }
);

export const saveGalleryImage = createServerFn({ method: 'POST' })
    .inputValidator(d => GalleryInput.parse(d))
    .handler(async ({ data }) => {
        const { requireClerkOwner } = await import('@/lib/clerk-auth.server');
        await requireClerkOwner(data.token);
        const { supabaseAdmin } =
            await import('@/integrations/supabase/client.server');
        const { token: _t, id, ...rest } = data;
        if (id) {
            const { error } = await supabaseAdmin
                .from('gallery_images')
                .update(rest)
                .eq('id', id);
            if (error) throw new Error(error.message);
        } else {
            const { error } = await supabaseAdmin
                .from('gallery_images')
                .insert(rest);
            if (error) throw new Error(error.message);
        }
        return { ok: true };
    });

export const deleteGalleryImage = createServerFn({ method: 'POST' })
    .inputValidator(d =>
        z.object({ token: z.string(), id: z.string().uuid() }).parse(d)
    )
    .handler(async ({ data }) => {
        const { requireClerkOwner } = await import('@/lib/clerk-auth.server');
        await requireClerkOwner(data.token);
        const { supabaseAdmin } =
            await import('@/integrations/supabase/client.server');
        const { cloudinaryDelete } = await import('@/lib/cloudinary.server');
        const { data: row } = await supabaseAdmin
            .from('gallery_images')
            .select('image_public_id')
            .eq('id', data.id)
            .maybeSingle();
        const { error } = await supabaseAdmin
            .from('gallery_images')
            .delete()
            .eq('id', data.id);
        if (error) throw new Error(error.message);
        if (row?.image_public_id) await cloudinaryDelete(row.image_public_id);
        return { ok: true };
    });
