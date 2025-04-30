import { Model } from './Core';

export class Participant extends Model {
    constructor(participant: { [key: string]: any }) {
        super(participant)
        this.name = participant.name;
        if (participant.activityId) {
            this.activityId = participant.activityId;
        } else if (participant.activity_id) {
            this.activityId = participant.activity_id;
        }
        if (participant.total_owed) {
            this.totalOwed = participant.total_owed;
        }
        if (participant.totalOwed) {
            this.totalOwed = participant.totalOwed;
        }
        if (participant.total_paid) {
            this.totalPaid = participant.total_paid;
        }
        if (participant.totalPaid) {
            this.totalPaid = participant.totalPaid;
        }
    }

    name: string;
    activityId!: string;
    totalOwed: number = 0;
    totalPaid: number = 0;

    public toEntity(): { [key: string]: any } {
        return {
            id: this.id,
            name: this.name,
            activity_id: this.activityId,
            total_owed: this.totalOwed,
            total_paid: this.totalPaid,
            created_at: this.createdAt.toISOString()
        }

    }

    get net(): number {
        return this.totalPaid - this.totalOwed
    }
}