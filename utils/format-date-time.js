export function formatDateTime(isoString) {
    const newDate = new Date(isoString);

    const date = newDate.toLocaleDateString("en-US", {
        timeZone: "Asia/Kolkata",
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    const time = newDate.toLocaleTimeString("en-US", {
        timeZone: "Asia/Kolkata",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    });

    return { date,time }
}