import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export abstract class Model {
    id: string;
    createdAt: Date;
    protected static _table: string;
    private static _query: string;

    constructor(data?: { id?: string; createdAt?: Date }) {
        this.id = data?.id ?? uuidv4()
        this.createdAt = data?.createdAt ? new Date(data.createdAt) : new Date();
    }

    public abstract toEntity(): { [key: string]: any };
}
