-- Demo data definition, shared by the userdb, budgetdb and expense shard scripts
-- (db/reset-demo-data.sh prepends this file to each of them).
-- Everything is generated deterministically from the calendar date, so a given day always gets
-- the same expenses: history from January of the previous year up to today, plus recurring
-- bills for the next month as planned expenses.

SET client_min_messages = warning;

-- Deterministic pseudo-random number in [0, 1) derived from a text key.
CREATE FUNCTION pg_temp.rnd(key text) RETURNS numeric
    LANGUAGE sql IMMUTABLE
AS $$ SELECT ('x' || substr(md5(key), 1, 8))::bit(32)::bigint / 4294967296.0 $$;

-- Password for every demo account: demo1234 (BCrypt, as Spring's BCryptPasswordEncoder stores it).
-- The last hex digit of the id decides the expense shard: even -> shard A, odd -> shard B.
CREATE TEMP TABLE demo_users AS
SELECT *
FROM (VALUES
    ('demo',    'd0000000-0000-4000-8000-000000000a02'::uuid, 'A', 'Anna',      'Kowalska',   'anna.kowalska@demo.nkocjan.pl', '500100201'),
    ('student', 'd0000000-0000-4000-8000-000000000b01'::uuid, 'B', 'Jan',       'Nowak',      'jan.nowak@demo.nkocjan.pl',     '500100202'),
    ('rodzina', 'd0000000-0000-4000-8000-000000000c04'::uuid, 'A', 'Katarzyna', 'Wiśniewska', 'rodzina@demo.nkocjan.pl',       '500100203')
) AS v(username, id, shard, name, surname, email, phone_number);

CREATE TEMP TABLE demo_categories AS
SELECT md5('category:' || username || ':' || code)::uuid AS id, *
FROM (VALUES
    -- username, code, name, description, weekly, monthly, yearly budget
    ('demo', 'food',      'Jedzenie',       'Zakupy spożywcze i jedzenie na mieście', 350, 1500, 18000),
    ('demo', 'home',      'Mieszkanie',     'Czynsz, media, internet i telefon',      720, 3000, 36000),
    ('demo', 'transport', 'Transport',      'Paliwo, parkingi, przejazdy i auto',     180,  750,  9500),
    ('demo', 'fun',       'Rozrywka',       'Restauracje, kino, koncerty, subskrypcje', 150, 600, 7000),
    ('demo', 'health',    'Zdrowie',        'Siłownia, apteka i lekarze',              80,  320,  3800),
    ('demo', 'shopping',  'Zakupy',         'Ubrania, kosmetyki, elektronika',        130,  550,  7000),
    ('demo', 'travel',    'Podróże',        'Wakacje i wyjazdy weekendowe',           150,  600,  7000),

    ('student', 'food',      'Jedzenie',            'Zakupy, stołówka i jedzenie na mieście', 245, 1050, 12600),
    ('student', 'dorm',      'Akademik i rachunki', 'Akademik i telefon',                     200, 800, 9600),
    ('student', 'transport', 'Transport',           'Bilet MPK, Bolt, pociągi do domu',        30, 130, 1500),
    ('student', 'fun',       'Rozrywka',            'Wyjścia ze znajomymi, gry, koncerty',     60, 260, 3100),
    ('student', 'study',     'Nauka',               'Kurs angielskiego, książki, ksero',       40, 170, 2000),

    ('rodzina', 'food',      'Jedzenie',   'Zakupy dla czteroosobowej rodziny',       860, 3700, 44000),
    ('rodzina', 'home',      'Dom',        'Kredyt hipoteczny, media, internet',     1170, 5000, 60000),
    ('rodzina', 'kids',      'Dzieci',     'Przedszkole, zajęcia dodatkowe, ubrania', 330, 1400, 16500),
    ('rodzina', 'transport', 'Transport',  'Rata za auto, paliwo, ubezpieczenie',     560, 2400, 30000),
    ('rodzina', 'health',    'Zdrowie',    'Pakiet medyczny, apteka, lekarze',        140,  600,  7200),
    ('rodzina', 'fun',       'Rozrywka',   'Wyjścia rodzinne, streaming, wakacje',    250, 1000, 12000)
) AS v(username, code, name, description, weekly, monthly, yearly);

-- Expense templates.
--   monthly: on day `param` of the month (or of the `months` listed) - future ones become planned
--   weekly:  on ISO weekday `param` with probability `prob`
--   daily:   any day with probability `prob`;  workday: Monday-Friday only
CREATE TEMP TABLE demo_templates AS
SELECT *
FROM (VALUES
    ('demo', 'food', 'Zakupy spożywcze - Biedronka', 'daily',   0, 0.12,  45, 170, NULL::int[]),
    ('demo', 'food', 'Zakupy spożywcze - Lidl',      'daily',   0, 0.06,  60, 200, NULL),
    ('demo', 'food', 'Żabka',                         'daily',   0, 0.12,  12,  45, NULL),
    ('demo', 'food', 'Targ - warzywa i owoce',        'weekly',  6, 0.60,  35,  90, NULL),
    ('demo', 'food', 'Lunch w pracy',                 'workday', 0, 0.60,  25,  38, NULL),
    ('demo', 'food', 'Zamówienie - Pyszne.pl',        'daily',   0, 0.03,  55, 110, NULL),
    ('demo', 'home', 'Czynsz',                        'monthly', 10, 1, 2350, 2350, NULL),
    ('demo', 'home', 'Prąd - Tauron',                 'monthly', 15, 1,  140,  210, NULL),
    ('demo', 'home', 'Gaz - PGNiG',                   'monthly', 22, 1,   60,  170, NULL),
    ('demo', 'home', 'Internet - UPC',                'monthly', 20, 1, 69.99, 69.99, NULL),
    ('demo', 'home', 'Abonament telefoniczny',        'monthly', 5,  1,   55,   55, NULL),
    ('demo', 'home', 'Środki czystości',              'daily',   0, 0.04,  25,  80, NULL),
    ('demo', 'transport', 'Paliwo - Orlen',           'daily',   0, 0.09, 180, 290, NULL),
    ('demo', 'transport', 'Parking',                  'workday', 0, 0.10,   6,  24, NULL),
    ('demo', 'transport', 'Uber',                     'daily',   0, 0.04,  18,  55, NULL),
    ('demo', 'transport', 'Wymiana opon',             'monthly', 12, 1, 120, 120, ARRAY[4, 10]),
    ('demo', 'transport', 'Przegląd i serwis auta',   'monthly', 18, 1, 650, 650, ARRAY[3]),
    ('demo', 'transport', 'Ubezpieczenie OC/AC',      'monthly', 3,  1, 1450, 1450, ARRAY[9]),
    ('demo', 'fun', 'Netflix',                        'monthly', 3, 1, 49, 49, NULL),
    ('demo', 'fun', 'Spotify Premium',                'monthly', 8, 1, 23.99, 23.99, NULL),
    ('demo', 'fun', 'Kolacja w restauracji',          'weekly',  5, 0.40, 110, 260, NULL),
    ('demo', 'fun', 'Kino',                           'daily',   0, 0.04,  30,  70, NULL),
    ('demo', 'fun', 'Kawa na mieście',                'workday', 0, 0.15,  14,  28, NULL),
    ('demo', 'fun', 'Bilety na koncert',              'monthly', 21, 1, 180, 320, ARRAY[6, 11]),
    ('demo', 'health', 'Karnet na siłownię',          'monthly', 2, 1, 149, 149, NULL),
    ('demo', 'health', 'Apteka',                      'daily',   0, 0.05,  18,  95, NULL),
    ('demo', 'health', 'Wizyta u dentysty',           'monthly', 14, 1, 250, 400, ARRAY[2, 8]),
    ('demo', 'shopping', 'Ubrania - Zalando',         'daily',   0, 0.03, 120, 420, NULL),
    ('demo', 'shopping', 'Rossmann',                  'daily',   0, 0.06,  30, 110, NULL),
    ('demo', 'shopping', 'Allegro',                   'daily',   0, 0.03,  40, 260, NULL),
    ('demo', 'shopping', 'Prezenty świąteczne',       'daily',   0, 0.25,  80, 350, ARRAY[12]),
    ('demo', 'shopping', 'Słuchawki bezprzewodowe',  'monthly', 27, 1, 899, 899, ARRAY[11]),
    ('demo', 'travel', 'Wakacje - Chorwacja (nocleg)', 'monthly', 6, 1, 3200, 3200, ARRAY[7]),
    ('demo', 'travel', 'Bilety lotnicze',             'monthly', 4, 1, 1100, 1100, ARRAY[6]),
    ('demo', 'travel', 'Narty - Zakopane',            'monthly', 7, 1, 1400, 1400, ARRAY[2]),
    ('demo', 'travel', 'Weekend za miastem',          'weekly',  6, 0.03, 300, 700, NULL),

    ('student', 'food', 'Biedronka',                  'daily',   0, 0.30,  20,  75, NULL),
    ('student', 'food', 'Żabka',                      'daily',   0, 0.25,   8,  30, NULL),
    ('student', 'food', 'Stołówka',                   'workday', 0, 0.70,  14,  22, NULL),
    ('student', 'food', 'Pizza ze znajomymi',         'weekly',  5, 0.40,  30,  55, NULL),
    ('student', 'food', 'Obiad na mieście',           'daily',   0, 0.08,  18,  32, NULL),
    ('student', 'dorm', 'Akademik - opłata',          'monthly', 10, 1, 760, 760, NULL),
    ('student', 'dorm', 'Telefon na kartę',           'monthly', 5, 1, 30, 30, NULL),
    ('student', 'transport', 'Bilet miesięczny MPK (ulgowy)', 'monthly', 1, 1, 54.5, 54.5, NULL),
    ('student', 'transport', 'Bolt',                  'daily',   0, 0.05,  12,  35, NULL),
    ('student', 'transport', 'Hulajnoga',             'daily',   0, 0.06,   5,  14, NULL),
    ('student', 'transport', 'PKP Intercity - do domu', 'monthly', 20, 1, 69, 69, ARRAY[4, 6, 12]),
    ('student', 'fun', 'Spotify Student',             'monthly', 14, 1, 11.99, 11.99, NULL),
    ('student', 'fun', 'Wyjście ze znajomymi',        'daily',   0, 0.10,  18,  60, NULL),
    ('student', 'fun', 'Kino',                        'daily',   0, 0.03,  22,  35, NULL),
    ('student', 'fun', 'Bilet na koncert',            'monthly', 18, 1, 90, 90, ARRAY[3, 10]),
    ('student', 'study', 'Kurs angielskiego',         'monthly', 25, 1, 99, 99, NULL),
    ('student', 'study', 'Ksero i druk',              'workday', 0, 0.06,   5,  25, NULL),
    ('student', 'study', 'Podręczniki',               'monthly', 5, 1, 120, 260, ARRAY[2, 10]),
    ('student', 'study', 'Kurs online - Udemy',       'monthly', 15, 1, 59.99, 59.99, ARRAY[11]),

    ('rodzina', 'food', 'Zakupy na tydzień - Kaufland', 'weekly', 6, 1, 300, 480, NULL),
    ('rodzina', 'food', 'Zakupy - Auchan',            'daily',   0, 0.06, 180, 420, NULL),
    ('rodzina', 'food', 'Biedronka',                  'daily',   0, 0.35,  30, 110, NULL),
    ('rodzina', 'food', 'Piekarnia',                  'daily',   0, 0.60,   8,  22, NULL),
    ('rodzina', 'food', 'Obiad na mieście',           'daily',   0, 0.04, 120, 260, NULL),
    ('rodzina', 'home', 'Rata kredytu hipotecznego',  'monthly', 10, 1, 3450, 3450, NULL),
    ('rodzina', 'home', 'Prąd',                       'monthly', 15, 1, 280, 380, NULL),
    ('rodzina', 'home', 'Gaz',                        'monthly', 18, 1, 120, 380, NULL),
    ('rodzina', 'home', 'Woda i ścieki',              'monthly', 20, 1, 160, 220, NULL),
    ('rodzina', 'home', 'Internet + TV',              'monthly', 21, 1, 119, 119, NULL),
    ('rodzina', 'home', 'Wywóz śmieci',               'monthly', 25, 1, 128, 128, NULL),
    ('rodzina', 'home', 'Leroy Merlin',               'daily',   0, 0.03,  80, 600, NULL),
    ('rodzina', 'kids', 'Przedszkole',                'monthly', 5, 1, 650, 650, NULL),
    ('rodzina', 'kids', 'Basen - zajęcia',            'monthly', 7, 1, 180, 180, NULL),
    ('rodzina', 'kids', 'Angielski dla dzieci',       'monthly', 12, 1, 220, 220, NULL),
    ('rodzina', 'kids', 'Ubrania dla dzieci',         'daily',   0, 0.05,  60, 250, NULL),
    ('rodzina', 'kids', 'Zabawki',                    'daily',   0, 0.04,  30, 180, NULL),
    ('rodzina', 'kids', 'Wyprawka szkolna',           'monthly', 1, 1, 650, 650, ARRAY[9]),
    ('rodzina', 'transport', 'Rata za samochód',      'monthly', 3, 1, 900, 900, NULL),
    ('rodzina', 'transport', 'Paliwo',                'daily',   0, 0.18, 200, 320, NULL),
    ('rodzina', 'transport', 'Ubezpieczenie OC/AC',   'monthly', 10, 1, 2100, 2100, ARRAY[6]),
    ('rodzina', 'transport', 'Wymiana opon',          'monthly', 15, 1, 160, 160, ARRAY[4, 10]),
    ('rodzina', 'health', 'Pakiet medyczny',          'monthly', 1, 1, 199, 199, NULL),
    ('rodzina', 'health', 'Apteka',                   'daily',   0, 0.10,  20, 140, NULL),
    ('rodzina', 'health', 'Pediatra prywatnie',       'daily',   0, 0.02, 200, 250, NULL),
    ('rodzina', 'fun', 'Netflix',                     'monthly', 3, 1, 67, 67, NULL),
    ('rodzina', 'fun', 'Disney+',                     'monthly', 9, 1, 37.99, 37.99, NULL),
    ('rodzina', 'fun', 'Wyjście rodzinne (kino, zoo)', 'weekly', 7, 0.30, 90, 240, NULL),
    ('rodzina', 'fun', 'Wakacje nad morzem',          'monthly', 2, 1, 5200, 5200, ARRAY[8]),
    ('rodzina', 'fun', 'Prezenty świąteczne',         'daily',   0, 0.20, 100, 500, ARRAY[12])
) AS v(username, category_code, name, kind, param, prob, amount_min, amount_max, months);

-- History starts in January of the previous year, so both yearly budgets have full data.
CREATE TEMP TABLE demo_period AS
SELECT (date_trunc('year', current_date) - interval '1 year')::date AS history_start;
