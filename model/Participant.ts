import { Expense } from './Expense';
import { Model } from './Core';
import { DB } from '@/utils/DB';

export class Participant extends Model {
    constructor(participant: { [key: string]: any }) {
        super(participant)
        this.name = participant.name;
        if (participant.activityId) {
            this.activityId = participant.activityId;
        } else if (participant.activity_id) {
            this.activityId = participant.activity_id;
        }
        if (participant.total_owed) {
            this.totalOwed = participant.total_owed;
        }
        if (participant.totalOwed) {
            this.totalOwed = participant.totalOwed;
        }
        if (participant.total_paid) {
            this.totalPaid = participant.total_paid;
        }
        if (participant.totalPaid) {
            this.totalPaid = participant.totalPaid;
        }
    }

    name: string;
    activityId!: string;
    totalOwed: number = 0;
    totalPaid: number = 0;

    paidForExpenses: Expense[] = []
    paidByExpenses: Expense[] = []

    public toEntity(): { [key: string]: any } {
        return {
            id: this.id,
            name: this.name,
            activity_id: this.activityId,
            total_owed: this.totalOwed,
            total_paid: this.totalPaid,
            created_at: this.createdAt.toISOString()
        }

    }

    public async detail(paidForExpenses?: Expense[], paidByExpenses?: Expense[]) {
        /** Add expenses if array is there */
        if (paidForExpenses) {
            this.paidForExpenses = paidForExpenses
        } else {
            const paidForExpenses = await DB.query(`SELECT * FROM expenses WHERE paid_by = ?`, [this.id]) as Expense[]
            this.paidForExpenses = paidForExpenses
        }

        if (paidByExpenses) {
            this.paidByExpenses = paidByExpenses
        } else {
            const paidByExpenses = await DB.query(
                `SELECT expenses.* FROM expenses JOIN participant_expenses ON expenses.id = participant_expenses.expense_id 
                WHERE participant_expenses.participant_id = ?`, [this.id]) as Expense[]
            this.paidByExpenses = paidByExpenses
        }
    }

    public async save() {
        const data = this.toEntity()
        const columns = Object.keys(data)
        const values = Object.values(data)
        const query = `INSERT INTO participants ( ${columns.join(', ')} ) VALUES ( ${new Array(columns.length).fill("?").join(', ')} )`

        try {
            return await DB.query(query, values)
        } catch {
            console.error('[INSERT FAIL] - participants')
        }
    }
}