-- ====================================================================
-- HAATZA Dashboard Standardization Migration
-- 1. Collision pre-checks for W001-W023
-- 2. 1-to-1 UUID verification matching module & sequence
-- 3. Atomic widget_id updates with ROW_COUNT = 1 validation
-- 4. Expiry standardization (NULL -> 2099-12-31 23:59:59+00)
-- 5. Strict post-migration 23-widget verification
-- 6. Schema defaults and NOT NULL constraints
-- 7. Composite query index (dashboard_module_status_seq_idx)
-- ====================================================================

BEGIN;

DO $$
DECLARE
  v_rows integer;
  v_total integer;
  v_haatza integer;
  v_lite integer;
  v_item jsonb;
  v_target text;
  v_uuid text;
  v_mod text;
  v_seq integer;

  v_mappings CONSTANT jsonb := '[
    {"target": "W001", "uuid": "10000000-0000-4000-8000-000000000001", "mod": "HAATZA", "seq": 1},
    {"target": "W002", "uuid": "10000000-0000-4000-8000-000000000002", "mod": "HAATZA", "seq": 2},
    {"target": "W003", "uuid": "10000000-0000-4000-8000-000000000003", "mod": "HAATZA", "seq": 3},
    {"target": "W004", "uuid": "10000000-0000-4000-8000-000000000004", "mod": "HAATZA", "seq": 4},
    {"target": "W005", "uuid": "10000000-0000-4000-8000-000000000005", "mod": "HAATZA", "seq": 5},
    {"target": "W006", "uuid": "10000000-0000-4000-8000-000000000006", "mod": "HAATZA", "seq": 6},
    {"target": "W007", "uuid": "10000000-0000-4000-8000-000000000007", "mod": "HAATZA", "seq": 7},
    {"target": "W008", "uuid": "10000000-0000-4000-8000-000000000008", "mod": "HAATZA", "seq": 8},
    {"target": "W009", "uuid": "10000000-0000-4000-8000-000000000009", "mod": "HAATZA", "seq": 9},
    {"target": "W010", "uuid": "10000000-0000-4000-8000-000000000010", "mod": "HAATZA", "seq": 10},
    {"target": "W011", "uuid": "10000000-0000-4000-8000-000000000011", "mod": "HAATZA", "seq": 11},
    {"target": "W012", "uuid": "10000000-0000-4000-8000-000000000012", "mod": "HAATZA", "seq": 12},
    {"target": "W013", "uuid": "10000000-0000-4000-8000-000000000013", "mod": "HAATZA", "seq": 13},
    {"target": "W014", "uuid": "10000000-0000-4000-8000-000000000014", "mod": "HAATZA", "seq": 14},
    {"target": "W015", "uuid": "10000000-0000-4000-8000-000000000015", "mod": "HAATZA", "seq": 15},
    {"target": "W016", "uuid": "10000000-0000-4000-8000-000000000016", "mod": "HAATZA", "seq": 16},
    {"target": "W017", "uuid": "20000000-0000-4000-8000-000000000001", "mod": "LITE", "seq": 1},
    {"target": "W018", "uuid": "20000000-0000-4000-8000-000000000002", "mod": "LITE", "seq": 2},
    {"target": "W019", "uuid": "20000000-0000-4000-8000-000000000003", "mod": "LITE", "seq": 3},
    {"target": "W020", "uuid": "20000000-0000-4000-8000-000000000004", "mod": "LITE", "seq": 4},
    {"target": "W021", "uuid": "20000000-0000-4000-8000-000000000005", "mod": "LITE", "seq": 5},
    {"target": "W022", "uuid": "20000000-0000-4000-8000-000000000006", "mod": "LITE", "seq": 6},
    {"target": "W023", "uuid": "20000000-0000-4000-8000-000000000007", "mod": "LITE", "seq": 7}
  ]'::jsonb;
