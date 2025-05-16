import { Model } from './Core';

/**
 * Represents a participant in an activity
 * Tracks participant's name, activity association, and financial contributions
 */
export class Participant extends Model {
    /** Name of the participant */
    name: string;

    /** ID of the associated activity */
    activityId!: string;

    /** Total amount owed by the participant */
    totalOwed: number = 0;

    /** Total amount paid by the participant */
    totalPaid: number = 0;

    /**
     * Creates a new participant instance
     * @param participant Initialization data for the participant
     */
    constructor(participant: { [key: string]: any }) {
        super(participant)
        this.name = participant.name;

        // Handle activity ID from different possible sources
        this.activityId = participant.activityId ?? participant.activity_id;

        // Handle total amounts from different possible sources
        this.totalOwed = participant.totalOwed ?? participant.total_owed ?? 0;
        this.totalPaid = participant.totalPaid ?? participant.total_paid ?? 0;
    }

    /**
     * Converts the participant to a database entity
     * @returns Object representing the database entity
     */
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

    /**
     * Gets the net amount (paid - owed) for the participant
     * Positive value indicates the participant is owed money
     * Negative value indicates the participant owes money
     */
    get net(): number {
        return this.totalPaid - this.totalOwed
    }
}