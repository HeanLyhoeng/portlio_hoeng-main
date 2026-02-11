-- ============================================
-- GET ALL ORDERS FROM LAST WEEK
-- ============================================
-- This query retrieves all orders from the past 7 days
-- Adjust the date range as needed for your specific requirements

-- Option 1: Last 7 days (rolling window)
SELECT *
FROM public.orders
WHERE created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;

-- Option 2: Last calendar week (Monday to Sunday)
SELECT *
FROM public.orders
WHERE created_at >= DATE_TRUNC('week', NOW()) - INTERVAL '1 week'
  AND created_at < DATE_TRUNC('week', NOW())
ORDER BY created_at DESC;

-- Option 3: Last complete week (previous Monday 00:00 to last Sunday 23:59:59)
SELECT *
FROM public.orders
WHERE created_at >= DATE_TRUNC('week', NOW() - INTERVAL '1 week')
  AND created_at < DATE_TRUNC('week', NOW())
ORDER BY created_at DESC;

-- Option 4: Last 7 days with additional filtering (if you need more details)
SELECT 
    o.*,
    u.email as customer_email,
    COUNT(oi.id) as total_items,
    SUM(oi.quantity * oi.price) as total_amount
FROM public.orders o
LEFT JOIN auth.users u ON o.user_id = u.id
LEFT JOIN public.order_items oi ON o.id = oi.order_id
WHERE o.created_at >= NOW() - INTERVAL '7 days'
GROUP BY o.id, u.email
ORDER BY o.created_at DESC;

-- Note: Adjust table names (orders, order_items) and column names based on your actual schema
