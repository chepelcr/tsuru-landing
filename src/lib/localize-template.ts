/**
 * A template's listing copy in the visitor's language. Templates carry
 * `translations[lang]` (display name, category label, tagline, description,
 * ideal-for, features); a language a template lacks falls back to Spanish,
 * then to the base columns, so a template without translations still renders.
 */
export interface TemplateTranslation {
  display_name?: string;
  category_label?: string;
  tagline?: string;
  description?: string;
  ideal_for?: string[];
  features?: string[];
}

export interface TranslatableTemplate {
  display_name: string;
  description: string;
  category: string;
  translations?: Partial<Record<string, TemplateTranslation>> | null;
}

export interface LocalizedTemplate {
  displayName: string;
  categoryLabel: string;
  tagline: string | null;
  description: string;
  idealFor: string[];
  features: string[];
}

export function localizeTemplate(template: TranslatableTemplate, language: string): LocalizedTemplate {
  const own = template.translations?.[language];
  const spanish = template.translations?.es;
  const pick = <K extends keyof TemplateTranslation>(key: K): TemplateTranslation[K] => own?.[key] ?? spanish?.[key];
  const category = template.category.charAt(0).toUpperCase() + template.category.slice(1);
  return {
    displayName: pick('display_name') || template.display_name,
    categoryLabel: pick('category_label') || category,
    tagline: pick('tagline') || null,
    description: pick('description') || template.description,
    idealFor: pick('ideal_for') ?? [],
    features: pick('features') ?? [],
  };
}
