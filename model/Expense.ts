import { Model } from './Core';

/**
 * Represents an expense in an activity
 * Tracks expense details including amount, payer, and associated activity
 */
export class Expense extends Model {
    /** ID of the associated activity */
    activityId: string;

    /** Name of the participant who paid for the expense */
    paidBy: string;

    /** Amount of the expense */
    amount: number;

    /** Description of the expense */
    description: string;

    /** Date when the expense occurred */
    date: Date;

    /**
     * Creates a new expense instance
     * @param expense Initialization data for the expense
     */
    constructor(expense: { [key: string]: any }) {
        super(expense)

        // Handle activity ID from different possible sources
        this.activityId = expense.activity_id ?? expense.activityId ?? null;

        // Handle payer information from different possible sources
        this.paidBy = expense.paid_by ?? expense.paidBy;

        this.description = expense.description;
        this.amount = expense.amount;
        this.date = expense.date;
    }

    /**
     * Converts the expense to a database entity
     * @returns Object representing the database entity
     */
    toEntity(): { [key: string]: any } {
        return {
            id: this.id,
            created_at: this.createdAt.toISOString(),
            activity_id: this.activityId,
            description: this.description,
            paid_by: this.paidBy,
            amount: this.amount,
            date: this.date.toISOString()
        }
    }
}