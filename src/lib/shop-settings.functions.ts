import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

const SettingsInput = z.object({
    token: z.string().min(1),
    shop_name: z.string().trim().min(1).max(80),
    tagline: z.string().trim().max(160),
    address: z.string().trim().max(240),
    phone: z.string().trim().max(40),
    hours_mon_fri: z.string().trim().max(80),
    hours_sat: z.string().trim().max(80),
    hours_sun: z.string().trim().max(80)
});

export const getShopSettings = createServerFn({ method: 'GET' }).handler(
    async () => {
        const { createClient } = await import('@supabase/supabase-js');
        const sb = createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_PUBLISHABLE_KEY!,
            { auth: { persistSession: false, autoRefreshToken: false } }
        );
        const { data, error } = await sb
            .from('shop_settings')
            .select('*')
            .eq('is_singleton', true)
            .maybeSingle();
        if (error) throw new Error(error.message);
        return data;
    }
);

export const updateShopSettings = createServerFn({ method: 'POST' })
    .inputValidator(d => SettingsInput.parse(d))
    .handler(async ({ data }) => {
        const { requireClerkOwner } = await import('@/lib/clerk-auth.server');
        await requireClerkOwner(data.token);
        const { supabaseAdmin } =
            await import('@/integrations/supabase/client.server');
        const { token: _t, ...payload } = data;
        const { error } = await supabaseAdmin
            .from('shop_settings')
            .update(payload)
            .eq('is_singleton', true);
        if (error) throw new Error(error.message);
        return { ok: true };
    });
