-- Database reset and seed script for Pricing Plans
-- Run this in Supabase SQL Editor

BEGIN;

-- 1. Clear existing plan data (referencing foreign keys first)
TRUNCATE TABLE plan_features, plans RESTART IDENTITY CASCADE;

-- 2. Insert new Plans
INSERT INTO plans (name, price, description) VALUES
('Starter', 49, 'Beginner plan for personal use and new freelancers - 15 posters + 3 videos per month'),
('Creator', 99, 'Professional plan for regular social media creators - 40 posters + 10 videos per month'),
('Pro', 199, 'Advanced plan for small agencies and high-volume users - 100 posters + 25 videos per month');

-- 3. Insert Features for Starter Plan ($49)
INSERT INTO plan_features (plan_id, feature_id, value)
SELECT p.id, f.id, '✓ (Free .com included on yearly)'
FROM plans p, features f
WHERE p.name = 'Starter' AND f.name = 'Connect your own domain or watermark removal';

INSERT INTO plan_features (plan_id, feature_id, value)
SELECT p.id, f.id, 'Fixed'
FROM plans p, features f
WHERE p.name = 'Starter' AND f.name = 'Limits with usage';

INSERT INTO plan_features (plan_id, feature_id, value)
SELECT p.id, f.id, '15 posters + 3 videos'
FROM plans p, features f
WHERE p.name = 'Starter' AND f.name = 'Monthly posters and videos (Create custom social media posters/graphics/short videos)';

INSERT INTO plan_features (plan_id, feature_id, value)
SELECT p.id, f.id, '5'
FROM plans p, features f
WHERE p.name = 'Starter' AND f.name = 'Asset collections (Store templates/elements)';

INSERT INTO plan_features (plan_id, feature_id, value)
SELECT p.id, f.id, '2,000'
FROM plans p, features f
WHERE p.name = 'Starter' AND f.name = 'Assets/items (Add stock images, clips, fonts)';

INSERT INTO plan_features (plan_id, feature_id, value)
SELECT p.id, f.id, '20 GB'
FROM plans p, features f
WHERE p.name = 'Starter' AND f.name = 'Monthly storage with overage alerts';

INSERT INTO plan_features (plan_id, feature_id, value)
SELECT p.id, f.id, 'Standard (20 locations)'
FROM plans p, features f
WHERE p.name = 'Starter' AND f.name = 'Global delivery for fast exports/sharing';

INSERT INTO plan_features (plan_id, feature_id, value)
SELECT p.id, f.id, '✓'
FROM plans p, features f
WHERE p.name = 'Starter' AND f.name = 'Password protect projects';

INSERT INTO plan_features (plan_id, feature_id, value)
SELECT p.id, f.id, '✓'
FROM plans p, features f
WHERE p.name = 'Starter' AND f.name = 'Find assets/projects instantly';

INSERT INTO plan_features (plan_id, feature_id, value)
SELECT p.id, f.id, '1'
FROM plans p, features f
WHERE p.name = 'Starter' AND f.name = 'Maximum users with edit access';

INSERT INTO plan_features (plan_id, feature_id, value)
SELECT p.id, f.id, '$15/editor'
FROM plans p, features f
WHERE p.name = 'Starter' AND f.name = 'Additional editors (Design, edit, publish)';

INSERT INTO plan_features (plan_id, feature_id, value)
SELECT p.id, f.id, 'Max 5'
FROM plans p, features f
WHERE p.name = 'Starter' AND f.name = 'Translation locales (Translate designs/videos with AI)';

INSERT INTO plan_features (plan_id, feature_id, value)
SELECT p.id, f.id, '—'
FROM plans p, features f
WHERE p.name = 'Starter' AND f.name = 'A/B Testing (Run tests with real-time results)';

INSERT INTO plan_features (plan_id, feature_id, value)
SELECT p.id, f.id, '—'
FROM plans p, features f
WHERE p.name = 'Starter' AND f.name = 'Custom proxy (Multiple projects under one domain)';


-- 4. Insert Features for Creator Plan ($99)
INSERT INTO plan_features (plan_id, feature_id, value)
SELECT p.id, f.id, '✓ (Free .com included on yearly)'
FROM plans p, features f
WHERE p.name = 'Creator' AND f.name = 'Connect your own domain or watermark removal';

INSERT INTO plan_features (plan_id, feature_id, value)
SELECT p.id, f.id, 'Fixed'
FROM plans p, features f
WHERE p.name = 'Creator' AND f.name = 'Limits with usage';

INSERT INTO plan_features (plan_id, feature_id, value)
SELECT p.id, f.id, '40 posters + 10 videos'
FROM plans p, features f
WHERE p.name = 'Creator' AND f.name = 'Monthly posters and videos (Create custom social media posters/graphics/short videos)';

INSERT INTO plan_features (plan_id, feature_id, value)
SELECT p.id, f.id, '15'
FROM plans p, features f
WHERE p.name = 'Creator' AND f.name = 'Asset collections (Store templates/elements)';

INSERT INTO plan_features (plan_id, feature_id, value)
SELECT p.id, f.id, '5,000'
FROM plans p, features f
WHERE p.name = 'Creator' AND f.name = 'Assets/items (Add stock images, clips, fonts)';

