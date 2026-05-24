INSERT INTO lead (
    full_name,
    company,
    phone_number,
    status,
    follow_up_at,
    created_at,
    updated_at
) VALUES
(
    'Rahul Sharma',
    'FinEdge',
    '9876543210',
    'NEW',
    '2026-05-25 10:00:00',
    NOW(),
    NOW()
),
(
    'Priya Nair',
    'HealthSync',
    '9123456780',
    'CONTACTED',
    '2026-05-24 15:30:00',
    NOW(),
    NOW()
),
(
    'Arjun Verma',
    'RetailIQ',
    '9988776655',
    'QUALIFIED',
    '2026-05-26 11:00:00',
    NOW(),
    NOW()
),
(
    'Sneha Kapoor',
    'EduFlow',
    '9012345678',
    'PROPOSAL_SENT',
    '2026-05-27 14:00:00',
    NOW(),
    NOW()
),
(
    'Vikram Joshi',
    'MediaPulse',
    '9090909090',
    'WON',
    NULL,
    NOW(),
    NOW()
);