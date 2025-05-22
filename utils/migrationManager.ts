import { SQLiteAdapter } from "./SQLiteAdapter";

// Define all database migrations in order of version
const MIGRATIONS = [
    {
        version: 1,
        up: async () => {
            // Migration 1: Creates initial database schema
            const db = await SQLiteAdapter.db()
            await db.withTransactionAsync(async () => {
                // Drop existing tables to ensure clean state
                await db.execAsync(`
                    DROP TABLE IF EXISTS activities;
                    DROP TABLE IF EXISTS participants;
                    DROP TABLE IF EXISTS expenses;
                    DROP TABLE IF EXISTS participant_expenses;
                    DROP TABLE IF EXISTS activity_types;
                `)

                // Create core tables with proper relationships
                await db.execAsync(`
                    CREATE TABLE IF NOT EXISTS activities (
                        id TEXT PRIMARY KEY,
                        title TEXT NOT NULL,
                        budget REAL DEFAULT NULL,
                        note TEXT,
                        type TEXT DEFAULT 'Other',
                        created_at TIMESTAMP NOT NULL
                    );
                `)

                await db.execAsync(`
                    CREATE TABLE IF NOT EXISTS participants (
                        id TEXT PRIMARY KEY,
                        name TEXT NOT NULL,
                        activity_id TEXT NOT NULL,
                        total_paid REAL DEFAULT 0,
                        total_owed REAL DEFAULT 0,
                        created_at TIMESTAMP NOT NULL,
                        FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE
                    );
                `)

                await db.execAsync(`
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
                `)

                await db.execAsync(`
                    CREATE TABLE IF NOT EXISTS participant_expenses (
                        id TEXT PRIMARY KEY,
                        participant_id TEXT NOT NULL,
                        expense_id TEXT NOT NULL,
                        created_at TIMESTAMP NOT NULL,
                        FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE,
                        FOREIGN KEY (expense_id) REFERENCES expenses(id) ON DELETE CASCADE
                    );
                `)

                await db.execAsync(`
                    CREATE TABLE IF NOT EXISTS activity_types (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL,
                        description TEXT,
                        icon TEXT
                    ); 
                `)
            })
            console.log("Migrated to version 1")
        },
        down: async () => {
            // Rollback migration 1: Drops all tables and removes migration record
            const db = await SQLiteAdapter.db()
            await db.withTransactionAsync(async () => {
                await db.execAsync(`
                    DROP TABLE IF EXISTS activities;
                    DROP TABLE IF EXISTS participants;
                    DROP TABLE IF EXISTS expenses;
                    DROP TABLE IF EXISTS participant_expenses;
                    DROP TABLE IF EXISTS activity_types;

                    DELETE FROM migrations WHERE version = 0;
                `)
            })
        }
    },
    {
        version: 2,
        up: async () => {
            // Migration 2: Seeds initial activity types
            const db = await SQLiteAdapter.db()
            await db.withTransactionAsync(async () => {
                await db.execAsync(`
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
            console.log("Migrated to version 2")
        },
        down: async () => {
            // Rollback migration 2: Removes all activity types
            const db = await SQLiteAdapter.db()
            await db.withTransactionAsync(async () => {
                await db.execAsync(`
                    DELETE FROM activity_types;
                `)
            })
        }
    }
]

// Main migration function that runs all pending migrations
export async function migrate() {
    // Get current database version
    const currentVersion = await SQLiteAdapter.first("SELECT version FROM migrations")
    // Filter migrations that need to be run (version > current)
    const migrationsToRun = MIGRATIONS.filter(migration => migration.version > currentVersion?.version)
    if (__DEV__) {
        console.log("Current DB version:", currentVersion)
        if (migrationsToRun.length === 0) {
            console.log("No migrations to run")
        }
    }
    // Run each migration in sequence
    for (const migration of migrationsToRun) {
        await migration.up()
        await SQLiteAdapter.query("UPDATE migrations SET version = ?, created_at = ?", [migration.version, new Date().toISOString()])
    }
}

// Rollback function to revert migrations
export async function rollback() {
    // Get current version and find migrations to rollback
    const currentVersion = await SQLiteAdapter.first("SELECT version FROM migrations")
    const migrationsToRollback = MIGRATIONS.filter(migration => migration.version < currentVersion)
    // Run down migrations in sequence
    for (const migration of migrationsToRollback) {
        await migration.down()
    }
}