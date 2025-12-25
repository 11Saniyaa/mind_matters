-- SQL Queries to View Entered Details in MySQL Workbench

-- ============================================
-- VIEW ALL USERS
-- ============================================
SELECT 
    id,
    name,
    email,
    created_at,
    updated_at
FROM users
ORDER BY created_at DESC;

-- ============================================
-- VIEW ALL JOURNAL ENTRIES
-- ============================================
SELECT 
    je.id,
    je.user_id,
    u.name AS user_name,
    u.email AS user_email,
    je.mood,
    je.title,
    je.content,
    je.tags,
    je.mood_score,
    je.created_at,
    je.updated_at
FROM journal_entries je
LEFT JOIN users u ON je.user_id = u.id
ORDER BY je.created_at DESC;

-- ============================================
-- VIEW JOURNAL ENTRIES FOR SPECIFIC USER
-- ============================================
-- Replace 1 with the user_id you want to see
SELECT 
    id,
    mood,
    title,
    content,
    tags,
    mood_score,
    created_at
FROM journal_entries
WHERE user_id = 1
ORDER BY created_at DESC;

-- ============================================
-- VIEW CHAT MESSAGES
-- ============================================
SELECT 
    cm.id,
    cm.user_id,
    u.name AS user_name,
    cm.message,
    cm.response,
    cm.timestamp
FROM chat_messages cm
LEFT JOIN users u ON cm.user_id = u.id
ORDER BY cm.timestamp DESC
LIMIT 50;

-- ============================================
-- COUNT ENTRIES PER USER
-- ============================================
SELECT 
    u.id,
    u.name,
    u.email,
    COUNT(je.id) AS total_journal_entries,
    COUNT(cm.id) AS total_chat_messages
FROM users u
LEFT JOIN journal_entries je ON u.id = je.user_id
LEFT JOIN chat_messages cm ON u.id = cm.user_id
GROUP BY u.id, u.name, u.email
ORDER BY total_journal_entries DESC;

-- ============================================
-- VIEW RECENT ACTIVITY (Last 10 entries)
-- ============================================
SELECT 
    'Journal Entry' AS type,
    je.id,
    u.name AS user_name,
    je.title AS content_preview,
    je.created_at
FROM journal_entries je
JOIN users u ON je.user_id = u.id
UNION ALL
SELECT 
    'Chat Message' AS type,
    cm.id,
    u.name AS user_name,
    LEFT(cm.message, 50) AS content_preview,
    cm.timestamp AS created_at
FROM chat_messages cm
JOIN users u ON cm.user_id = u.id
ORDER BY created_at DESC
LIMIT 10;


