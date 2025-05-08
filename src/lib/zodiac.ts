// src/lib/zodiac.ts

export function getZodiacSign(birthday: string): string {
    // Parse MM/DD format
    const [month, day] = birthday.split('/').map(Number);

    if (month === 1) {
        if (day <= 19) return "Capricorn";
        return "Aquarius";
    } else if (month === 2) {
        if (day <= 18) return "Aquarius";
        return "Pisces";
    } else if (month === 3) {
        if (day <= 20) return "Pisces";
        return "Aries";
    } else if (month === 4) {
        if (day <= 19) return "Aries";
        return "Taurus";
    } else if (month === 5) {
        if (day <= 20) return "Taurus";
        return "Gemini";
    } else if (month === 6) {
        if (day <= 20) return "Gemini";
        return "Cancer";
    } else if (month === 7) {
        if (day <= 22) return "Cancer";
        return "Leo";
    } else if (month === 8) {
        if (day <= 22) return "Leo";
        return "Virgo";
    } else if (month === 9) {
        if (day <= 22) return "Virgo";
        return "Libra";
    } else if (month === 10) {
        if (day <= 22) return "Libra";
        return "Scorpio";
    } else if (month === 11) {
        if (day <= 21) return "Scorpio";
        return "Sagittarius";
    } else {
        if (day <= 21) return "Sagittarius";
        return "Capricorn";
    }
}
