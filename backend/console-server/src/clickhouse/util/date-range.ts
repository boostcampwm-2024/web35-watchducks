export const getDateRange = (days: number = 7) => {
    const end = new Date();
    const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);

    return {
        start,
        end,
    };
};
