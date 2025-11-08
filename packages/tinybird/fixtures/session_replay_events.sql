SELECT
    concat('project_', toString(rand() % 100)) AS project_key,
    concat('session_', toString(rand() % 10000)) AS session_id,
    toDateTime64(now() - rand() % 86400, 3) AS timestamp,
    multiIf(
        rand() % 10 == 0, 
        NULL, 
        concat('{"action": "', ['click', 'scroll', 'view', 'submit', 'login'][rand() % 5 + 1], 
               '", "page": "', ['home', 'products', 'about', 'contact', 'checkout'][rand() % 5 + 1], 
               '", "user_id": ', toString(rand() % 1000), '}')
    ) AS event_data
FROM numbers(10)