import { DB } from '@/utils/db';
import { Model } from './Core';
import { Participant } from './Participant';


export class Expense extends Model {
    constructor(expense: { [key: string]: any }) {
        super(expense)
        this.activityId = expense.activityId ?? null;
        this.description = expense.description;
        this.paidBy = expense.paidBy;
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
            `SELECT * FROM participants JOIN participant_expenses ON
            participants.id = participant_expenses.participant_id
            WHERE participant_expenses.expense_id = ?`, [this.id]
        )

        this.paidForParticipants = payForWho
    }

    toEntity(): { [key: string]: any } {
        return {
            id: this.id,
            createdAt: this.createdAt,
            activityId: this.activityId,
            description: this.description,
            paidBy: this.paidBy,
            amount: this.amount,
            date: this.date
        }
    }

    public static async get(where?: { [key: string]: [string, string] }): Promise<Expense[]> {
        let query = "SELECT * FROM expenses";
        let params: string[] = []
        if (where) {
            let temp: string[] = []
            Object.keys(where).forEach(key => {
                temp.push(`${key} ${where[key][0]} ?`)
                params.push(where[key][1])
            })
            query = query + " WHERE " + temp.join(' AND ')
        }
        const expenses = await DB.query(query, params);
        return expenses.map((e: any) => new this({ ...e, activityId: e.activity_id, paidBy: e.paid_by }))
    }
}