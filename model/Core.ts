import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

/**
 * Base abstract class for all models in the application
 * Provides common functionality for entity management and database operations
 */
export abstract class Model {
    /** Unique identifier for the model instance */
    id: string;

    /** Timestamp when the model instance was created */
    createdAt: Date;

    /**
     * Creates a new model instance
     * @param data Optional initialization data
     * @param data.id Optional custom ID (defaults to generated UUID)
     * @param data.createdAt Optional creation timestamp (defaults to current time)
     */
    constructor(data?: { id?: string; createdAt?: Date }) {
        this.id = data?.id ?? uuidv4()
        this.createdAt = data?.createdAt ? new Date(data.createdAt) : new Date();
    }

    /**
     * Converts the model instance to a database entity
     * @returns Object representing the database entity
     */
    public abstract toEntity(): { [key: string]: any };
}
