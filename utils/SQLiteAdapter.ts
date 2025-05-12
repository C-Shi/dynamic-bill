import * as SQLite from 'expo-sqlite';

export class SQLiteAdapter {
    private static instance: SQLite.SQLiteDatabase | null = null;
    public static async db(): Promise<SQLite.SQLiteDatabase> {
        if (SQLiteAdapter.instance === null) {
            SQLiteAdapter.instance = await SQLite.openDatabaseAsync("app.db")
            await SQLiteAdapter.instance.execAsync("PRAGMA journal_mode = 'wal'")
        }
        return SQLiteAdapter.instance
    }

    public static async init(): Promise<void> {
        const db = await SQLiteAdapter.db()
        if (__DEV__) {
            console.log('Database location:', db.databasePath)
        }
        await db.withTransactionAsync(async () => {
            await db.execAsync(`
                DROP TABLE IF EXISTS activities;
                DROP TABLE IF EXISTS participants;
                DROP TABLE IF EXISTS expenses;
                DROP TABLE IF EXISTS participant_expenses;

                CREATE TABLE IF NOT EXISTS activities (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                budget REAL DEFAULT NULL,
                note TEXT,
                type TEXT DEFAULT 'Other',
                created_at TIMESTAMP NOT NULL
                );
    
                CREATE TABLE IF NOT EXISTS participants (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                activity_id TEXT NOT NULL,
                total_paid REAL DEFAULT 0,
                total_owed REAL DEFAULT 0,
                created_at TIMESTAMP NOT NULL,
                FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE
                );
    
                CREATE TABLE IF NOT EXISTS expenses (
                id TEXT PRIMARY KEY,
                description TEXT NOT NULL,
                amount REAL NOT NULL,
                paid_by TEXT NOT NULL,
                activity_id TEXT NOT NULL,
                date TEXT NOT NULL,
                created_at TIMESTAMP NOT NULL,
                FOREIGN KEY (paid_by) REFERENCES participants(id),
                FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE
                );
    
                CREATE TABLE IF NOT EXISTS participant_expenses (
                id TEXT PRIMARY KEY,
                participant_id TEXT NOT NULL,
                expense_id TEXT NOT NULL,
                created_at TIMESTAMP NOT NULL,
                FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE,
                FOREIGN KEY (expense_id) REFERENCES expenses(id) ON DELETE CASCADE);

                CREATE TABLE IF NOT EXISTS activity_types (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    description TEXT,
                    icon TEXT
                );
            `)
        })
    }

