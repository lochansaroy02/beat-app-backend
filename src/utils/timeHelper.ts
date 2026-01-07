// utils/timeHelpers.ts
export const TIME_PHASES = [
    { label: "Phase 1", start: 6, end: 14 },  // 06:00 - 14:00
    { label: "Phase 2", start: 14, end: 22 }, // 14:00 - 22:00
    { label: "Phase 3", start: 22, end: 6 },  // 22:00 - 06:00
];

export const getPhaseFromDate = (date: Date): string => {
    const hour = date.getHours();
    const phase = TIME_PHASES.find(p => {
        if (p.start < p.end) {
            return hour >= p.start && hour < p.end;
        } else {
            // Handles overnight shift (Phase 3: 22:00 to 06:00)
            return hour >= p.start || hour < p.end;
        }
    });
    return phase ? phase.label : "Other";
};