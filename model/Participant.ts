import { Expense } from './Expense';
import { ParticipantExpense } from './ParticipantExpense';
import { BaseEntity, BaseModel } from './Core';

export class ParticipantEntity extends BaseEntity {
    constructor(participant: { id?: string, name: string, activityId: string, createdAt?: Date }) {
        super({ id: participant.id, createdAt: participant.createdAt })
        this.name = participant.name;
        this.activityId = participant.activityId;
    }

    name: string;
    activityId: string;
}

export class Participant extends ParticipantEntity implements BaseModel<ParticipantEntity> {
    expenses: Expense[] = []
    constructor(participant: ParticipantEntity, participantExpenses?: ParticipantExpense[]) {
        super(participant)

        if (participantExpenses) {
            this.expenses = participantExpenses.map(relation => relation.expense);
        }
    }

    addExpense(expense: Expense) {
        this.expenses.push(expense)
    }

    toEntity(): ParticipantEntity {
        return new ParticipantEntity({
            id: this.id,
            name: this.name,
            activityId: this.activityId,
            createdAt: this.createdAt
        })

    }
}