BEGIN
  -- 1. Pre-check: Total rows & Module breakdown in public.dashboard
  SELECT count(*) INTO v_total FROM public.dashboard;
  SELECT count(*) INTO v_haatza FROM public.dashboard WHERE module = 'HAATZA';
  SELECT count(*) INTO v_lite FROM public.dashboard WHERE module = 'LITE';

  IF v_total <> 23 OR v_haatza <> 16 OR v_lite <> 7 THEN
    RAISE EXCEPTION 'Pre-check failed on public.dashboard: Expected 23 rows (16 HAATZA, 7 LITE). Found % (HAATZA: %, LITE: %)',
      v_total, v_haatza, v_lite;
  END IF;

  -- 2. Pre-check: Collision Check - verify none of target IDs W001-W023 already exists
  FOR v_item IN SELECT * FROM jsonb_array_elements(v_mappings)
  LOOP
    v_target := v_item->>'target';
    PERFORM 1 FROM public.dashboard WHERE widget_id = v_target;
    GET DIAGNOSTICS v_rows = ROW_COUNT;
    IF v_rows > 0 THEN
      RAISE EXCEPTION 'Target ID collision detected: % already exists in public.dashboard. Aborting migration.', v_target;
    END IF;
  END LOOP;

  -- 3. Pre-check: Verify every single UUID exists with its exact module and sequence
  FOR v_item IN SELECT * FROM jsonb_array_elements(v_mappings)
  LOOP
    v_target := v_item->>'target';
    v_uuid := v_item->>'uuid';
    v_mod := v_item->>'mod';
    v_seq := (v_item->>'seq')::integer;

    PERFORM 1 FROM public.dashboard
    WHERE widget_id = v_uuid AND module = v_mod AND sequence = v_seq;

    GET DIAGNOSTICS v_rows = ROW_COUNT;
    IF v_rows <> 1 THEN
      RAISE EXCEPTION 'Pre-verification failed for %: UUID % with module % and sequence % was not found exactly once (found %)',
        v_target, v_uuid, v_mod, v_seq, v_rows;
    END IF;
  END LOOP;

  -- 4. Execute updates with strict row-count verification per update
  FOR v_item IN SELECT * FROM jsonb_array_elements(v_mappings)
  LOOP
    v_target := v_item->>'target';
    v_uuid := v_item->>'uuid';
    v_mod := v_item->>'mod';
    v_seq := (v_item->>'seq')::integer;

    UPDATE public.dashboard
    SET widget_id = v_target
    WHERE widget_id = v_uuid AND module = v_mod AND sequence = v_seq;

    GET DIAGNOSTICS v_rows = ROW_COUNT;
    IF v_rows <> 1 THEN
      RAISE EXCEPTION 'UPDATE failed for %: expected 1 row affected, actual %', v_target, v_rows;
    END IF;
  END LOOP;

  -- 5. Standardize effective_to: Replace all 23 NULLs with perpetual timestamp
  UPDATE public.dashboard
  SET effective_to = '2099-12-31 23:59:59+00'::timestamptz
  WHERE effective_to IS NULL;

  GET DIAGNOSTICS v_rows = ROW_COUNT;
  IF v_rows <> 23 THEN
    RAISE EXCEPTION 'effective_to update failed: expected 23 rows affected, actual %', v_rows;
  END IF;

  -- 6. Exact Post-Migration Verification
  FOR v_seq IN 1..16
  LOOP
    v_target := 'W' || LPAD(v_seq::text, 3, '0');
    PERFORM 1 FROM public.dashboard
    WHERE widget_id = v_target AND module = 'HAATZA' AND sequence = v_seq;

    GET DIAGNOSTICS v_rows = ROW_COUNT;
    IF v_rows <> 1 THEN
      RAISE EXCEPTION 'Post-validation failed: HAATZA missing exact widget % with sequence %', v_target, v_seq;
    END IF;
  END LOOP;

  FOR v_seq IN 1..7
  LOOP
    v_target := 'W' || LPAD((v_seq + 16)::text, 3, '0');
    PERFORM 1 FROM public.dashboard
    WHERE widget_id = v_target AND module = 'LITE' AND sequence = v_seq;

    GET DIAGNOSTICS v_rows = ROW_COUNT;
    IF v_rows <> 1 THEN
      RAISE EXCEPTION 'Post-validation failed: LITE missing exact widget % with sequence %', v_target, v_seq;
    END IF;
  END LOOP;

  SELECT count(DISTINCT widget_id) INTO v_total
  FROM public.dashboard
  WHERE widget_id IN (
    'W001','W002','W003','W004','W005','W006','W007','W008',
    'W009','W010','W011','W012','W013','W014','W015','W016',
    'W017','W018','W019','W020','W021','W022','W023'
  );
  IF v_total <> 23 THEN
    RAISE EXCEPTION 'Post-validation failed: expected 23 distinct target IDs, found %', v_total;
  END IF;

  SELECT count(*) INTO v_total
  FROM public.dashboard
  WHERE widget_id NOT IN (
    'W001','W002','W003','W004','W005','W006','W007','W008',
    'W009','W010','W011','W012','W013','W014','W015','W016',
    'W017','W018','W019','W020','W021','W022','W023'
  );
  IF v_total <> 0 THEN
    RAISE EXCEPTION 'Post-validation failed: found % unexpected rows outside W001-W023', v_total;
  END IF;

  SELECT count(*) INTO v_total
  FROM public.dashboard
  WHERE widget_id IS NULL OR widget_name IS NULL OR widget_redirect_to IS NULL
     OR placement IS NULL OR sequence IS NULL OR territory IS NULL
     OR items IS NULL OR product_id IS NULL OR category_id IS NULL
     OR warehouse_id IS NULL OR redirect_category_id IS NULL OR redirect_product_id IS NULL
     OR effective_from IS NULL OR effective_to IS NULL OR status IS NULL
     OR module IS NULL OR created_by IS NULL OR updated_by IS NULL
     OR created_at IS NULL OR updated_at IS NULL;
  IF v_total <> 0 THEN
    RAISE EXCEPTION 'Post-validation failed: found % NULL column values', v_total;
  END IF;

