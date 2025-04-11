import { v4 as uuidv4 } from 'uuid';

export abstract class BaseEntity {
    id: string;
    createdAt: Date;

    constructor(data?: { id?: string; createdAt?: Date }) {
        this.id = data?.id ?? uuidv4();
        this.createdAt = data?.createdAt ?? new Date();
    }
}
export interface BaseModel<T extends BaseEntity> {
    toEntity(): T;
}
