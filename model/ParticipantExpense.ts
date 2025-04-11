import { Participant } from './Participant';
import { Expense } from './Expense';
import { BaseEntity, BaseModel } from './Core';

export class ParticipantExpenseEntity extends BaseEntity {
    constructor(participantExpense: {
        id?: string;
        participantId: string;
        expenseId: string;
        createdAt?: Date;
    }) {
        super({ id: participantExpense.id, createdAt: participantExpense.createdAt })
        this.participantId = participantExpense.participantId;
        this.expenseId = participantExpense.expenseId;
    }

    participantId: string;
    expenseId: string;
}

export class ParticipantExpense extends ParticipantExpenseEntity implements BaseModel<ParticipantExpenseEntity> {
    // These are populated through the relationship
    participant: Participant;
    expense: Expense;

    constructor(participantExpense: ParticipantExpenseEntity, participant: Participant, expense: Expense) {
        super(participantExpense);
        this.participant = participant;
        this.expense = expense;
    }

    toEntity(): ParticipantExpenseEntity {
        return new ParticipantExpenseEntity({
            id: this.id,
            participantId: this.participantId,
            expenseId: this.expenseId,
            createdAt: this.createdAt
        })
    }
}
