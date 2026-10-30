# PAG workflow review

Standalone React workflow demonstration for Super Admin, managed-service, white-label and SaaS workspaces. The light theme follows existing IRMA Engine PAG patterns. No production application, database, paid provider or SMTP connection is used.

## Review links

- Super Admin: https://ishvara-tech.github.io/master-pag-mockup/#/super/dashboard
- Managed service: https://ishvara-tech.github.io/master-pag-mockup/#/managed/dashboard
- White-label: https://ishvara-tech.github.io/master-pag-mockup/#/white/dashboard
- SaaS: https://ishvara-tech.github.io/master-pag-mockup/#/saas/dashboard

## Ten to fifteen minute walkthrough

1. Choose **Review as**. Super Admin can choose **Working for** an authorised sample workspace. Workspaces retain separate browser history, senders and branding.
2. **Companies & Contacts:** inspect two private and two public fictional profiles, edit a contact, save a segment, add a private company or import CSV. Headers: `companyName,website,industry,classification,country`.
3. Create a proposal. Seven steps cover company, goal/services, research approval, AI plan, commercial review, exact-content approval/PDF and delivery. Optional fields stay collapsed.
4. Approve the sample preparation estimate. PAG Brain shows the simulated research, evidence and writing stages. Content is a deterministic fixture, not an OpenAI call.
5. If simulation is enabled, run the simulated MiroFish comparison, inspect its graphs and separate report and select a completed scenario. Required simulation cannot be bypassed at approval.
6. Review the plan and separate agency/IRMA/media costs. Confirm all review boxes and generate an actual two-page PDF. Regeneration preserves earlier version snapshots. Company, provider branding, fees and plan are populated from that version.
7. Select the exact PDF and sample SMTP pool. Send now, schedule and advance a scheduled send, record a manual share or batch-select approved PDFs. SMTP acceptance and provider-confirmed delivery are different simulated states.
8. **Automated programmes:** inspect the paused sample pilot or create an audience of up to 50,000 synthetic companies. Configure company count, total email allowance, daily volume, preparation capacity, days/timezone/dates, approved services/pricing, resources and operational budget. Approve once.
9. Run a demo day or jump 14 days. Compact cohorts represent the virtual audience. The browser does not scrape thousands of companies or render thousands of PDFs. Bulk totals are simulated; individual sample proposals produce actual files. Inspect capacity, budget, five-touch limit, hard end date, exceptions and one-company overrides. Failed preparation consumes no occurrence. Resource attachment requires explicit sample quote approval.
10. Simulate a human reply. Outreach pauses and an opportunity is created for owner review. Qualify it, select its approved version or upload a reviewed replacement PDF, then simulate DocuSign invitation, signature completion and client/project handoff. No payment is collected.

## Sidebar and routes

| Route | Purpose |
|---|---|
| `/:role/dashboard` | Populated overview and guided review |
| `/:role/companies` | Company/contact profiles, import, segments and catalogue submissions |
| `/:role/proposals` | Proposal registry and PDF version history |
| `/:role/create?case=:id` | Complete brief-to-delivery workflow |
| `/:role/client?case=:id&version=:id` | Client-facing proposal and booking/interest preview |
| `/:role/simulation` | Workbench, linked run history, graphs and separate report |
| `/:role/outreach` | Single/scheduled delivery, selected-PDF batches and replies |
| `/:role/programmes` | Bulk setup, capacity, resources, clock, exceptions and cadence |
| `/:role/responses` | Pipeline, later agreement and client/project handoff |
| `/:role/settings` | Branding, rate cards, email, usage, audit and field coverage |
| `/super/platform` | Workspace enablement and explicitly submitted company-fact review |

Hash routing supports direct links and refresh on GitHub Pages.

## Data and production boundaries

- Companies, example.test contacts, audit measurements, costs and scores are synthetic. Supplied platform icons and the existing IRMA brand asset are included for the requested review.
- Research, MiroFish, provisioning, credits, transport, receiving, booking and DocuSign are simulated. No secrets or live integrations are included.
- Browser storage holds workspace state. Reset to restart. PDF bytes are regenerated from immutable approved snapshots rather than stored as large local-storage blobs. This is not durable production artifact storage.
- Company classification, account context, journey and offer template are separate. White-label client documents use that provider's brand.
- Existing Engine brief keys are retained. **Four months is an additive contract change:** current local validation allows 1, 3, 6, 9 and 12. Offer-template identification, separate IRMA allocation and programme/delivery/registry adapters are proposed extensions. The demo does not prove these APIs are implemented.
- Only explicitly submitted company facts enter Super Admin publication review. Private contacts and proposal history remain scoped. This public mockup provides no real authentication boundary.
- LinkedIn outbound campaigns, automated WhatsApp/SMS, replacement CRM, checkout and AI workforce are excluded. Social analysis is separate from outbound delivery channels.
- Client service fees and later IRMA fulfilment budgets are separate from PAG generation costs. The first PDF is for discussion; formal agreement is a later explicit action.

## Development

```sh
npm ci
npm test
npm run dev -- --port 4177
npm run build
```

Build output is `docs/` with `.nojekyll`, for GitHub Pages. Domain tests cover capacity, duplicate dispatch, actual-send cadence, five-touch caps, hard end dates, replies, manual replacement, exceptions, budget, approval and immutable snapshots.

## Integration map

Engine owns existing authentication, workspaces/RBAC, cases, approved services, dynamic pricing, orchestration/audit and versions. Stock Scanner owns research, OpenAI and production PDF rendering. Existing email campaigns own senders, rotation, queue/transport and receiving correlation. Existing MiroFish gateway supplies real simulations and separate stored reports. Agreement integration supplies later version-bound DocuSign. Existing clients/projects receive the service handoff.

This repository is an executable workflow specification, not production implementation or evidence of completed provider integration.
