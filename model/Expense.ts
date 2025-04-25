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

    paidForParticipants?: Participant[]
    paidByParticipant?: Participant

    public async detail() {
        const whoPay = await DB.first(`SELECT * FROM participants WHERE id = ?`, [this.paidBy])
        this.paidByParticipant = whoPay;

        const payForWho = await DB.query(
            `SELECT participants.* FROM participants JOIN participant_expenses ON
            participants.id = participant_expenses.participant_id
            WHERE participant_expenses.expense_id = ?`, [this.id]
        )
        this.paidForParticipants = payForWho
    }

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