# HexaLogic Design System (MASTER)

> **Theme Guard**: This is the single source of truth for UI in the HexaLogic project. Do NOT generate new design tokens, colors, or fonts. Use existing variables and patterns found here.

## 1. App Router Inventory
- **Static Routes**: `/`, `/about`, `/services`, `/contact`, `/privacy`, `/terms`, `/case-studies` (Assuming static based on folder structure)
- **Dynamic Routes**: [INFERRED] None explicitly identified in the base setup, but future portal routes like `/portal/[clientId]/project/[projectId]` will be dynamic.
- **Layout Shell**: `app/layout.tsx` wraps all pages with `<SmoothScrollProvider>`, `<Navbar>`, `<main className="flex-1">`, and `<Footer>`.

## 2. Color Tokens (Tailwind & CSS Variables)
*The marketing site is predominantly a dark mode experience despite some default CSS variables.*

### Core Backgrounds & Surfaces
- **App Background**: `#0a0a0c` (Dark almost black)
- **Dashboard/Container Background**: `#0e0e11` (Slightly lighter dark)
- **Card/Panel Background**: `#141417` (Used in analytic cards, solution panels)
- **Glass Panel**: `rgba(255, 255, 255, 0.85)` / `rgba(255, 255, 255, 0.92)` with `backdrop-blur(24px)` (Navbar & Glass overlays)

### Accents & Branding
- **Primary Orange Accent**: `#FF7324` (Buttons, highlights, metrics sparklines)
- **Orange Hover**: `#ff8947`
- **Teal / Blue (Legacy/Gradient elements)**: `--color-teal: #1BB8A3`, `--color-blue: #3B82F6` (Used in `text-gradient-teal`, `section-divider`)

### Text & Typography Colors
- **Primary Text**: `#f4f4f5` (Zinc 100) or `text-white`
- **Muted/Secondary Text**: `text-gray-400`, `text-gray-500` (e.g. `#a1a1aa`, `#71717a`)

### Base CSS Variables (`globals.css`)
- `--white`: `#FFFFFF`
- `--off-white`: `#F8F9FB`
- `--navy`: `#0F2C4C`
- `--slate`: `#5B6B7C`

## 3. Typography
- **Families**: 
  - Sans: `var(--font-geist-sans)`, system-ui, -apple-system, sans-serif
  - Mono: `var(--font-geist-mono)`
- **Weights Loaded**: `font-medium`, `font-semibold`, `font-bold`
- **Sizes**: 
  - Hero Titles: `text-4xl`, `sm:text-5xl`, `md:text-[72px] leading-[1.1] tracking-tight`
  - Section Headers: `text-2xl`, `text-3xl`
  - Body: `text-sm`, `text-base`, `text-lg`
  - Micro-copy/Labels: `text-[10px]`, `text-xs uppercase tracking-widest`

## 4. Spacing, Radii, and Shadows
- **Container**: `container mx-auto px-6 max-w-7xl`
- **Section Rhythm**: `pt-24`, `pt-32`, `pt-40` for large sections, `gap-8` for grid gaps.
- **Border Radii**:
  - Buttons/Small elements: `rounded-lg`, `rounded-xl`
  - Cards: `rounded-2xl`
  - Large Containers/Dashboards: `rounded-t-3xl`, `rounded-t-[40px]`
- **Shadows**:
  - Hover Cards: `0 20px 60px rgba(15, 44, 76, 0.08), 0 8px 24px rgba(15, 44, 76, 0.04)`
  - Dashboard Container: `0 -20px 80px rgba(0,0,0,0.8)`
  - Glow Effects: `.glow-blue`, `.glow-teal`

## 5. Component Patterns
- **Buttons (Primary Action)**: `bg-[#FF7324] text-white text-xs font-bold hover:bg-[#ff8947] rounded-full px-4 py-2.5 transition-all shadow-[0_0_15px_rgba(255,115,36,0.2)]`
- **Buttons (Secondary/Outline)**: `px-6 py-2.5 rounded-lg border border-white/10 text-white text-xs font-bold hover:bg-white/5 transition-colors`
- **Cards**: `bg-[#141417] border border-white/5 rounded-2xl p-6 hover:border-[#FF7324]/30 hover:bg-[#18181c] transition-all`
- **Section Headers**: `text-2xl font-bold text-white flex items-center gap-2`
- **Badges/Tags**: `text-[10px] font-bold text-gray-500 uppercase tracking-widest`
- **Reusable Components**: 
  - `Navbar.tsx`: Glassmorphism top navigation.
  - `Footer.tsx`: Standard site footer.
  - `SmoothScrollProvider.tsx`: Lenis smooth scrolling wrapper.

## 6. Motion and Animation
- **Libraries**: `framer-motion` (UI layout transitions), `gsap` (ScrollTrigger complex animations, counting numbers, height animations), `lenis` (Smooth scrolling).
- **Triggers**: 
  - `ScrollTrigger` is heavily used for enter animations (e.g. scale up dashboard, slide down text).
  - Hover states typically use CSS `transition-all duration-300` or similar.
- **Easing**: `cubic-bezier(0.22, 1, 0.36, 1)`, `power3.out`, `power2.out`.

## 7. DO NOT DO LIST
- **DO NOT** use generic Tailwind colors like `bg-blue-500` without consulting tokens (prefer the custom `#FF7324` orange or specific `#141417` grays).
- **DO NOT** introduce new fonts (stick to Geist Sans & Mono).
- **DO NOT** build bright white cards for the portal; the current app layout uses a dark theme `#0a0a0c`.
- **DO NOT** modify existing marketing components. New functionality should live in its own files using the exact same classes/styles.
