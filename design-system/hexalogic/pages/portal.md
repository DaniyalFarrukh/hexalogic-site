# Portal Theme Overrides

> **Theme Guard**: This file describes how the logged-in portal differs from the public marketing site.

1. **Information Density**: The portal requires a denser layout to display data-rich tables, project timelines, and feeds.
2. **Layout Shell**: 
   - No hero videos or large animated promotional sections.
   - Includes a persistent sidebar (or dense top bar) for client navigation instead of the marketing navbar.
   - Background effects (glows, ambient light) are muted or removed to focus on data readability.
3. **Typography**: Uses the exact same fonts (Geist Sans & Mono), but relies more heavily on smaller sizes (`text-xs`, `text-sm`) for tables and feeds.
4. **Colors & Surfaces**: 
   - Retains the core dark palette (`#0a0a0c` background, `#141417` cards).
   - Accents (`#FF7324`) remain for primary actions, progress bars, and status indicators.
5. **Motion**: Minimized. Subtle hover states and quick transitions, but no long-duration scroll-triggered GSAP animations to ensure immediate responsiveness.
