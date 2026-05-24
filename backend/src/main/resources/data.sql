-- Seed sample Leads
INSERT INTO leads (
    id,
    full_name,
    company,
    phone_number,
    status,
    follow_up_at,
    created_at,
    updated_at
) VALUES
(
    1,
    'Rahul Sharma',
    'FinEdge Solutions',
    '+91 98765 43210',
    'NEW',
    '2026-05-25 10:00:00',
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '5 days'
),
(
    2,
    'Priya Nair',
    'HealthSync Biotech',
    '+91 91234 56780',
    'CONTACTED',
    '2026-05-24 15:30:00',
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '10 days'
),
(
    3,
    'Arjun Verma',
    'RetailIQ Systems',
    '+91 99887 76655',
    'QUALIFIED',
    '2026-05-26 11:00:00',
    NOW() - INTERVAL '12 days',
    NOW() - INTERVAL '12 days'
),
(
    4,
    'Sneha Kapoor',
    'EduFlow Tech',
    '+91 90123 45678',
    'PROPOSAL_SENT',
    '2026-05-27 14:00:00',
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '3 days'
),
(
    5,
    'Vikram Joshi',
    'MediaPulse Entertainment',
    '+91 90909 09090',
    'WON',
    NULL,
    NOW() - INTERVAL '30 days',
    NOW() - INTERVAL '30 days'
),
(
    6,
    'Anjali Gupta',
    'Zeta Labs',
    '+91 88877 76666',
    'LOST',
    '2026-05-20 09:30:00',
    NOW() - INTERVAL '15 days',
    NOW() - INTERVAL '15 days'
);

-- Reset identity sequence for postgres if needed (optional but good practice when hardcoding IDs in seed)
SELECT setval('leads_id_seq', (SELECT MAX(id) FROM leads));

-- Discussion seed data
INSERT INTO discussions (
    content,
    lead_id,
    created_at
) VALUES
('Discovered FinEdge via inbound organic search. Standard pricing query.', 1, NOW() - INTERVAL '5 days'),
('Sent corporate brochure and schedule link. Awaiting response.', 1, NOW() - INTERVAL '4 days'),

('Initial cold call completed. Priya was highly interested in active syncing models.', 2, NOW() - INTERVAL '10 days'),
('Scheduled first product demo for this afternoon at 3:30 PM.', 2, NOW() - INTERVAL '1 day'),

('Introductory discovery call. Confirmed budget size is $15k.', 3, NOW() - INTERVAL '12 days'),
('Conducted deep-dive technical architecture review with their tech lead.', 3, NOW() - INTERVAL '8 days'),
('Requirements doc received and approved. Marked as qualified.', 3, NOW() - INTERVAL '5 days'),

('Met Sneha at EdTech conference. Expressed immediate pain points around CRM workflows.', 4, NOW() - INTERVAL '3 days'),
('Drafted custom licensing proposal. Emailed PDF quote with 15% startup discount.', 4, NOW() - INTERVAL '2 days'),

('Introduced through mutual contact. Custom enterprise solution required.', 5, NOW() - INTERVAL '30 days'),
('Negotiated SLA terms. Vikram agreed to final package.', 5, NOW() - INTERVAL '15 days'),
('Contract signed, payment received. Welcome onboarding call completed!', 5, NOW() - INTERVAL '14 days'),

('Cold outreach on LinkedIn. Connected and exchanged emails.', 6, NOW() - INTERVAL '15 days'),
('Scheduled follow-up for May 20th but lead did not join the call. Follow-up is now overdue.', 6, NOW() - INTERVAL '4 days');