-- Schedule a job for cleaning up the revoked tokens once daily
CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule(
  'cleanup_revoked_tokens_daily',
  '0 3 * * *',
  $$DELETE FROM public.revoked_access_tokens WHERE expires_at < now();$$
);

-- Check all jobs
SELECT * FROM cron.job;

-- to unschedule a job
SELECT cron.unschedule('cleanup_revoked_tokens_daily');