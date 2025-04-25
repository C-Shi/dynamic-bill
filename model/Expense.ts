import { DB } from '@/utils/DB';
import { Model } from './Core';
import { Participant } from './Participant';


export class Expense extends Model {
    constructor(expense: { [key: string]: any }) {
        super(expense)
        if (expense.activity_id) {
            this.activityId = expense.activity_id;
        } else {
            this.activityId = expense.activityId ?? null
        }
        this.description = expense.description;

        if (expense.paid_by) {
            this.paidBy = expense.paid_by
        } else {
            this.paidBy = expense.paidBy;
        }
        this.amount = expense.amount;
        this.date = expense.date;
    }

    activityId: string;
    paidBy: string;
    amount: number;
    description: string;
    date: Date;

    toEntity(): { [key: string]: any } {
        return {
            id: this.id,
            created_at: this.createdAt.toISOString(),
            activity_id: this.activityId,
            description: this.description,
            paid_by: this.paidBy,
            amount: this.amount,
            date: this.date.toISOString()
        }
    }
}