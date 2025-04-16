import { DB } from "@/utils/db";

export class ActivityType {
    public static async all() {
        return DB.query('SELECT * FROM activity_types')
    }
}