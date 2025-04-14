import * as SQLite from 'expo-sqlite';

export class DB {
    private static instance: SQLite.SQLiteDatabase | null = null;

    private constructor() { }

    public static async db(): Promise<SQLite.SQLiteDatabase> {
        if (DB.instance === null) {
            DB.instance = await SQLite.openDatabaseAsync("app.db")
            await DB.instance.execAsync("PRAGMA journal_mode = 'wal'")
        }
        return DB.instance
    }

    public static async init(): Promise<void> {
        const db = await DB.db()
        if (__DEV__) {
            console.log('Database location:', db.databasePath)
        }
        await db.withTransactionAsync(async () => {
            await db.execAsync(`
                CREATE TABLE IF NOT EXISTS activities (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                note TEXT,
                createdAt TIMESTAMP NOT NULL
                );
    
                CREATE TABLE IF NOT EXISTS participants (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                activityId TEXT NOT NULL,
                createdAt TIMESTAMP NOT NULL,
                FOREIGN KEY (activityId) REFERENCES activities(id) ON DELETE CASCADE
                );
    
                CREATE TABLE IF NOT EXISTS expenses (
                id TEXT PRIMARY KEY,
                description TEXT NOT NULL,
                amount REAL NOT NULL,
                paidBy TEXT NOT NULL,
                activityId TEXT NOT NULL,
                date TEXT NOT NULL,
                createdAt TIMESTAMP NOT NULL,
                FOREIGN KEY (paidBy) REFERENCES participants(id),
                FOREIGN KEY (activityId) REFERENCES activities(id) ON DELETE CASCADE
                );
    
                CREATE TABLE IF NOT EXISTS participant_expenses (
                id TEXT PRIMARY KEY,
                participantId TEXT NOT NULL,
                expenseId TEXT NOT NULL,
                createdAt TIMESTAMP NOT NULL,
                FOREIGN KEY (participantId) REFERENCES participants(id) ON DELETE CASCADE,
                FOREIGN KEY (expenseId) REFERENCES expenses(id) ON DELETE CASCADE);
            `)
        })
    }