END $$;

-- 7. Apply defaults on public.dashboard (module intentionally receives NO default)
ALTER TABLE public.dashboard
  ALTER COLUMN widget_redirect_to SET DEFAULT '',
  ALTER COLUMN placement SET DEFAULT 'HOME',
  ALTER COLUMN sequence SET DEFAULT 0,
  ALTER COLUMN territory SET DEFAULT 'ALL',
  ALTER COLUMN created_by SET DEFAULT 'SYSTEM',
  ALTER COLUMN updated_by SET DEFAULT 'SYSTEM',
  ALTER COLUMN effective_from SET DEFAULT CURRENT_TIMESTAMP,
  ALTER COLUMN effective_to SET DEFAULT '2099-12-31 23:59:59+00'::timestamptz;

-- 8. Enforce NOT NULL on public.dashboard (module enforced as NOT NULL)
ALTER TABLE public.dashboard
  ALTER COLUMN widget_redirect_to SET NOT NULL,
  ALTER COLUMN placement SET NOT NULL,
  ALTER COLUMN sequence SET NOT NULL,
  ALTER COLUMN territory SET NOT NULL,
  ALTER COLUMN effective_from SET NOT NULL,
  ALTER COLUMN effective_to SET NOT NULL,
  ALTER COLUMN module SET NOT NULL,
  ALTER COLUMN created_by SET NOT NULL,
  ALTER COLUMN updated_by SET NOT NULL;

-- 9. Replace old module_status index with composite query index on public.dashboard
DO $$
DECLARE
  v_exists boolean;
  v_def text;
BEGIN
  -- A. Verify or create the composite query index
  SELECT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public' AND tablename = 'dashboard' AND indexname = 'dashboard_module_status_seq_idx'
  ) INTO v_exists;

  IF v_exists THEN
    SELECT indexdef INTO v_def FROM pg_indexes
    WHERE schemaname = 'public' AND tablename = 'dashboard' AND indexname = 'dashboard_module_status_seq_idx';

    -- Comprehensive index definition validation:
    -- 1. Exact columns & order: (module, status, sequence, created_at)
    -- 2. Non-unique (must not begin with CREATE UNIQUE INDEX)
    -- 3. Ascending sort order (must not specify DESC)
    -- 4. Non-partial (must not contain a WHERE filter clause)
    IF v_def NOT LIKE '%USING btree (module, status, sequence, created_at)'
       OR v_def ILIKE 'CREATE UNIQUE INDEX%'
       OR v_def ILIKE '% DESC%'
       OR v_def ILIKE '% WHERE %' THEN
      RAISE EXCEPTION 'Index conflict: dashboard_module_status_seq_idx already exists with unexpected definition: %. Expected non-unique, non-partial btree index on (module, status, sequence, created_at). Aborting migration.', v_def;
    ELSE
      RAISE NOTICE 'Index dashboard_module_status_seq_idx already exists with verified definition: %', v_def;
    END IF;
  ELSE
    -- Create the exact composite index
    EXECUTE 'CREATE INDEX dashboard_module_status_seq_idx ON public.dashboard (module, status, sequence ASC, created_at ASC)';
  END IF;

  -- B. Ensure the old dashboard_module_status_idx is removed (runs regardless of whether composite index existed or was newly created)
  IF EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public' AND tablename = 'dashboard' AND indexname = 'dashboard_module_status_idx'
  ) THEN
    EXECUTE 'DROP INDEX public.dashboard_module_status_idx';
  END IF;
END $$;

-- 10. Remove redundant unique index on widget_id (primary key dashboard_pkey already guarantees uniqueness)
DROP INDEX IF EXISTS public.dashboard_widget_id_key;

COMMIT;
