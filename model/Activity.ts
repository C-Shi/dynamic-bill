import { Participant } from "./Participant";
import { Model } from './Core'
import { DB } from "@/utils/db";
import { Expense } from "./Expense";

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
    }

    title!: string;
    note?: string;
    budget?: number;
    type?: number;

    participants: Participant[] = [];
    expenses: Expense[] = [];

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

    public addParticipant(participant: Participant) {
        this.participants.push(participant)
    }

    public addParticipants(participants: Participant[]) {
        participants.forEach(this.addParticipant)
    }

    public addExpense(expense: Expense) {
        this.expenses.push(expense)
    }

    public addExpenses(expenses: Expense[]) {
        expenses.forEach(this.addExpense)
    }

    public async save() {
        const data = this.toEntity()
        const columns = Object.keys(data)
        const values = Object.values(data)
        const query = `INSERT INTO activities ( ${columns.join(', ')} ) VALUES ( ${new Array(columns.length).fill("?").join(', ')} )`

        try {
            return await DB.query(query, values)
        } catch (e) {
            if (__DEV__) {
                console.log(e)
            }
            console.error('[INSERT FAIL] - activities')
        }
    }

    public async delete() {
        try {
            return await DB.query('DELETE FROM activities WHERE id = ?;', [this.id])
        } catch {
            console.error('[DELETE FAIL] - activities')
        }
    }

    public async details() {
        `SELECT * FROM participants WHERE activity_id = ?`
        /** Check if participants */
        /** Check if expenses */
    }

    get totalAmount() {
        return this.expenses.reduce((prev, curr) => {
            return prev + curr.amount
        }, 0)
    }

    get totalAmountDisplay(): string {
        return Intl.NumberFormat("en-CA", {
            style: "currency",
            currency: "CAD"
        }).format(this.totalAmount)
    }

    get budgetAmountDisplay(): string {
        if (this.budget) {
            return Intl.NumberFormat("en-CA", {
                style: "currency",
                currency: "CAD"
            }).format(this.budget)
        }
        return 'N/A'
    }

    get remainingBudgetDisplay(): string {
        if (!this.budget) {
            return 'N/A'
        }
        const remain = this.budget - this.totalAmount
        return Intl.NumberFormat("en-CA", {
            style: "currency",
            currency: "CAD"
        }).format(remain)
    }

    get totalParticipant() {
        return this.participants.length
    }

    public static async all(): Promise<Activity[]> {
        const activities = await DB.query('SELECT * FROM activities ORDER BY created_at DESC')
        return activities.map((d: any) => {
            return new this({ ...d, createdAt: d.created_at })
        })
    }
}
