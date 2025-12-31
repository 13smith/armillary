import type { Alignment } from '@/lib/solar-system/types';

interface AlignmentsPanelProps {
    alignments: Alignment[];
    currentDate: Date;
}

export function AlignmentsPanel({
    alignments,
    currentDate,
}: AlignmentsPanelProps) {
    const upcomingAlignments = alignments
        .filter((a) => a.date.getTime() > currentDate.getTime())
        .slice(0, 5);

    if (upcomingAlignments.length === 0) return null;

    return (
        <div className="absolute bottom-4 left-4 z-10 rounded-lg bg-black/60 p-4 backdrop-blur-sm">
            <h4 className="mb-2 text-sm font-medium text-white">
                Upcoming Alignments
            </h4>
            <div className="space-y-2">
                {upcomingAlignments.map((alignment, i) => (
                    <div key={i} className="text-xs text-gray-300">
                        <span className="text-yellow-400">
                            {alignment.body1}
                        </span>
                        {' & '}
                        <span className="text-yellow-400">
                            {alignment.body2}
                        </span>
                        <span className="ml-2 text-gray-500">
                            {alignment.date.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                            })}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
