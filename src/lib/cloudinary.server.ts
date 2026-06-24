// Server-only Cloudinary helpers. Never imported from the client.
import crypto from 'node:crypto';

function env(name: string): string {
    const v = process.env[name];
    if (!v) throw new Error(`Missing env: ${name}`);
    return v;
}

function signParams(
    params: Record<string, string | number>,
    apiSecret: string
): string {
    const sorted = Object.keys(params)
        .sort()
        .map(k => `${k}=${params[k]}`)
        .join('&');
    return crypto
        .createHash('sha1')
        .update(sorted + apiSecret)
        .digest('hex');
}

export async function cloudinaryUpload(
    base64DataUrl: string,
    folder: string
): Promise<{ url: string; publicId: string }> {
    const cloudName = env('CLOUDINARY_CLOUD_NAME');
    const apiKey = env('CLOUDINARY_API_KEY');
    const apiSecret = env('CLOUDINARY_API_SECRET');

    const timestamp = Math.floor(Date.now() / 1000);
    const folderName = `fullstack-kapehan/${folder}`;
    const signature = signParams({ folder: folderName, timestamp }, apiSecret);

    const form = new FormData();
    form.append('file', base64DataUrl);
    form.append('api_key', apiKey);
    form.append('timestamp', String(timestamp));
    form.append('signature', signature);
    form.append('folder', folderName);

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: form }
    );
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Cloudinary upload failed: ${res.status} ${text}`);
    }
    const json = (await res.json()) as {
        secure_url: string;
        public_id: string;
    };
    return { url: json.secure_url, publicId: json.public_id };
}

export async function cloudinaryDelete(publicId: string): Promise<void> {
    if (!publicId) return;
    const cloudName = env('CLOUDINARY_CLOUD_NAME');
    const apiKey = env('CLOUDINARY_API_KEY');
    const apiSecret = env('CLOUDINARY_API_SECRET');

    const timestamp = Math.floor(Date.now() / 1000);
    const signature = signParams({ public_id: publicId, timestamp }, apiSecret);

    const form = new FormData();
    form.append('public_id', publicId);
    form.append('api_key', apiKey);
    form.append('timestamp', String(timestamp));
    form.append('signature', signature);

    await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
        method: 'POST',
        body: form
    });
    // Best-effort; swallow errors so DB delete still succeeds.
}
