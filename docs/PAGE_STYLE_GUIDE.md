# Loop Page-By-Page Style Guide

## Shared Page Template (mandatory)
Every route follows this exact structural order:
1. Hero panel with title, subtitle, mascot, and page actions
2. Tab row panel
3. Filter row panel (if applicable)
4. Main content panel

This template is implemented through `components/shared/loop-page-frame.tsx`.

## Home
- Goal: fast entry into the 3 core workflows.
- Hero:
  - Welcome headline
  - Backpack goose
  - Actions: safety center, post something
- Tabs:
  - Overview, Recent Activity, Safety + Trust
- Content:
  - 3 quick-action feature cards (ride, study, marketplace)
  - ongoing cards
  - message pulse summary

## Marketplace
- Goal: discovery + trust-aware transaction flow.
- Hero mascot: trophy goose.
- Tabs:
  - Browse, Sell, Requests
- Filters:
  - category and location oriented
- Content:
  - listing cards with status, price, seller credibility, message CTA
- Required metadata:
  - verification badge
  - rating chip
  - posted time + location

## Rides
- Goal: request or offer rides quickly while preserving safety trust.
- Hero mascot: driver goose.
- Tabs:
  - Request a Ride, Offer to Drive, History
- Filters:
  - start, end, date, budget, trust-preference filters
- Content:
  - ride cards with route, departure, seat status, driver trust, request CTA
- Safety:
  - safety entry point must be visible in hero actions.

## Study Groups
- Goal: help students find high-quality study groups quickly.
- Hero mascot: reader goose.
- Tabs:
  - Find a Team, Create a Request, Your History
- Filters:
  - course and timing filters
- Content:
  - study cards with course, focus, location, host trust and seat availability

## Messages
- Goal: central in-app coordination across all verticals.
- Hero mascot: backpack goose.
- Tabs:
  - Inbox, Marketplace, Rides, Study Groups
- Filters:
  - unread, needs reply, date/pinned filters
- Content:
  - conversation cards with unread and context tags
  - clear signal that messaging is student-only and trust-protected

## Profile
- Goal: emphasize reputation as cross-vertical currency.
- Hero mascot: trophy goose.
- Tabs:
  - Overview, Reviews, History, Verification
- Filters:
  - activity source filters
- Content:
  - profile summary with trust metrics
  - recent reviews grid

## Consistency Checklist
- Same hero shell on all pages
- Same tab control style on all pages
- Same filter pill style on all pages
- Same card radius/shadow grammar on all pages
- Same mascot image treatment on all pages
- Same trust language presence on all pages
