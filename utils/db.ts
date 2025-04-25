import { SQLiteAdapter } from "./SQLiteAdapter";

interface IDatabaseAdapter {
    db: any;
    init(): Promise<void>;
    seed(): Promise<void>;
    query(query: string, params: any[]): Promise<any[]>;
    first(query: string, params: any[]): Promise<any>;
    get(table: string, where?: { [key: string]: [string, string] }): Promise<any[]>;
    insert(table: string, data: { [key: string]: string | number } | { [key: string]: string | number }[]): Promise<any>;
    delete(table: string, id: string): Promise<void>;
}

export class DB {
    private static adapter: IDatabaseAdapter = SQLiteAdapter;

    static setAdapter(adapter: IDatabaseAdapter) {
        DB.adapter = adapter
    }

    static async init(): Promise<void> {
        return DB.adapter.init()
    }

    static async seed(): Promise<void> {
        return DB.adapter.seed()
    }

    static async query(query: string, params?: any): Promise<any> {
        console.debug(`Query: ${query} with Params ${params} - DB.query`)
        return DB.adapter.query(query, params)
    }

    static async first(query: string, params?: any): Promise<any> {
        console.debug(`Query: ${query} with Params ${params} - DB.first`)
        return DB.adapter.first(query, params)
    }

    static async get(table: string, where?: { [key: string]: [string, string] }): Promise<any> {
        console.log(`Table: ${table} - DB.get`)
        return DB.adapter.get(table, where);
    }

    public static async insert(table: string, data: { [key: string]: string | number } | { [key: string]: string | number }[]): Promise<any> {
        console.log(`Table ${table} - DB.Insert`)
        return DB.adapter.insert(table, data)
    }

    public static async delete(table: string, id: string): Promise<void> {
        console.log(`Table ${table} DELETE ${id}`)
        DB.adapter.delete(table, id)
    }
}