import { Model } from './Core';

export interface ParticipantExpenseParams {
    id?: string;
    participantId?: string;
    participantId?: string;
    expenseId?: string;
    expenseId?: string;
    createdAt?: Date | string;
    createdAt?: string;
}

export class ParticipantExpense extends Model {
    participantId: string;
    expenseId: string;

    constructor(pe: ParticipantExpenseParams) {
        const normalized = {
            ...pe,
            createdAt: new Date(pe.createdAt ?? pe.createdAt ?? new Date())
        };

        super(normalized);

        this.participantId = pe.participantId ?? pe.participantId!;
        this.expenseId = pe.expenseId ?? pe.expenseId!;
    }

    toEntity(): { [key: string]: any } {
        return {
            id: this.id,
            participantId: this.participantId,
            expenseId: this.expenseId,
            createdAt: this.createdAt.toISOString(),
        };
    }
}
