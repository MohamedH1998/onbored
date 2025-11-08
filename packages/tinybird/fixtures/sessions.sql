SELECT
    concat('sess_', toString(rand() % 1000000)) AS id,
    concat('proj_', toString(rand() % 100)) AS project_key,
    multiIf(rand() % 10 == 0, NULL, concat('user_', toString(rand() % 5000))) AS user_id,
    toDateTime64(now() - rand() % (86400 * 7), 3) AS started_at,
    toDateTime64(now() - rand() % 3600, 3) AS last_seen_at
FROM numbers(10)