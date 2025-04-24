import { Participant } from './Participant';
import { Expense } from './Expense';
import { Model } from './Core';
import { DB } from '@/utils/DB';
export class ParticipantExpense extends Model {
    constructor(pe: { [key: string]: any }) {
        super(pe);
        this.participantId = pe.participantId;
        this.expenseId = pe.expenseId;
    }

    participantId: string;
    expenseId: string;

    toEntity(): { [key: string]: any } {
        return {
            id: this.id,
            participant_id: this.participantId,
            expense_id: this.expenseId,
            created_at: this.createdAt.toISOString()
        }
    }

    async save() {
        const data = this.toEntity()
        const columns = Object.keys(data)
        const values = Object.values(data)
        const query = `INSERT INTO participant_expenses ( ${columns.join(', ')} ) VALUES ( ${new Array(columns.length).fill("?").join(', ')} )`

        try {
            await DB.query(query, values)
            console.log('insert expenses')
            await DB.query(`
                UPDATE participants
                SET 
                total_paid = (
                    SELECT COALESCE(SUM(e.amount), 0)
                    FROM expenses e
                    WHERE e.paid_by = participants.id
                ),
                total_owed = (
                    SELECT COALESCE(SUM(
                    e.amount / (
                        SELECT COUNT(*) 
                        FROM participant_expenses pe2 
                        WHERE pe2.expense_id = e.id
                    )
                    ), 0)
                    FROM expenses e
                    JOIN participant_expenses pe ON pe.expense_id = e.id
                    WHERE pe.participant_id = participants.id
                )
                WHERE id = ?;

            `, [data.participant_id])
            console.log('update participants')
        } catch (e) {
            if (__DEV__) {
                console.log(e)
            }
            console.error('[INSERT FAIL] - participant_expenses')
        }
    }
}
