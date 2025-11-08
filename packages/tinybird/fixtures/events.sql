SELECT
    concat('id_', toString(rand() % 10000)) AS id,
    concat('project_', toString(rand() % 100)) AS project_key,
    concat('session_', toString(rand() % 5000)) AS session_id,
    multiIf(rand() % 10 > 1, concat('flow_', toString(rand() % 200)), NULL) AS flow_id,
    multiIf(rand() % 10 > 1, concat('step_', toString(rand() % 50)), NULL) AS step_id,
    multiIf(rand() % 10 > 1, concat('funnel_', toString(rand() % 30)), NULL) AS funnel_slug,
    ['pageview', 'click', 'form_submit', 'scroll', 'exit'][rand() % 5 + 1] AS event_type,
    toDateTime64(now() - rand() % 86400, 3) AS timestamp,
    multiIf(rand() % 10 > 2, concat('{', '"user_agent":"Mozilla/5.0", "device":"', ['desktop', 'mobile', 'tablet'][rand() % 3 + 1], '"}'), NULL) AS metadata,
    concat('https://example.com/', ['home', 'products', 'about', 'contact', 'blog'][rand() % 5 + 1]) AS url,
    multiIf(rand() % 10 > 3, concat('https://referrer.com/', ['search', 'social', 'email', 'direct'][rand() % 4 + 1]), NULL) AS referrer
FROM numbers(10)