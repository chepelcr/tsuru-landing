export interface NavigationSection {
  href: string;
  top: number;
  bottom: number;
}

// A section owns the nav state only while it crosses the reading line.
// This clears the highlight at the hero/footer and works in either direction.
export function activeNavigation(sections: NavigationSection[], readingLine: number): string | null {
  return sections.find(section => section.top <= readingLine && section.bottom > readingLine)?.href ?? null;
}
