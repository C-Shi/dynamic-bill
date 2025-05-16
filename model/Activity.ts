import { Model } from './Core'
import { dollar } from '@/utils/Helper';

/**
 * Represents an activity or event in the application
 * Manages activity details, budget, and participant information
 */
export class Activity extends Model {
    /** Title of the activity */
    title: string;

    /** Optional description or notes about the activity */
    note?: string;

    /** Optional budget limit for the activity */
    budget?: number;

    /** Optional type identifier for the activity */
    type?: number;

    /** List of participant names */
    participants: string[] = [];

    /** Total amount spent in the activity */
    totals: number = 0;

    /**
     * Creates a new activity instance
     * @param activity Optional initialization data
     */
    constructor(activity?: { [key: string]: any }) {
        super(activity)
        this.title = activity?.title ?? "";
        this.note = activity?.note;
        this.budget = activity?.budget;
        this.type = activity?.type;
        this.totals = activity?.totals ?? 0;

        // Handle participants data
        if (activity?.participants) {
            this.participants = Array.isArray(activity.participants)
                ? activity.participants
                : activity.participants.split(',');
        }
    }

    /**
     * Converts the activity to a database entity
     * @returns Object representing the database entity
     */
    public toEntity(): { [key: string]: any } {
        return {
            id: this.id,
            title: this.title,
            budget: this.budget ?? null,
            note: this.note ?? null,
            type: this.type ?? 'Other',
            created_at: this.createdAt.toISOString(),
        }
    }

    /**
     * Gets the formatted display string for total amount
     */
    get totalAmountDisplay(): string {
        return dollar(this.totals)
    }

    /**
     * Gets the formatted display string for budget amount
     * Returns 'N/A' if no budget is set
     */
    get budgetAmountDisplay(): string {
        return this.budget ? dollar(this.budget) : 'N/A'
    }

    /**
     * Gets the formatted display string for remaining budget
     * Returns 'N/A' if no budget is set
     */
    get remainingBudgetDisplay(): string {
        if (!this.budget) return 'N/A'
        return dollar(this.budget - this.totals)
    }

    /**
     * Gets the total number of participants
     */
    get totalParticipant(): number {
        return this.participants.length
    }
}
