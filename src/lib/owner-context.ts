// Helper to read the Clerk session token on the client and pass it to server fns.
import { useAuth } from '@clerk/clerk-react';

export function useOwnerToken() {
    const { getToken } = useAuth();
    return async () => {
        const t = await getToken();
        if (!t) throw new Error('Not signed in');
        return t;
    };
}
