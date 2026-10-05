# Landing verification — 2026-10-05

Tested the actual published content at http://localhost:3001, started through
the repository reboot-server.sh. The public API reads its allowed origins from
SSM; no content proxy or bundled editorial fixture is required.

- TypeScript check, production build and public-import guard passed.
- Browser widths 375, 768, 1024 and 1440 had no horizontal overflow.
- Reviewed Spanish and English, light and dark themes.
- Header icon controls measured 44 × 44 CSS pixels.
- Process arrows, disabled endpoints, rapid clicks and translated steps worked.
- Complete process card fit the short 768 × 620 viewport.
- Mobile menu closed with Escape; direct features-page navigation loaded.
- Reduced-motion and offscreen-loop safeguards are implemented; browser
  reduced-motion emulation was not exercised.

Desktop proof: desktop-light-es.jpg. The warm brown/cream palette comes from the
published light-theme brand configuration. No website deployment was performed.

## Navigation refinement

Flag-only language control uses local Costa Rica/UK vectors and localized
accessible labels. Home sections mark their corresponding navigation links via
a header-aware reading line; direct routes retain page highlighting. Scroll
tracking never modifies the URL. Language, theme, page and mobile-menu transitions
honor reduced motion. Three scroll-state regression tests cover down/up movement,
shared boundaries and clearing outside mapped sections. Type check, build and
public-import guard passed. Browser visual verification of this refinement was
blocked by the browser tool URL policy; the earlier screenshot predates it.

Language switching now runs a full 160ms fade-out, commits the translation while
hidden, and reveals it over 220ms. Content stays mounted; route and scroll are
preserved. The control disables during the transition. Regression tests cover
swap timing, cancellation and immediate reduced-motion updates.
