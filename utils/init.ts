import { DB } from "./db";

export async function init() {
    DB.transaction(async () => {
        DB.register("expenses", "insert", (payload: any) => {
            const aid = Array.isArray(payload)
                ? payload[0].activity_id
                : payload.activity_id;
            DB.query(
                `
              UPDATE participants SET 
              total_paid = (
                  SELECT COALESCE(SUM(e.amount), 0)
                  FROM expenses e
                  WHERE e.paid_by = participants.id
              ) WHERE activity_id = ?
            `,
                [aid]
            );
        });
        DB.register("participants", "insert", (payload: any) => {
            const aid = Array.isArray(payload)
                ? payload[0].activity_id
                : payload.activity_id;
            DB.query(
                `
              UPDATE participants SET
              total_owed = (
                  SELECT COALESCE(SUM(
                    e.amount / (
                        SELECT COUNT(*) 
                        FROM participant_expenses pe2 
                        WHERE pe2.expense_id = e.id
                    )
                  ), 0)
                  FROM expenses e
                  JOIN participant_expenses pe ON pe.expense_id = e.id
                  WHERE pe.participant_id = participants.id
                )
              WHERE activity_id = ?;
            `,
                [aid]
            );
        });
        DB.register("participant_expenses", "insert", (payload: any) => {
            const pid = Array.isArray(payload)
                ? payload.map((pe) => pe.participant_id)
                : [payload.participant_id];
            DB.query(
                `
              UPDATE participants SET
              total_owed = (
                  SELECT COALESCE(SUM(
                    e.amount / (
                        SELECT COUNT(*) 
                        FROM participant_expenses pe2 
                        WHERE pe2.expense_id = e.id
                    )
                  ), 0)
                  FROM expenses e
                  JOIN participant_expenses pe ON pe.expense_id = e.id
                  WHERE pe.participant_id = participants.id
                )
              WHERE id IN (${pid.map(() => "?").join(", ")});
            `,
                pid
            );
        });
    })
}