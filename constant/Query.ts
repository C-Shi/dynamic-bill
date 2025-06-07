const EXPENSE_BREAKDOWN_QUERY = `
        WITH
        expense_involved AS (
        SELECT
            e.id,
            e.description AS expense_name,
            e.amount
        FROM expenses e
        JOIN participant_expenses pe ON pe.expense_id = e.id
        WHERE pe.participant_id = ?
        ),
        expense_paid AS (
        SELECT
            id AS expense_id,
            amount
        FROM expenses
        WHERE paid_by = ?
        ),
        expense_portion AS (
        SELECT
            pe.expense_id,
            1.0 * ei.amount / COUNT(*) AS participant_portion
        FROM participant_expenses pe
        JOIN expense_involved ei ON ei.id = pe.expense_id
        GROUP BY pe.expense_id
        )
        SELECT
        ei.id,
        ei.expense_name AS expenseName,
        ei.amount AS total,
        ep.amount AS youPaid,
        p.participant_portion AS yourPortion
        FROM expense_involved ei
        LEFT JOIN expense_paid ep ON ei.id = ep.expense_id
        LEFT JOIN expense_portion p ON ei.id = p.expense_id;
        `

export { EXPENSE_BREAKDOWN_QUERY }