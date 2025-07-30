import { Model } from './Core';

export interface ParticipantExpenseParams {
    id?: string;
    participantId?: string;
    participant_id?: string;
    expenseId?: string;
    expense_id?: string;
    createdAt?: Date | string;
    created_at?: string;
}

export class ParticipantExpense extends Model {
    participantId: string;
    expenseId: string;

    constructor(pe: ParticipantExpenseParams) {
        const normalized = {
            ...pe,
            createdAt: new Date(pe.createdAt ?? pe.created_at ?? new Date())
        };

        super(normalized);

        this.participantId = pe.participantId ?? pe.participant_id!;
        this.expenseId = pe.expenseId ?? pe.expense_id!;
    }

    toEntity(): { [key: string]: any } {
        return {
            id: this.id,
            participant_id: this.participantId,
            expense_id: this.expenseId,
            created_at: this.createdAt.toISOString(),
        };
    }
}
