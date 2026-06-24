import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

const UploadInput = z.object({
    token: z.string().min(1),
    // base64 data URL, e.g. "data:image/jpeg;base64,..."
    dataUrl: z.string().min(64).max(15_000_000),
    folder: z.enum(['menu', 'gallery'])
});

export const uploadImage = createServerFn({ method: 'POST' })
    .inputValidator(d => UploadInput.parse(d))
    .handler(async ({ data }) => {
        const { requireClerkOwner } = await import('@/lib/clerk-auth.server');
        await requireClerkOwner(data.token);
        const { cloudinaryUpload } = await import('@/lib/cloudinary.server');
        return cloudinaryUpload(data.dataUrl, data.folder);
    });