INSERT INTO plan_features (plan_id, feature_id, value)
SELECT p.id, f.id, '80 GB'
FROM plans p, features f
WHERE p.name = 'Creator' AND f.name = 'Monthly storage with overage alerts';

INSERT INTO plan_features (plan_id, feature_id, value)
SELECT p.id, f.id, 'Fast (50 locations)'
FROM plans p, features f
WHERE p.name = 'Creator' AND f.name = 'Global delivery for fast exports/sharing';

INSERT INTO plan_features (plan_id, feature_id, value)
SELECT p.id, f.id, '✓'
FROM plans p, features f
WHERE p.name = 'Creator' AND f.name = 'Password protect projects';

INSERT INTO plan_features (plan_id, feature_id, value)
SELECT p.id, f.id, '✓'
FROM plans p, features f
WHERE p.name = 'Creator' AND f.name = 'Find assets/projects instantly';

INSERT INTO plan_features (plan_id, feature_id, value)
SELECT p.id, f.id, '5'
FROM plans p, features f
WHERE p.name = 'Creator' AND f.name = 'Maximum users with edit access';

INSERT INTO plan_features (plan_id, feature_id, value)
SELECT p.id, f.id, '$15/editor'
FROM plans p, features f
WHERE p.name = 'Creator' AND f.name = 'Additional editors (Design, edit, publish)';

INSERT INTO plan_features (plan_id, feature_id, value)
SELECT p.id, f.id, 'Max 15'
FROM plans p, features f
WHERE p.name = 'Creator' AND f.name = 'Translation locales (Translate designs/videos with AI)';

INSERT INTO plan_features (plan_id, feature_id, value)
SELECT p.id, f.id, '—'
FROM plans p, features f
WHERE p.name = 'Creator' AND f.name = 'A/B Testing (Run tests with real-time results)';

INSERT INTO plan_features (plan_id, feature_id, value)
SELECT p.id, f.id, '—'
FROM plans p, features f
WHERE p.name = 'Creator' AND f.name = 'Custom proxy (Multiple projects under one domain)';


-- 5. Insert Features for Pro Plan ($199)
INSERT INTO plan_features (plan_id, feature_id, value)
SELECT p.id, f.id, '✓ (Free .com included on yearly)'
FROM plans p, features f
WHERE p.name = 'Pro' AND f.name = 'Connect your own domain or watermark removal';

INSERT INTO plan_features (plan_id, feature_id, value)
SELECT p.id, f.id, 'Flexible (pay what you use)'
FROM plans p, features f
WHERE p.name = 'Pro' AND f.name = 'Limits with usage';

INSERT INTO plan_features (plan_id, feature_id, value)
SELECT p.id, f.id, '100 posters + 25 videos then $3/poster or $7/video extra'
FROM plans p, features f
WHERE p.name = 'Pro' AND f.name = 'Monthly posters and videos (Create custom social media posters/graphics/short videos)';

INSERT INTO plan_features (plan_id, feature_id, value)
SELECT p.id, f.id, '30'
FROM plans p, features f
WHERE p.name = 'Pro' AND f.name = 'Asset collections (Store templates/elements)';

INSERT INTO plan_features (plan_id, feature_id, value)
SELECT p.id, f.id, '15,000'
FROM plans p, features f
WHERE p.name = 'Pro' AND f.name = 'Assets/items (Add stock images, clips, fonts)';

INSERT INTO plan_features (plan_id, feature_id, value)
SELECT p.id, f.id, '200 GB'
FROM plans p, features f
WHERE p.name = 'Pro' AND f.name = 'Monthly storage with overage alerts';

INSERT INTO plan_features (plan_id, feature_id, value)
SELECT p.id, f.id, 'Priority (200+ locations)'
FROM plans p, features f
WHERE p.name = 'Pro' AND f.name = 'Global delivery for fast exports/sharing';

INSERT INTO plan_features (plan_id, feature_id, value)
SELECT p.id, f.id, '✓'
FROM plans p, features f
WHERE p.name = 'Pro' AND f.name = 'Password protect projects';

INSERT INTO plan_features (plan_id, feature_id, value)
SELECT p.id, f.id, '✓'
FROM plans p, features f
WHERE p.name = 'Pro' AND f.name = 'Find assets/projects instantly';

INSERT INTO plan_features (plan_id, feature_id, value)
SELECT p.id, f.id, '10+'
FROM plans p, features f
WHERE p.name = 'Pro' AND f.name = 'Maximum users with edit access';

INSERT INTO plan_features (plan_id, feature_id, value)
SELECT p.id, f.id, '$10–$15/extra'
FROM plans p, features f
WHERE p.name = 'Pro' AND f.name = 'Additional editors (Design, edit, publish)';

INSERT INTO plan_features (plan_id, feature_id, value)
SELECT p.id, f.id, 'Max 30'
FROM plans p, features f
WHERE p.name = 'Pro' AND f.name = 'Translation locales (Translate designs/videos with AI)';

INSERT INTO plan_features (plan_id, feature_id, value)
SELECT p.id, f.id, '$250 per 500k events'
FROM plans p, features f
WHERE p.name = 'Pro' AND f.name = 'A/B Testing (Run tests with real-time results)';

INSERT INTO plan_features (plan_id, feature_id, value)
SELECT p.id, f.id, '$150'
FROM plans p, features f
WHERE p.name = 'Pro' AND f.name = 'Custom proxy (Multiple projects under one domain)';

COMMIT;
