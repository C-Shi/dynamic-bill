import { Participant } from "@/model/Participant"

/**
 * Type definition for payment transactions
 */
interface PaymentTransaction {
    fromId: string
    fromName: string
    toId: string
    toName: string
    amount: number
}

/**
 * Formats a number as Canadian currency
 * @param amount - The amount to format
 * @param locale - The locale to use for formatting (defaults to 'en-CA')
 * @returns Formatted currency string
 */
export function dollar(amount: number, locale: string = 'en-CA'): string {
    return Intl.NumberFormat(locale, {
        style: "currency",
        currency: "CAD"
    }).format(amount)
}

/**
 * Calculates the minimum number of transactions needed to settle debts between participants
 * @param participants - Array of participants with their net balances
 * @returns Array of payment transactions
 */
export function minimumTrasactionStrategy(participants: Participant[]): PaymentTransaction[] {
    // Separate participants into creditors (positive balance) and debtors (negative balance)
    const creditors = participants
        .filter((p: Participant) => p.net > 0)
        .map((p: Participant) => ({
            id: p.id,
            name: p.name,
            net: p.net
        }))
        .sort((a, b) => a.net - b.net)

    const debtors = participants
        .filter((p: Participant) => p.net < 0)
        .map((p: Participant) => ({
            id: p.id,
            name: p.name,
            net: p.net
        }))
        .sort((a, b) => b.net - a.net)

    const payments: PaymentTransaction[] = []
    let creditorIndex = 0
    let debtorIndex = 0

    // Process each creditor-debtor pair until all balances are settled
    while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
        const creditor = creditors[creditorIndex]
        const debtor = debtors[debtorIndex]

        // Calculate the payment amount (minimum of creditor's credit and debtor's debt)
        const paymentAmount = Math.min(creditor.net, Math.abs(debtor.net))

        // Record the payment transaction
        payments.push({
            fromId: debtor.id,
            fromName: debtor.name,
            toId: creditor.id,
            toName: creditor.name,
            amount: paymentAmount
        })

        // Update remaining balances
        creditor.net -= paymentAmount
        debtor.net += paymentAmount

        // Move to next creditor/debtor if their balance is settled
        if (creditor.net === 0) creditorIndex++
        if (debtor.net === 0) debtorIndex++
    }

    return payments
}

/**
 * Calculates proportional payments from debtors to creditors
 * @param participants - Array of participants with their net balances
 * @returns Array of payment transactions
 */
export function proportionalOneToManyStrategy(participants: Participant[]): PaymentTransaction[] {
    // Separate participants into creditors and debtors
    const creditors = participants.filter((p: Participant) => p.net > 0)
    const debtors = participants.filter((p: Participant) => p.net < 0)

    // Calculate total credit amount
    const totalCredit = creditors.reduce((sum, p) => sum + p.net, 0)
    const payments: PaymentTransaction[] = []

    // Calculate proportional payments from each debtor to each creditor
    debtors.forEach(debtor => {
        creditors.forEach(creditor => {
            const proportion = creditor.net / totalCredit
            const paymentAmount = Math.round(proportion * -debtor.net * 100) / 100

            payments.push({
                fromId: debtor.id,
                fromName: debtor.name,
                toId: creditor.id,
                toName: creditor.name,
                amount: paymentAmount
            })
        })
    })

    // Handle rounding errors by adjusting the largest payment
    const totalDebit = payments.reduce((sum, p) => sum + p.amount, 0)
    const roundingDifference = totalCredit - totalDebit

    if (roundingDifference !== 0) {
        const largestPayment = payments.reduce(
            (prev, curr) => curr.amount > prev.amount ? curr : prev
        )
        largestPayment.amount = Math.round((largestPayment.amount + roundingDifference) * 100) / 100
    }

    return payments
}
