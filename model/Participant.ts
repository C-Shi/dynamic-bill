import { Expense } from './Expense';
import { Model } from './Core';
import { DB } from '@/utils/db';

export class Participant extends Model {
    expenses: Expense[] = [];

    constructor(participant: { [key: string]: any }) {
        super(participant)
        this.name = participant.name;
        this.activityId = participant.activityId;
    }

    name: string;
    activityId: string;

    addExpense(expense: Expense) {
        this.expenses.push(expense)
    }

    public toEntity(): { [key: string]: any } {
        return {
            id: this.id,
            name: this.name,
            activityId: this.activityId,
            createdAt: this.createdAt
        }

    }

    public static async get(where?: { [key: string]: [string, string] }): Promise<Participant[]> {
        const db = await DB.db()
        let query = "SELECT * FROM participants";
        let params: string[] = []
        if (where) {
            let temp: string[] = []
            Object.keys(where).forEach(key => {
                temp.push(`${key} ${where[key][0]} ?`)
                params.push(where[key][1])
            })
            query = query + " where " + temp.join(' AND ')
        }
        const participants = await db.getAllAsync(query, params);
        return participants.map((p: any) => {
            return new this({ ...p, createdAt: p.created_at, activityId: p.activity_id })
        })
    }
}