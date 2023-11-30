const millisInAnHour = 60 * 60 * 1000;
const serverTimezone = -new Date().getTimezoneOffset() / 60;

export default function (date, timezone = serverTimezone) {
    if (typeof date === 'string' || date instanceof String) {
        date = new Date(date);
    }
    if (!(date instanceof Date)) {
        throw new Error('date must be a Date object');
    }

    return new Date(date.getTime() - millisInAnHour * (timezone - serverTimezone));
};