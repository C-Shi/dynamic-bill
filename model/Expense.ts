import { BaseEntity, BaseModel } from './Core';
import { Participant } from './Participant';
import { ParticipantExpense } from './ParticipantExpense';

export class ExpenseEntity extends BaseEntity {
    constructor(expense: { id?: string, activityId: string, description: string; date: Date, createdAt?: Date }) {
        super({ id: expense.id, createdAt: expense.createdAt })

        this.activityId = expense.activityId;
        this.description = expense.description;
        this.date = expense.date;
    }

    activityId: string;
    description: string;
    date: Date;
}

export class Expense extends ExpenseEntity implements BaseModel<ExpenseEntity> {
    participants: Participant[] = []

    constructor(expense: ExpenseEntity, participantExpenses?: ParticipantExpense[]) {
        super(expense)

        if (participantExpenses) {
            this.participants = participantExpenses.map(relation => relation.participant)
        }
    }

    addParticipant(participant: Participant, participantExpense: ParticipantExpense) {
        this.participants.push(participant);
    }

    toEntity(): ExpenseEntity {
        return new ExpenseEntity({
            id: this.id,
            createdAt: this.createdAt,
            activityId: this.activityId,
            description: this.description,
            date: this.date
        })
    }
}