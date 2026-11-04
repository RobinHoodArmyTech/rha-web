# Signup Maintenance Jobs

These scripts run as standalone Node.js jobs on the EC2 instance. Run commands from the repository root after installing dependencies and configuring the application's `.env`.

## City signup reports

Command:

```bash
npm run reports:signups
```

By default, the job reports signups from the previous Monday through Sunday, using the `Asia/Kolkata` timezone. Each city’s CSV is emailed to the email address configured for that city. The attachment contains only full name, email, mobile number, and city; it excludes age and signup timestamp.

To report a specific inclusive date range, pass both dates in `YYYY-MM-DD` format:

```bash
npm run reports:signups -- --start=2026-10-26 --end=2026-11-01
```

The job records each city and date range in `signup_report_deliveries`. It skips ranges already marked sent and retries failed ranges on a rerun. Apply the report-delivery migration before running this job:

```bash
npm run db:migrate
```

## Signup retention cleanup

Command:

```bash
npm run cleanup:signups
```

This permanently deletes signup records whose creation time is more than 90 days old. It deletes in batches of 500 to limit database load.

## EC2 cron examples

For an EC2 host configured to UTC, the following entries run the report every Monday at 9:00 AM IST and cleanup daily at 4:00 AM IST. Replace paths as needed; ensure the application user can write to the lock files and log files.

```cron
30 3 * * 1 cd /srv/rha-web && /usr/bin/flock -n /srv/rha-web/.signup-reports.lock /usr/bin/npm run reports:signups >> /var/log/rha-signup-reports.log 2>&1
30 22 * * * cd /srv/rha-web && /usr/bin/flock -n /srv/rha-web/.signup-cleanup.lock /usr/bin/npm run cleanup:signups >> /var/log/rha-signup-cleanup.log 2>&1
```

Both jobs load database configuration from the application's environment. The report job also needs SMTP configuration: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, and `SMTP_PASSWORD`. Use the regular SMTP username and password, not their Base64 display values. Set `SMTP_FROM_EMAIL` to the sender address authorized by your provider; it defaults to `info@robinhoodarmy.com`. Ports 465 and 2465 use implicit TLS; other ports require STARTTLS.
