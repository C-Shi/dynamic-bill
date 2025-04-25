import { Model } from './Core';
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
}
