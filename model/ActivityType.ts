/**
 * Represents the types of activities that can be created in the application
 * Provides a structured way to categorize different kinds of activities
 */
export class ActivityType {
    /** Unique identifier for the activity type */
    id: number;

    /** Display name of the activity type */
    name: string;

    /**
     * Creates a new activity type instance
     * @param type Initialization data for the activity type
     */
    constructor(type: { id: number; name: string }) {
        this.id = type.id;
        this.name = type.name;
    }
}