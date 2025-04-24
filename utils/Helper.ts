export function dollar(amount: number, locale: string = 'en-CA'): string {
    return Intl.NumberFormat(locale, {
        style: "currency",
        currency: "CAD"
    }).format(amount)
}