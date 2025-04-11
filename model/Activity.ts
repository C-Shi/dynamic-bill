import { Participant } from "./Participant";
import { BaseEntity, BaseModel } from './Core'

export class ActivityEntity extends BaseEntity {
    constructor(activity: {
        id?: string;
        title: string;
        note?: string;
        createdAt?: Date;
    }) {
        super({ id: activity.id, createdAt: activity.createdAt })
        this.title = activity.title;
        if (activity.note) {
            this.note = activity.note;
        }
    }
    title!: string;
    note?: string;
}

export class Activity extends ActivityEntity implements BaseModel<ActivityEntity> {
    constructor(activity: ActivityEntity, participants?: Participant[]) {
        super(activity)
        if (participants) {
            this.participants = participants
        }
    }

    participants: Participant[] = []

    toEntity(): ActivityEntity {
        return new ActivityEntity({
            id: this.id,
            createdAt: this.createdAt,
            title: this.title,
            note: this.note
        })
    }
}
