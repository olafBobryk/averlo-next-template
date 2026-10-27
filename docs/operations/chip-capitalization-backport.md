# Chip capitalization backport — 2026-10-12

Source: Winery Agent `app`; target: canonical `averlo-next-template` checkout.

- Port: the shared Chip root uses Tailwind `capitalize`, inherited by static,
  linked, and button labels. Original label values remain unchanged.
- Document: the Chip catalog guarantee and nearest folder ownership rule.
- Demo: existing `TonesAndSkeleton` story deliberately passes lowercase tones
  and now demonstrates the shared capitalization without caller styling.
- Skip: Bob Automated checks actions and findings pages are domain-owned.
- No public API or pruning ownership changes. Existing unrelated edits retained.

Verification: template production build passed. Source browser checks confirmed
computed `text-transform: capitalize` in Activity and Archive. Live and skeleton
Chip labels share the rule; both implementations match exactly. Bob page-policy
checks initially passed for 17 surfaces; a later rerun hit a concurrently changed
prepare-fcc redirect-policy failure. Its full build encountered an unrelated
Chats type error.
No commit or deployment is part of this backport.
