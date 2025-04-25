
import { Model } from './Core'
import { DB } from "@/utils/DB";
import { Expense } from "./Expense";
import { ParticipantExpense } from "./ParticipantExpense";
import { dollar } from '@/utils/Helper';

export class Activity extends Model {
    protected static _table: string = 'activities';

    constructor(activity?: { [key: string]: any }) {
        super(activity)
        this.title = activity?.title ?? "";
        if (activity?.note) {
            this.note = activity.note;
        }
        if (activity?.budget) {
            this.budget = activity.budget;
        }
        if (activity?.type) {
            this.type = activity.type;
        }
        if (activity?.participants) {
            if (Array.isArray(activity.participants)) {
                this.participants = activity.participants
            } else {
                this.participants = activity.participants.split(',');
            }
        }
        if (activity?.totals) {
            this.totals = activity.totals;
        }
    }

    title: string;
    note?: string;
    budget?: number;
    type?: number;
    participants: string[] = [];
    totals: number = 0;

    public toEntity(): { [key: string]: any } {
        return {
            id: this.id,
            title: this.title ?? '',
            budget: this.budget ?? null,
            note: this.note ?? null,
            type: this.type ?? 'Other',
            created_at: this.createdAt.toISOString(),
        }
    }

    // public async addExpense(expense: Expense, expenseFor: string[]) {
    //     /** Add Expense to DB */
    //     console.log('add expense')
    //     await expense.save()
    //     /** Add Expense For Run Participant Sync */
    //     await Promise.allSettled(expenseFor.map(async pid => {
    //         const pe = new ParticipantExpense({ participantId: pid, expenseId: expense.id })
    //         await pe.save()
    //     }))
    // }

    get totalAmountDisplay(): string {
        return dollar(this.totals)
    }

    get budgetAmountDisplay(): string {
        if (this.budget) {
            return dollar(this.budget)
        }
        return 'N/A'
    }

    get remainingBudgetDisplay(): string {
        if (!this.budget) {
            return 'N/A'
        }
        const remain = this.budget - this.totals
        return dollar(remain)
    }

    get totalParticipant() {
        return this.participants.length
    }
}
