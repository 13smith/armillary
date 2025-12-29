import { findUpcomingAlignments } from '@/lib/solar-system/astronomy';
import { useMemo } from 'react';

export function useAlignments(date: Date, daysAhead: number = 90) {
    const dateDay = Math.floor(date.getTime() / (24 * 60 * 60 * 1000));

    return useMemo(() => {
        return findUpcomingAlignments(date, daysAhead);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateDay, daysAhead]);
}
