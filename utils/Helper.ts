import { Participant } from "@/model/Participant"
export function dollar(amount: number, locale: string = 'en-CA'): string {
    return Intl.NumberFormat(locale, {
        style: "currency",
        currency: "CAD"
    }).format(amount)
}

export function minimumTrasactionStrategy(participants: Participant[]): any[] {
    // Setp 1: Seperate Creditors and Debtors
    const creditors = participants.filter((p: Participant) => p.net > 0).map((p: Participant) => {
        return {
            id: p.id,
            name: p.name,
            net: p.net
        }
    }).sort((a, b) => a.net - b.net)
    const debtors = participants.filter((p: Participant) => p.net < 0).map((p: Participant) => {
        return {
            id: p.id,
            name: p.name,
            net: p.net
        }
    }).sort((a, b) => b.net - a.net)

    const payments = []

    let cIdx = 0;
    let dIdx = 0;

    // loop and set between current creditor and debtor
    while (cIdx < creditors.length && dIdx < debtors.length) {
        const creditor = creditors[cIdx]
        const debtor = debtors[dIdx]

        const amt = Math.min(creditor.net, Math.abs(debtor.net))

        // push payment record
        payments.push({
            fromId: debtor.id,
            fromName: debtor.name,
            toId: creditor.id,
            toName: creditor.name,
            amount: amt
        })

        // update balance
        creditor.net -= amt;
        debtor.net += amt;

        if (creditor.net === 0) {
            cIdx++;
        }
        if (debtor.net === 0) {
            dIdx++;
        }
    }

    return payments
}