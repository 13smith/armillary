import { useCallback } from 'react';

export function useInitials() {
    return useCallback((fullName: string): string => {
        const names = fullName.trim().split(' ');
        const firstName = names[0];
        const lastName = names[names.length - 1];

        if (names.length === 0 || !firstName) return '';
        if (names.length === 1) return firstName.charAt(0).toUpperCase();

        const firstInitial = firstName.charAt(0);
        const lastInitial = lastName?.charAt(0) ?? '';

        return `${firstInitial}${lastInitial}`.toUpperCase();
    }, []);
}
