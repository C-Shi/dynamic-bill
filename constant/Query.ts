const EXPENSE_BREAKDOWN_QUERY = `
        WITH
        expense_involved AS (
        SELECT
            e.id,
            e.description AS expense_name,
            e.amount
        FROM expenses e
        JOIN participant_expenses pe ON pe.expenseId = e.id
        WHERE pe.participantId = ?
        ),
        expense_paid AS (
        SELECT
            id AS expenseId,
            amount
        FROM expenses
        WHERE paidBy = ?
        ),
        expense_portion AS (
        SELECT
            pe.expenseId,
            1.0 * ei.amount / COUNT(*) AS participant_portion
        FROM participant_expenses pe
        JOIN expense_involved ei ON ei.id = pe.expenseId
        GROUP BY pe.expenseId
        )
        SELECT
        ei.id,
        ei.expense_name AS expenseName,
        ei.amount AS total,
        ep.amount AS youPaid,
        p.participant_portion AS yourPortion
        FROM expense_involved ei
        LEFT JOIN expense_paid ep ON ei.id = ep.expenseId
        LEFT JOIN expense_portion p ON ei.id = p.expenseId;
        `

const EXPENSE_PARTICIPANT_PAYMENT_BREAKDOWN_QUERY = `
    SELECT participants.name,
    CASE
        WHEN (participants.id = expenses.paidBy) THEN 1
        ELSE 0
    END AS payer FROM expenses
    JOIN participant_expenses ON expenses.id = participant_expenses.expenseId
    JOIN participants ON participant_expenses.participantId = participants.id
    WHERE expenses.id = ?;
`

const ACTIVITIES_QUERY = `
    SELECT a.*, GROUP_CONCAT(DISTINCT p.name) AS participants,
    (SELECT IFNULL(SUM(amount), 0) FROM expenses e WHERE e.activityId = a.id) AS totals
    FROM activities a LEFT JOIN participants p ON a.id = p.activityId WHERE a.status = ?
    GROUP BY a.id;
`

const ACTIVITY_QUERY = `
      SELECT a.*, GROUP_CONCAT(DISTINCT p.name) AS participants,
      (SELECT IFNULL(SUM(amount), 0) FROM expenses e WHERE e.activityId = a.id) AS totals
      FROM activities a LEFT JOIN participants p ON a.id = p.activityId 
      WHERE a.status = ? AND a.id = ? GROUP BY a.id;
    `

export {
    EXPENSE_BREAKDOWN_QUERY,
    EXPENSE_PARTICIPANT_PAYMENT_BREAKDOWN_QUERY,
    ACTIVITIES_QUERY,
    ACTIVITY_QUERY
};