    public static async seed(): Promise<void> {
        const db = await SQLiteAdapter.db()
        await db.withTransactionAsync(async () => {
            await db.execAsync(`
            DELETE FROM participant_expenses;
            DELETE FROM expenses;
            DELETE FROM participants;
            DELETE FROM activities;
            DELETE FROM activity_types;

            -- Seed 10 activities with participants and expenses

            -- ACTIVITY 1: Movie Night
            INSERT INTO activities (id, title, note, created_at) VALUES
            ('a1', 'Movie Night', 'Watched a new release', '2025-04-01T18:00:00Z');
            INSERT INTO participants (id, name, activity_id, created_at) VALUES
            ('p1', 'Alice', 'a1', '2025-04-01T18:01:00Z'),
            ('p2', 'Bob', 'a1', '2025-04-01T18:01:30Z');

            -- ACTIVITY 2: Dinner
            INSERT INTO activities (id, title, note, created_at) VALUES
            ('a2', 'Dinner Out', 'Group dinner at Italian place', '2025-04-02T20:00:00Z');
            INSERT INTO participants (id, name, activity_id, created_at) VALUES
            ('p3', 'Charlie', 'a2', '2025-04-02T20:01:00Z'),
            ('p4', 'Diana', 'a2', '2025-04-02T20:01:30Z');

            -- ACTIVITY 3: Bowling
            INSERT INTO activities (id, title, note, created_at) VALUES
            ('a3', 'Bowling', 'Weekend bowling fun', '2025-04-03T16:00:00Z');
            INSERT INTO participants (id, name, activity_id, created_at) VALUES
            ('p5', 'Eve', 'a3', '2025-04-03T16:01:00Z'),
            ('p6', 'Frank', 'a3', '2025-04-03T16:01:30Z');

            -- ACTIVITY 4: Road Trip
            INSERT INTO activities (id, title, note, created_at) VALUES
            ('a4', 'Road Trip', 'Drive to mountains', '2025-04-04T09:00:00Z');
            INSERT INTO participants (id, name, activity_id, created_at) VALUES
            ('p7', 'Grace', 'a4', '2025-04-04T09:01:00Z'),
            ('p8', 'Hank', 'a4', '2025-04-04T09:01:30Z');

            -- ACTIVITY 5: BBQ Party
            INSERT INTO activities (id, title, note, created_at) VALUES
            ('a5', 'BBQ Party', 'Grill and chill', '2025-04-05T14:00:00Z');
            INSERT INTO participants (id, name, activity_id, created_at) VALUES
            ('p9', 'Ivy', 'a5', '2025-04-05T14:01:00Z'),
            ('p10', 'Jack', 'a5', '2025-04-05T14:01:30Z');

            -- ACTIVITY 6: Game Night
            INSERT INTO activities (id, title, note, created_at) VALUES
            ('a6', 'Game Night', 'Board games and snacks', '2025-04-06T18:00:00Z');
            INSERT INTO participants (id, name, activity_id, created_at) VALUES
            ('p11', 'Kim', 'a6', '2025-04-06T18:01:00Z'),
            ('p12', 'Leo', 'a6', '2025-04-06T18:01:30Z'),
            ('p13', 'Mona', 'a6', '2025-04-06T18:02:00Z');

            -- ACTIVITY 7: Camping
            INSERT INTO activities (id, title, note, created_at) VALUES
            ('a7', 'Camping', 'Weekend nature retreat', '2025-04-07T10:00:00Z');
            INSERT INTO participants (id, name, activity_id, created_at) VALUES
            ('p14', 'Nina', 'a7', '2025-04-07T10:01:00Z'),
            ('p15', 'Oscar', 'a7', '2025-04-07T10:01:30Z');

            -- ACTIVITY 8: Study Group
            INSERT INTO activities (id, title, note, created_at) VALUES
            ('a8', 'Study Group', 'Final exam prep', '2025-04-08T17:00:00Z');
            INSERT INTO participants (id, name, activity_id, created_at) VALUES
            ('p16', 'Paul', 'a8', '2025-04-08T17:01:00Z'),
            ('p17', 'Quinn', 'a8', '2025-04-08T17:01:30Z');

            -- ACTIVITY 9: Potluck
            INSERT INTO activities (id, title, note, created_at) VALUES
            ('a9', 'Potluck', 'Food sharing event', '2025-04-09T13:00:00Z');
            INSERT INTO participants (id, name, activity_id, created_at) VALUES
            ('p18', 'Rita', 'a9', '2025-04-09T13:01:00Z'),
            ('p19', 'Sam', 'a9', '2025-04-09T13:01:30Z');

            -- ACTIVITY 10: Soccer Match
            INSERT INTO activities (id, title, note, created_at) VALUES
            ('a10', 'Soccer Match', 'Friendly match', '2025-04-10T08:00:00Z');
            INSERT INTO participants (id, name, activity_id, created_at) VALUES
            ('p20', 'Tom', 'a10', '2025-04-10T08:01:00Z'),
            ('p21', 'Uma', 'a10', '2025-04-10T08:01:30Z');

            INSERT INTO activity_types (name, description, icon) VALUES
            ('Travel', 'Activities related to traveling and exploring new destinations', '✈️'),
            ('Party', 'Events organized for fun and socializing with music and entertainment', '🎉'),
            ('Vacation', 'Trips taken for relaxation and enjoyment', '🏖️'),
            ('Festival', 'Celebrations and events typically involving entertainment and cultural experiences', '🎪'),
            ('Gifts', 'Activities revolving around giving and receiving presents', '🎁'),
            ('Business', 'Events related to professional meetings, networking, or corporate activities', '💼'),
            ('Conference', 'Formal meetings for discussions, usually related to a particular topic or industry', '🗣️'),
            ('Family', 'Activities involving family gatherings and interactions', '👨‍👩‍👧‍👦'),
            ('Hangout', 'Casual socializing and spending time together in informal settings', '🍻'),
            ('Project', 'Collaborative work events or team-based activities', '💻'),
            ('Sports', 'Physical activities involving competition or teamwork', '⚽'),
            ('Workshop', 'Educational or hands-on training events to learn something new', '🛠️'),
            ('Socials', 'General social gatherings or casual events for interaction', '🍹'),
            ('Other', 'Other activity not listed', '❓');
            `)
        })
    }

    public static async query(query: string, params: any[] = []): Promise<any[]> {
        const db = await SQLiteAdapter.db()
        return db.getAllAsync(query, params)
    }

    public static async first(query: string, params: any[] = []): Promise<any> {
        const db = await SQLiteAdapter.db()
        return db.getFirstAsync(query, params)
    }

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

    public static async update(table: string, id: string, data: { [key: string]: string | number }): Promise<any> {
        const columns = Object.keys(data);
        const placeholders = columns.map((col) => `${col} = ?`).join(", ");
        const query = `UPDATE ${table} SET ${placeholders} WHERE id = ?`;
        const values = columns.map((col) => data[col]);
        return await this.query(query, [...values, id]);
    }

    public static async delete(table: string, id: string): Promise<any> {
        const query = `DELETE FROM ${table} WHERE id = ?`;
        return await this.query(query, [id])
    }
}