import { DB } from "./db";

export async function init() {
    // Register observers outside of transaction
    DB.register("expenses", "insert", (payload: any) => {
        const aid = Array.isArray(payload)
            ? payload[0].activityId
            : payload.activityId;
        DB.query(
            `
          UPDATE participants SET 
          totalPaid = (
              SELECT COALESCE(SUM(e.amount), 0)
              FROM expenses e
              WHERE e.paidBy = participants.id
          ) WHERE activityId = ?
        `,
            [aid]
        );
    });

    DB.register("expenses", ["delete", "update"], (payload: any) => {
        const aid = Array.isArray(payload)
            ? payload[0].activityId
            : payload.activityId;
        DB.query(
            `
          UPDATE participants SET 
          totalPaid = (
              SELECT COALESCE(SUM(e.amount), 0)
              FROM expenses e
              WHERE e.paidBy = participants.id
          ),
          totalOwed = (
              SELECT COALESCE(SUM(
                e.amount / (
                    SELECT COUNT(*)
                    FROM participant_expenses pe2
                    WHERE pe2.expenseId = e.id
                )
              ), 0)
              FROM expenses e
              JOIN participant_expenses pe ON pe.expenseId = e.id
              WHERE pe.participantId = participants.id
            )
           WHERE activityId = ?
        `,
            [aid]
        );
    });



    DB.register("participants", ["insert", "delete"], (payload: any) => {
        const aid = (Array.isArray(payload)
            ? payload[0].activityId
            : payload.activityId);
        DB.query(
            `
          UPDATE participants SET
          totalOwed = (
              SELECT COALESCE(SUM(
                e.amount / (
                    SELECT COUNT(*) 
                    FROM participant_expenses pe2 
                    WHERE pe2.expenseId = e.id
                )
              ), 0)
              FROM expenses e
              JOIN participant_expenses pe ON pe.expenseId = e.id
              WHERE pe.participantId = participants.id
            )
          WHERE activityId = ?;
        `,
            [aid]
        );
    });

    DB.register("participant_expenses", ["insert", "delete"], (payload: any) => {
        const pid = Array.isArray(payload)
            ? payload.map((pe) => pe.participantId)
            : [payload.participantId];
        DB.query(
            `
          UPDATE participants SET
          totalOwed = (
              SELECT COALESCE(SUM(
                e.amount / (
                    SELECT COUNT(*) 
                    FROM participant_expenses pe2 
                    WHERE pe2.expenseId = e.id
                )
              ), 0)
              FROM expenses e
              JOIN participant_expenses pe ON pe.expenseId = e.id
              WHERE pe.participantId = participants.id
            )
          WHERE id IN (${pid.map(() => "?").join(", ")});
        `,
            pid
        );
    });
}