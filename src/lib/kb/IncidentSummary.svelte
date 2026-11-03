<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { uniqueById, groupByCause, readAs, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  const unique = uniqueById(reports as Report[]);
  const merged = unique.filter((r) => r.mergedInto === 4471);
  const groups = groupByCause(merged, tenantOf);
  const mismatches = groups.reduce((n, g) => n + g.reports.filter((r) => r.meta.intakeTag !== g.cause).length, 0);
  const ambiguous = groups.reduce((n, g) => n + readAs(g, notes.oneDayMove), 0);
</script>

<ul>
  <li>{reports.length} exported rows; {unique.length} unique report IDs; {reports.length - unique.length} overlapping rows removed.</li>
  <li>{merged.length} unique reports merged into #4471; {groups.length} causes.</li>
  <li>{mismatches} intake tags disagree with tenant-and-channel classification.</li>
  <li>{ambiguous} one-day-move reports remain included in their assigned cause; their symptoms need follow-up.</li>
</ul>
