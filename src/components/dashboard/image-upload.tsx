import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { useServerFn } from '@tanstack/react-start';
import { Upload, X, Loader2 } from 'lucide-react';
import { uploadImage } from '@/lib/cloudinary.functions';
import { useOwnerToken } from '@/lib/owner-context';

type Props = {
    value?: string | null;
    onChange: (image: { url: string; publicId: string } | null) => void;
    folder: 'menu' | 'gallery';
    aspect?: string;
};

async function fileToDataUrl(file: File): Promise<string> {
    return new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result as string);
        r.onerror = rej;
        r.readAsDataURL(file);
    });
}

export function ImageUpload({
    value,
    onChange,
    folder,
    aspect = 'aspect-square'
}: Props) {
    const upload = useServerFn(uploadImage);
    const getToken = useOwnerToken();
    const [busy, setBusy] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    async function pick(file?: File | null) {
        if (!file) return;
        if (!file.type.startsWith('image/'))
            return toast.error('Please pick an image');
        if (file.size > 8 * 1024 * 1024)
            return toast.error('Image must be under 8 MB');
        setBusy(true);
        try {
            const dataUrl = await fileToDataUrl(file);
            const token = await getToken();
            const result = await upload({ data: { token, dataUrl, folder } });
            onChange({ url: result.url, publicId: result.publicId });
            toast.success('Image uploaded');
        } catch (e) {
            toast.error((e as Error).message);
        } finally {
            setBusy(false);
        }
    }

    return (
        <div>
            <input
                ref={inputRef}
                type='file'
                accept='image/*'
                className='hidden'
                onChange={e => pick(e.target.files?.[0])}
            />
            {value ? (
                <div
                    className={`relative ${aspect} overflow-hidden rounded-lg bg-clay`}
                >
                    <img
                        src={value}
                        alt=''
                        className='h-full w-full object-cover'
                    />
                    <button
                        type='button'
                        onClick={() => onChange(null)}
                        className='absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-coffee/80 text-cream hover:bg-coffee'
                        aria-label='Remove image'
                    >
                        <X className='h-3.5 w-3.5' />
                    </button>
                    <button
                        type='button'
                        onClick={() => inputRef.current?.click()}
                        className='absolute bottom-2 right-2 rounded-full bg-cream/95 px-3 py-1 text-xs font-medium text-coffee hover:bg-cream'
                    >
                        Replace
                    </button>
                </div>
            ) : (
                <button
                    type='button'
                    onClick={() => inputRef.current?.click()}
                    disabled={busy}
                    className={`grid w-full ${aspect} place-items-center rounded-lg border-2 border-dashed border-coffee/20 text-coffee/55 transition hover:border-terracotta hover:text-terracotta disabled:opacity-60`}
                >
                    {busy ? (
                        <span className='flex flex-col items-center gap-2 text-xs'>
                            <Loader2 className='h-5 w-5 animate-spin' />{' '}
                            Uploading…
                        </span>
                    ) : (
                        <span className='flex flex-col items-center gap-2 text-xs'>
                            <Upload className='h-5 w-5' /> Click to upload
                        </span>
                    )}
                </button>
            )}
        </div>
    );
}
