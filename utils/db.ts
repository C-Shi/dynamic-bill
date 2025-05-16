import { SQLiteAdapter } from "./SQLiteAdapter";
/**
 * Database Adapter Interface
 * Defines the methods that should be implemented by any database adapter (e.g., SQLiteAdapter).
 */
interface IDatabaseAdapter {
    db: any;
    init(): Promise<void>;
    seed(): Promise<void>;
    query(query: string, params: any[]): Promise<any[]>;
    first(query: string, params: any[]): Promise<any>;
    get(table: string, where?: { [key: string]: [string, string] }): Promise<any[]>;
    insert(table: string, data: { [key: string]: string | number } | { [key: string]: string | number }[]): Promise<any>;
    update(table: string, id: string, data: { [key: string]: string | number }): Promise<any>;
    delete(table: string, id: string): Promise<void>;
}

/**
 * DB class
 * Manages database operations and listeners for specific actions (insert, update) on tables.
 */
export class DB {
    // Database adapter (default: SQLiteAdapter)
    private static adapter: IDatabaseAdapter = SQLiteAdapter;

    // Store listeners as an object with table names as keys and action types (insert, update) as sub-keys
    private static listeners: {
        [table: string]: {
            insert: Function[];
            update: Function[];
        };
    } = {};

    /**
     * Sets the database adapter to use for database operations.
     * 
     * @param adapter - The adapter to use for database operations.
     */
    static setAdapter(adapter: IDatabaseAdapter) {
        DB.adapter = adapter;
    }

    /**
     * Initializes the database by calling the adapter's init method.
     * Ensures that the necessary database connection or setup is done.
     */
    static async init(): Promise<void> {
        return DB.adapter.init();
    }

    /**
     * Seeds the database with initial data by calling the adapter's seed method.
     * Useful for initializing the database with some starting data.
     */
    static async seed(): Promise<void> {
        return DB.adapter.seed();
    }

    /**
     * Executes a query with the provided parameters.
     * 
     * @param query - The query string to execute.
     * @param params - The parameters to pass to the query.
     * @returns The result of the query.
     */
    static async query(query: string, params?: any): Promise<any> {
        console.debug(`Query: ${query} with Params ${params} - DB.query`);
        return DB.adapter.query(query, params);
    }

    /**
     * Executes a query and returns the first result.
     * 
     * @param query - The query string to execute.
     * @param params - The parameters to pass to the query.
     * @returns The first result of the query.
     */
    static async first(query: string, params?: any): Promise<any> {
        console.debug(`Query: ${query} with Params ${params} - DB.first`);
        return DB.adapter.first(query, params);
    }

    /**
     * Retrieves records from a specified table based on optional conditions.
     * 
     * @param table - The table from which to retrieve records.
     * @param where - The conditions to filter the records.
     * @returns The retrieved records.
     */
    static async get(table: string, where?: { [key: string]: [string, string] }): Promise<any> {
        console.log(`Table: ${table} - DB.get`);
        return DB.adapter.get(table, where);
    }

    /**
     * Inserts data into a specified table and notifies listeners of the insert action.
     * 
     * @param table - The table into which the data will be inserted.
     * @param data - The data to insert (single or multiple records).
     * @returns The result of the insert operation.
     */
    public static async insert(table: string, data: { [key: string]: string | number } | { [key: string]: string | number }[]): Promise<void> {
        console.log(`Table ${table} - DB.Insert`);
        await DB.adapter.insert(table, data);
        DB.notify(table, 'insert', data); // Notify listeners about the insert operation
    }

    /**
     * Updates a record in a specified table by its ID.
     * 
     * @param table - The table from which to update the record.
     * @param id - The ID of the record to update.
     * @param data - The data to update.
     */
    public static async update(table: string, id: string, data: { [key: string]: string | number }): Promise<void> {
        console.log(`Table ${table} - DB.Update`);
        await DB.adapter.update(table, id, data);
        DB.notify(table, 'update', data); // Notify listeners about the update operation
    }

    /**
     * Deletes a record from a specified table by its ID.
     * 
     * @param table - The table from which to delete the record.
     * @param id - The ID of the record to delete.
     */
    public static async delete(table: string, id: string): Promise<void> {
        console.log(`Table ${table} DELETE ${id}`);
        DB.adapter.delete(table, id);
    }

    /**
     * Registers a listener for a specific action (insert or update) for a table.
     * 
     * @param table - The table to register the listener for.
     * @param action - The action type, either 'insert' or 'update'.
     * @param listener - The listener function to register.
     */
    static register(table: string, action: "insert" | "update", listener: Function) {
        if (!DB.listeners[table]) {
            DB.listeners[table] = { insert: [], update: [] };
        }
        DB.listeners[table][action].push(listener); // Add the listener for the specific action
    }

    /**
     * Notifies listeners for a specific action (insert or update) for the given table.
     * 
     * @param table - The table whose listeners should be notified.
     * @param action - The action type, either 'insert' or 'update'.
     */
    static async notify(table: string, action: "insert" | "update", payload?: any) {
        const tableListeners = DB.listeners[table]?.[action];
        if (tableListeners) {
            for (const listener of tableListeners) {
                await listener(payload); // Invoke each listener for the specified action
            }
        }
    }
}
