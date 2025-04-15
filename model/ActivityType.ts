import { DB } from "@/utils/db";

export class ActivityType {
    public static async all() {
        const db = await DB.db()
        return db.getAllAsync('SELECT * FROM activity_types')
    }
}