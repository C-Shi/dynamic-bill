import { Model } from './Core';

/**
 * Represents the relationship between a participant and an expense
 * Links participants to their associated expenses in an activity
 */
export class ParticipantExpense extends Model {
    /** ID of the associated participant */
    participantId: string;

    /** ID of the associated expense */
    expenseId: string;

    /**
     * Creates a new participant-expense relationship instance
     * @param pe Initialization data for the participant-expense relationship
     */
    constructor(pe: { [key: string]: any }) {
        super(pe);
        this.participantId = pe.participantId;
        this.expenseId = pe.expenseId;
    }

    /**
     * Converts the participant-expense relationship to a database entity
     * @returns Object representing the database entity
     */
    toEntity(): { [key: string]: any } {
        return {
            id: this.id,
            participant_id: this.participantId,
            expense_id: this.expenseId,
            created_at: this.createdAt.toISOString()
        }
    }
}
