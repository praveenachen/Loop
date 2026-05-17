# Loop General Style Guide

## 1. Visual Intent
- Product mood: warm, trustworthy, student-focused, and energetic.
- Primary references: Uber clarity + Duolingo softness.
- Rule: keep hierarchy strong, but make interactions feel approachable.

## 2. Core Principles
- Consistent frame: every page uses the same hero -> tabs -> filters -> content panel structure.
- Soft geometry: rounded cards, rounded pills, rounded buttons.
- Friendly motion: quick, subtle transitions (no flashy movement).
- Trust always visible: verification, ratings, and safety context should never be hidden.
- Mascot presence: geese are accents and helpers, not decoration noise.

## 3. Color System
- Base surfaces:
  - Background: warm off-white (surface)
  - Cards: white
  - Soft areas: cream/neutral (`surface-soft`)
- Feature accents:
  - Marketplace: green (`--marketplace`)
  - Rides: yellow (`--rides`)
  - Study groups: pink (`--study`)
- Trust/safety:
  - Verified/safety states: deep green (`--trust`)
- Text:
  - Primary: dark warm ink (`--ink`)
  - Secondary: muted ink (`--ink-soft`)

## 4. Typography
- Body font: Nunito.
- Display font: Fredoka.
- Type behavior:
  - Display headings: confident and rounded.
  - Body text: high readability at 14px-18px.
  - Labels/chips: semibold to extra-bold for scanability.

## 5. Spacing + Layout
- Primary page rhythm:
  - 20-28px between major sections.
  - 12-16px between related controls.
- Use one max content width and one panel style across routes.
- Avoid one-off spacing hacks unless required by responsive behavior.

## 6. Components
- Buttons:
  - Rounded-full, bold text, clear variant color.
  - Primary actions should be obvious and singular per section.
- Tabs:
  - Rounded pills.
  - Active state always high contrast.
- Filters:
  - Secondary pills with soft surface fill.
- Cards:
  - Rounded 2xl to 3xl.
  - Soft border and shadow depth.
  - Keep one card grammar across all pages.
- Badges/chips:
  - Status, rating, and verification use compact pill patterns.

## 7. Mascot Guidelines
- Use one main mascot per page hero.
- Optional small mascot accents in key contextual zones.
- Mascot should guide action ("find a ride", "join a group"), not crowd content.

## 8. Interaction Guidelines
- Hover: slight lift or background shift.
- Focus: visible outline/ring for keyboard users.
- Selected: high-contrast filled state.
- Empty/loading states (future): include supportive mascot + clear CTA.

## 9. Accessibility + UX
- Contrast: maintain readable text contrast on all tinted cards.
- Hit targets: >= 40px for controls.
- Responsive behavior:
  - Keep the same component grammar on tablet/mobile.
  - Stack rather than redesign.

## 10. Content Tone
- Friendly, direct, and practical.
- Student-specific language ("course", "pickup", "verified UW").
- Avoid overly formal or enterprise-heavy phrasing.
