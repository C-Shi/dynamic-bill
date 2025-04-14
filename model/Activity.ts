import { Participant } from "./Participant";
import { Model } from './Core'
import { DB } from "@/utils/db";
import { Expense } from "./Expense";

export class Activity extends Model {
    protected static _table: string = 'activities';

    constructor(activity: { [key: string]: any }) {
        super(activity)
        this.title = activity.title ?? "";
        if (activity.note) {
            this.note = activity.note;
        }
    }

    title!: string;
    note?: string;
    participants: Participant[] = [];
    expenses: Expense[] = [];

    public toEntity(): { [key: string]: any } {
        return {
            id: this.id,
            createdAt: this.createdAt,
            title: this.title,
            note: this.note
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

    get totalParticipant() {
        return 5
    }

    public static async all(): Promise<Activity[]> {
        const db = await DB.db()
        const activities = await db.getAllAsync('SELECT * FROM activities ORDER BY createdAt DESC')
        return activities.map((d: any) => new this(d))
    }
}
