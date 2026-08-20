# Fly World Gadget — Design Direction

## Three Initial Directions

### Theme Name: Precision Atelier
Very Brief Intro: An editorial-industrial repair centre identity with charcoal surfaces, white space, restrained red signals, and documentary photography. It feels exacting, calm, and technically trustworthy.
Probability: 0.07

### Theme Name: Airfield Utility
Very Brief Intro: A bright aviation-service system using off-white panels, blueprint references, technical labels, and orange-red operational accents. It feels open, practical, and highly legible.
Probability: 0.04

### Theme Name: Night Flight Console
Very Brief Intro: A dark control-room aesthetic with instrument-like overlays, electric highlights, and cinematic aircraft imagery. It feels advanced, focused, and mission-ready.
Probability: 0.02

## Selected Direction: Precision Atelier

### Design Movement
Contemporary editorial industrialism: the visual language of premium engineering studios, specialist workshops, and independent technical publications rather than generic SaaS marketing.

### Core Principles
1. **Evidence over spectacle:** real workshop and drone photography, restrained claims, and visible service detail build trust.
2. **Signal, not decoration:** red is reserved for actions, diagnostics, and operational emphasis; charcoal and warm white carry the brand.
3. **Asymmetric editorial rhythm:** offset columns, wide image crops, side notes, and bento-like modules avoid a repetitive centered-card template.
4. **Calm precision:** typography, spacing, and motion should feel measured, direct, and technically competent.

### Color Philosophy
The base is near-black charcoal (#111214) and warm white (#F3F0EA), creating the atmosphere of a premium repair bench and technical print. A single signal red (#E3433D) marks decisions and conversion points without turning the page into a loud red advertisement. Muted steel (#8B9298) supports metadata and technical labels.

### Layout Paradigm
Use a fixed-feeling editorial rail with content that deliberately shifts: full-bleed hero, horizontal trust band, split diagnostic section, offset service list, photography-led workshop story, timeline, and stacked conversion blocks. On mobile, preserve the sequence and hierarchy rather than shrinking desktop grids.

### Signature Elements
- Thin red diagnostic linework and numbered section markers.
- Frosted charcoal technical labels over photography, using short phrases such as “DIAGNOSTICS” and “FLIGHT TESTING”.
- Image crops with hard corners or one distinctive clipped edge, balanced by generous breathing room.

### Interaction Philosophy
Every interaction should shorten the path from uncertainty to contact. Problem cards reveal a useful diagnostic prompt, CTAs remain explicit, filters help users self-identify a model, and form submission always offers a dependable WhatsApp fallback without pretending a database exists.

### Animation
Use short, low-amplitude reveals: image masks slide into place, labels fade upward, and cards lift by 3–5px on hover. Use a subtle hero image drift only when motion is allowed. Accordions and mobile navigation use opacity plus translate transitions under 260ms. Disable parallax, reveal transforms, and decorative movement under `prefers-reduced-motion`.

### Typography System
Use **Space Grotesk** for display and navigation, with tight tracking and a strong semibold/medium contrast. Use **DM Sans** for body copy and form labels for warmth and high legibility. H1 is oversized and compact; section titles use sentence case with a small red eyebrow; supporting copy is limited to readable 18–20px measure.

### Brand Essence
Fly World Gadget is a professional multi-brand drone repair centre in Noida for owners who need clear diagnosis, careful repair, and an easy route back to the air. Personality: **precise, reassuring, direct**.

### Brand Voice
Headlines are confident and human, never inflated. CTAs are verbs. Microcopy explains the next action plainly and avoids unverified credentials.

Example lines:
- “Professional drone repair. Get back in the air.”
- “Tell us what happened. We’ll start with a free inspection.”

### Wordmark & Logo
Use a compact monogram mark formed from two offset flight-path brackets around a central repair spark, paired with a custom-spaced “FLY WORLD” wordmark and smaller “GADGET” line. The mark is a bold graphic symbol, not a default text treatment.

### Signature Brand Color
Signal Red — **#E3433D** — reserved for the brand’s most actionable and diagnostic moments.

## Implementation Notes
- Real photography only: use legally usable photo URLs sourced from Unsplash/Pexels/Pixabay/Wikimedia where licensing is clear; do not use generated imagery.
- Testimonials are not presented as customer reviews. Use an editable “DEMO TESTIMONIAL — REPLACE WITH REAL CUSTOMER REVIEW” state only if the section is retained.
- The form is client-side validated and uses a transparent WhatsApp fallback; no database connection is claimed.
- Central business configuration lives in `client/src/lib/siteConfig.ts`.
