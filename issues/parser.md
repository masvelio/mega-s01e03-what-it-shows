# Shared parser reads day-first tenant dates as month-first

**Report count: 379 unique reports** merged into support ticket #4471.

## Problem

The shared parser reads every date month first. Day-first tenant input is flipped on app/email and forms without the booking-v3 hint mismatch. This is the majority cause already associated with #4471.

## Evidence and method

- Scope: supplied support-kb export through 2026-10-04; 427 rows, 412 unique IDs, 15 identical overlapping rows.
- Ran unchanged `uniqueById` and `groupByCause` from `src/lib/kb/causes.ts` with tenant configuration from `src/lib/data/tenants/`.
- Classify by tenant locale, form version and channel; intake tags and browser locale are not the source of truth.
- Computed group key: `parser`.

R-41200: harbour.dental, app; 7 April became 4 July.
R-41205: morrow.tax, app; 3 October became 10 March, despite intake tagging it hint.

## Completion evidence

The product fix must have a reproduction and regression check for the stated input contract; filing this ticket does not mean the defect is fixed. Keep this cause separate from the other issue.

See `src/routes/kb/decisions/0002-triage-by-cause/+page.svx` and `build/kb/decisions/0002-triage-by-cause/index.html` for the signed analysis, computed counts and replacement deduplication rule.

Five one-day-move reports remain in this count per the supplied classifier: R-41202, R-41209, R-41236, R-41344, R-41620. Their exact mechanism needs investigation; no separate time-zone bug is established.
