import * as SQLite from 'expo-sqlite';

/**
 * SQLite database adapter for managing local storage operations
 * Implements singleton pattern for database connection
 */
export class SQLiteAdapter {
    private static instance: SQLite.SQLiteDatabase | null = null;

    /**
     * Gets or creates the database instance
     * @returns Promise resolving to SQLite database instance
     */
    public static async db(): Promise<SQLite.SQLiteDatabase> {
        if (SQLiteAdapter.instance === null) {
            SQLiteAdapter.instance = await SQLite.openDatabaseAsync("app.db")
            await SQLiteAdapter.instance.execAsync("PRAGMA journal_mode = 'wal'")
        }
        return SQLiteAdapter.instance
    }

    /**
     * Initializes the database schema
     * Creates all necessary tables if they don't exist
     */
    public static async init(): Promise<void> {
        console.log("Initializing database")
        const db = await SQLiteAdapter.db();
        if (__DEV__) {
            console.log('Database location:', db.databasePath);
        }
        try {

            await db.execAsync(`PRAGMA foreign_keys = ON`);
            // Create migrations table
            await db.execAsync(`
                CREATE TABLE IF NOT EXISTS migrations (
                    version INTEGER NOT NULL DEFAULT 0,
                    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                );
            `);

            const migrations: { row: number } = await db.getFirstAsync(`
                SELECT COUNT(*) AS row FROM migrations;
            `) ?? { row: 0 };

            if (__DEV__) {
                console.log(`Migration record: ${migrations.row}`);
            }
            if (migrations.row === 0) {
                if (__DEV__) {
                    console.log("No migrations tracked, creating initial migration")
                }
                await db.execAsync(`
                    INSERT INTO migrations (version) VALUES (0);
                `)
            }
        } catch (error) {
            console.error("Error initializing database", error)
        }
    }


    /**
     * Seeds the database with initial data for development
     * Creates sample activities, participants, and activity types
     */
    public static async seed(): Promise<void> {
        const db = await SQLiteAdapter.db()
        await db.withTransactionAsync(async () => {
            await db.execAsync(`
                -- Clear existing data
                DELETE FROM participant_expenses;
                DELETE FROM expenses;
                DELETE FROM participants;
                DELETE FROM activities;
                DELETE FROM activity_types;

                -- Seed activities and participants
                -- ACTIVITY 1: Movie Night
                INSERT INTO activities (id, title, note, created_at) VALUES
                ('a1', 'Movie Night', 'Watched a new release', '2025-04-01T18:00:00Z');
                INSERT INTO participants (id, name, activity_id, created_at) VALUES
                ('p1', 'Alice', 'a1', '2025-04-01T18:01:00Z'),
                ('p2', 'Bob', 'a1', '2025-04-01T18:01:30Z');

            `)
        })
    }

    /**
     * Executes a transaction on the database
     * @param callback Callback function to execute within the transaction
     * @returns Promise resolving to transaction result
     */
    public static async transaction(callback: () => Promise<void>): Promise<void> {
        const db = await SQLiteAdapter.db()
        return db.withTransactionAsync(callback)
    }

    /**
     * Executes a query and returns all results
     * @param query SQL query string
     * @param params Query parameters
     * @returns Promise resolving to array of results
     */
    public static async query(query: string, params: any[] = []): Promise<any[]> {
        const db = await SQLiteAdapter.db()
        return db.getAllAsync(query, params)
    }

    /**
     * Executes a query and returns the first result
     * @param query SQL query string
     * @param params Query parameters
     * @returns Promise resolving to first result
     */
    public static async first(query: string, params: any[] = []): Promise<any> {
        const db = await SQLiteAdapter.db()
        return db.getFirstAsync(query, params)
    }

    /**
     * Retrieves records from a table with optional where conditions
     * @param table Table name
     * @param where Optional where conditions as key-value pairs
     * @returns Promise resolving to array of records
     */
    public static async get(table: string, where?: { [key: string]: [string, string] }): Promise<any[]> {
        let query = `SELECT * FROM ${table}`;
        let params: string[] = []
        if (where) {
            let temp: string[] = []
            Object.keys(where).forEach(key => {
                temp.push(`${key} ${where[key][0]} ?`)
                params.push(where[key][1])
            })
            query = query + " WHERE " + temp.join(' AND ')
        }
        const rows = await this.query(query, params);
        return rows
    }

    /**
     * Inserts one or multiple records into a table
     * @param table Table name
     * @param data Single record or array of records to insert
     * @returns Promise resolving to query result
     */
    public static async insert(
        table: string,
        data: { [key: string]: string | number } | { [key: string]: string | number }[]
    ): Promise<any> {
        const rows = Array.isArray(data) ? data : [data];

        if (rows.length === 0) {
            throw new Error("No data to insert.");
        }

        const columns = Object.keys(rows[0]);
        const placeholders = `(${new Array(columns.length).fill("?").join(", ")})`;
        const query = `INSERT INTO ${table} (${columns.join(", ")}) VALUES ${rows.map(() => placeholders).join(", ")}`;

        const values = rows.flatMap((row) => columns.map((col) => row[col]));

        return await this.query(query, values);
    }

    /**
     * Updates a record in a table
     * @param table Table name
     * @param id Record ID to update
     * @param data Key-value pairs to update
     * @returns Promise resolving to query result
     */
    public static async update(table: string, id: string, data: { [key: string]: string | number }): Promise<any> {
        const columns = Object.keys(data);
        const placeholders = columns.map((col) => `${col} = ?`).join(", ");
        const query = `UPDATE ${table} SET ${placeholders} WHERE id = ?`;
        const values = columns.map((col) => data[col]);
        return await this.query(query, [...values, id]);
    }

    /**
     * Deletes a record from a table
     * @param table Table name
     * @param id Record ID to delete
     * @returns Promise resolving to query result
     */
    public static async delete(table: string, id: string): Promise<any> {
        const query = `DELETE FROM ${table} WHERE id = ?`;
        return await this.query(query, [id])
    }
}