// Colón formatting.
//
// Intl's "es-CR" locale groups thousands with a NO-BREAK SPACE (₡20 000), which
// reads as a typo to a Costa Rican eye — CR writes ₡20.000 with a period. Rather
// than pick a foreign locale that happens to group correctly (de-DE, es-ES), we
// group explicitly so the intent is obvious and can't drift with ICU data.
//
// Prices are whole colones: the currency has no cents in practice, and every
// published Tsuru amount is a round figure by design.

/** 20000 → "₡20.000". Always whole colones, never decimals. */
export function formatCRC(amount: number): string {
  const whole = Math.abs(Math.round(amount)).toString();
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${amount < 0 ? "-" : ""}₡${grouped}`;
}
