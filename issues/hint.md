# booking-v3 date hint contradicts day-first tenant input parsing

**Report count: 33 unique reports** merged into support ticket #4471.

## Problem

The booking-v3 date field prints MM/DD/YYYY, but the form reads the input in the day-first tenant locale. Form reports from Alder Physio, Copper Studio and Pale Harbour are this separate cause, not the shared-parser defect.

## Evidence and method

- Scope: supplied support-kb export through 2026-10-04; 427 rows, 412 unique IDs, 15 identical overlapping rows.
- Ran unchanged `uniqueById` and `groupByCause` from `src/lib/kb/causes.ts` with tenant configuration from `src/lib/data/tenants/`.
- Classify by tenant locale, form version and channel; intake tags and browser locale are not the source of truth.
- Computed group key: `hint`.

R-41230: copper.studio, form; intake parser, actual hint.
R-41251: pale.harbour, form; intake parser, actual hint.

## Completion evidence

The product fix must have a reproduction and regression check for the stated input contract; filing this ticket does not mean the defect is fixed. Keep this cause separate from the other issue.

See `src/routes/kb/decisions/0002-triage-by-cause/+page.svx` and `build/kb/decisions/0002-triage-by-cause/index.html` for the signed analysis, computed counts and replacement deduplication rule.