    public static async seed(): Promise<void> {
        const db = await DB.db()
        await db.withTransactionAsync(async () => {
            await db.execAsync(`
            DELETE FROM participant_expenses;
            DELETE FROM expenses;
            DELETE FROM participants;
            DELETE FROM activities;

            -- Seed 10 activities with participants and expenses

            -- ACTIVITY 1: Movie Night
            INSERT INTO activities (id, title, note, createdAt) VALUES
            ('a1', 'Movie Night', 'Watched a new release', '2025-04-01T18:00:00Z');
            INSERT INTO participants (id, name, activityId, createdAt) VALUES
            ('p1', 'Alice', 'a1', '2025-04-01T18:01:00Z'),
            ('p2', 'Bob', 'a1', '2025-04-01T18:01:30Z');
            INSERT INTO expenses (id, description, amount, paidBy, activityId, date, createdAt) VALUES
            ('e1', 'Tickets', 30.00, 'p1', 'a1', '2025-04-01', '2025-04-01T18:10:00Z');

            -- ACTIVITY 2: Dinner
            INSERT INTO activities (id, title, note, createdAt) VALUES
            ('a2', 'Dinner Out', 'Group dinner at Italian place', '2025-04-02T20:00:00Z');
            INSERT INTO participants (id, name, activityId, createdAt) VALUES
            ('p3', 'Charlie', 'a2', '2025-04-02T20:01:00Z'),
            ('p4', 'Diana', 'a2', '2025-04-02T20:01:30Z');
            INSERT INTO expenses (id, description, amount, paidBy, activityId, date, createdAt) VALUES
            ('e2', 'Meal', 55.00, 'p3', 'a2', '2025-04-02', '2025-04-02T20:10:00Z');

            -- ACTIVITY 3: Bowling
            INSERT INTO activities (id, title, note, createdAt) VALUES
            ('a3', 'Bowling', 'Weekend bowling fun', '2025-04-03T16:00:00Z');
            INSERT INTO participants (id, name, activityId, createdAt) VALUES
            ('p5', 'Eve', 'a3', '2025-04-03T16:01:00Z'),
            ('p6', 'Frank', 'a3', '2025-04-03T16:01:30Z');
            INSERT INTO expenses (id, description, amount, paidBy, activityId, date, createdAt) VALUES
            ('e3', 'Lane Rental', 40.00, 'p5', 'a3', '2025-04-03', '2025-04-03T16:10:00Z');

            -- ACTIVITY 4: Road Trip
            INSERT INTO activities (id, title, note, createdAt) VALUES
            ('a4', 'Road Trip', 'Drive to mountains', '2025-04-04T09:00:00Z');
            INSERT INTO participants (id, name, activityId, createdAt) VALUES
            ('p7', 'Grace', 'a4', '2025-04-04T09:01:00Z'),
            ('p8', 'Hank', 'a4', '2025-04-04T09:01:30Z');
            INSERT INTO expenses (id, description, amount, paidBy, activityId, date, createdAt) VALUES
            ('e4', 'Gas', 60.00, 'p7', 'a4', '2025-04-04', '2025-04-04T09:10:00Z');

            -- ACTIVITY 5: BBQ Party
            INSERT INTO activities (id, title, note, createdAt) VALUES
            ('a5', 'BBQ Party', 'Grill and chill', '2025-04-05T14:00:00Z');
            INSERT INTO participants (id, name, activityId, createdAt) VALUES
            ('p9', 'Ivy', 'a5', '2025-04-05T14:01:00Z'),
            ('p10', 'Jack', 'a5', '2025-04-05T14:01:30Z');
            INSERT INTO expenses (id, description, amount, paidBy, activityId, date, createdAt) VALUES
            ('e5', 'Groceries', 80.00, 'p10', 'a5', '2025-04-05', '2025-04-05T14:10:00Z');

            -- ACTIVITY 6: Game Night
            INSERT INTO activities (id, title, note, createdAt) VALUES
            ('a6', 'Game Night', 'Board games and snacks', '2025-04-06T18:00:00Z');
            INSERT INTO participants (id, name, activityId, createdAt) VALUES
            ('p11', 'Kim', 'a6', '2025-04-06T18:01:00Z'),
            ('p12', 'Leo', 'a6', '2025-04-06T18:01:30Z'),
            ('p13', 'Mona', 'a6', '2025-04-06T18:02:00Z');
            INSERT INTO expenses (id, description, amount, paidBy, activityId, date, createdAt) VALUES
            ('e6', 'Snacks', 25.00, 'p11', 'a6', '2025-04-06', '2025-04-06T18:10:00Z');

            -- ACTIVITY 7: Camping
            INSERT INTO activities (id, title, note, createdAt) VALUES
            ('a7', 'Camping', 'Weekend nature retreat', '2025-04-07T10:00:00Z');
            INSERT INTO participants (id, name, activityId, createdAt) VALUES
            ('p14', 'Nina', 'a7', '2025-04-07T10:01:00Z'),
            ('p15', 'Oscar', 'a7', '2025-04-07T10:01:30Z');
            INSERT INTO expenses (id, description, amount, paidBy, activityId, date, createdAt) VALUES
            ('e7', 'Tent Rental', 45.00, 'p14', 'a7', '2025-04-07', '2025-04-07T10:10:00Z');

            -- ACTIVITY 8: Study Group
            INSERT INTO activities (id, title, note, createdAt) VALUES
            ('a8', 'Study Group', 'Final exam prep', '2025-04-08T17:00:00Z');
            INSERT INTO participants (id, name, activityId, createdAt) VALUES
            ('p16', 'Paul', 'a8', '2025-04-08T17:01:00Z'),
            ('p17', 'Quinn', 'a8', '2025-04-08T17:01:30Z');
            INSERT INTO expenses (id, description, amount, paidBy, activityId, date, createdAt) VALUES
            ('e8', 'Pizza', 22.00, 'p17', 'a8', '2025-04-08', '2025-04-08T17:10:00Z');

            -- ACTIVITY 9: Potluck
            INSERT INTO activities (id, title, note, createdAt) VALUES
            ('a9', 'Potluck', 'Food sharing event', '2025-04-09T13:00:00Z');
            INSERT INTO participants (id, name, activityId, createdAt) VALUES
            ('p18', 'Rita', 'a9', '2025-04-09T13:01:00Z'),
            ('p19', 'Sam', 'a9', '2025-04-09T13:01:30Z');
            INSERT INTO expenses (id, description, amount, paidBy, activityId, date, createdAt) VALUES
            ('e9', 'Decorations', 15.00, 'p18', 'a9', '2025-04-09', '2025-04-09T13:10:00Z');

            -- ACTIVITY 10: Soccer Match
            INSERT INTO activities (id, title, note, createdAt) VALUES
            ('a10', 'Soccer Match', 'Friendly match', '2025-04-10T08:00:00Z');
            INSERT INTO participants (id, name, activityId, createdAt) VALUES
            ('p20', 'Tom', 'a10', '2025-04-10T08:01:00Z'),
            ('p21', 'Uma', 'a10', '2025-04-10T08:01:30Z');
            INSERT INTO expenses (id, description, amount, paidBy, activityId, date, createdAt) VALUES
            ('e10', 'Field Rental', 35.00, 'p20', 'a10', '2025-04-10', '2025-04-10T08:10:00Z');

            `)
        })
    }
}
