import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { toast } from 'sonner';
import { PanelShell, btnPrimary, fieldClass } from './ui';
import {
    getShopSettings,
    updateShopSettings
} from '@/lib/shop-settings.functions';
import { useOwnerToken } from '@/lib/owner-context';

type FormState = {
    shop_name: string;
    tagline: string;
    address: string;
    phone: string;
    hours_mon_fri: string;
    hours_sat: string;
    hours_sun: string;
};

const EMPTY: FormState = {
    shop_name: '',
    tagline: '',
    address: '',
    phone: '',
    hours_mon_fri: '',
    hours_sat: '',
    hours_sun: ''
};

function Card({
    title,
    children
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className='rounded-2xl border border-coffee/10 bg-cream p-6'>
            <h3 className='font-serif text-xl tracking-tight'>{title}</h3>
            <div className='mt-4 space-y-3'>{children}</div>
        </div>
    );
}

function SettingInput({
    label,
    value,
    onChange
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <label className='block'>
            <span className='text-xs font-medium uppercase tracking-wider text-coffee/55'>
                {label}
            </span>
            <input
                value={value}
                onChange={e => onChange(e.target.value)}
                className={`mt-1.5 ${fieldClass}`}
            />
        </label>
    );
}

export function SettingsPanel() {
    const qc = useQueryClient();
    const fetchSettings = useServerFn(getShopSettings);
    const saveSettings = useServerFn(updateShopSettings);
    const getToken = useOwnerToken();

    const { data, isLoading } = useQuery({
        queryKey: ['shop_settings'],
        queryFn: () => fetchSettings()
    });

    const [form, setForm] = useState<FormState>(EMPTY);

    useEffect(() => {
        if (data) {
            setForm({
                shop_name: data.shop_name ?? '',
                tagline: data.tagline ?? '',
                address: data.address ?? '',
                phone: data.phone ?? '',
                hours_mon_fri: data.hours_mon_fri ?? '',
                hours_sat: data.hours_sat ?? '',
                hours_sun: data.hours_sun ?? ''
            });
        }
    }, [data]);

    const mutation = useMutation({
        mutationFn: async () => {
            const token = await getToken();
            return saveSettings({ data: { token, ...form } });
        },
        onSuccess: () => {
            toast.success('Settings saved');
            qc.invalidateQueries({ queryKey: ['shop_settings'] });
        },
        onError: (e: Error) => toast.error(e.message)
    });

    const set =
        <K extends keyof FormState>(k: K) =>
        (v: string) =>
            setForm(f => ({ ...f, [k]: v }));

    return (
        <PanelShell
            title='Settings'
            subtitle='Shop details and owner preferences.'
            action={
                <button
                    onClick={() => mutation.mutate()}
                    disabled={mutation.isPending || isLoading}
                    className={btnPrimary}
                >
                    {mutation.isPending ? 'Saving…' : 'Save changes'}
                </button>
            }
        >
            <div className='grid gap-6 lg:grid-cols-2'>
                <Card title='Shop profile'>
                    <SettingInput
                        label='Shop name'
                        value={form.shop_name}
                        onChange={set('shop_name')}
                    />
                    <SettingInput
                        label='Tagline'
                        value={form.tagline}
                        onChange={set('tagline')}
                    />
                    <SettingInput
                        label='Address'
                        value={form.address}
                        onChange={set('address')}
                    />
                    <SettingInput
                        label='Phone'
                        value={form.phone}
                        onChange={set('phone')}
                    />
                </Card>

                <Card title='Hours'>
                    <SettingInput
                        label='Mon — Fri'
                        value={form.hours_mon_fri}
                        onChange={set('hours_mon_fri')}
                    />
                    <SettingInput
                        label='Saturday'
                        value={form.hours_sat}
                        onChange={set('hours_sat')}
                    />
                    <SettingInput
                        label='Sunday'
                        value={form.hours_sun}
                        onChange={set('hours_sun')}
                    />
                </Card>

                <Card title='Owner account'>
                    <p className='text-sm text-coffee/65'>
                        Manage your name, email, and password from your Clerk
                        profile via the user button in the top bar.
                    </p>
                </Card>
            </div>
        </PanelShell>
    );
}
