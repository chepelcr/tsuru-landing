// Admin form primitives — bilingual fields edit es + en side by side (writing
// translations.es / .en directly); the rest are plain inputs. Shared input
// styling kept consistent via the constants below. All chrome strings come from
// the caller (already localized) — these primitives carry no copy of their own
// except generic ES/EN placeholders.

import { useState, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";

export const inputCls =
  "w-full h-10 rounded-xl border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:border-primary transition-colors";
export const labelCls =
  "block mb-1.5 text-xs font-semibold text-muted-foreground tracking-wider uppercase";

type Lang = "es" | "en";

type BiProps = {
  label: string;
  es: string;
  en: string;
  onChange: (lang: Lang, value: string) => void;
  hint?: string;
};

export function BilingualField({ label, es, en, onChange }: BiProps) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="grid grid-cols-2 gap-2">
        <input
          className={inputCls}
          value={es}
          onChange={(e) => onChange("es", e.target.value)}
          placeholder="Español"
        />
        <input
          className={inputCls}
          value={en}
          onChange={(e) => onChange("en", e.target.value)}
          placeholder="English"
        />
      </div>
    </div>
  );
}

export function BilingualTextArea({ label, es, en, onChange, hint }: BiProps & { rows?: number }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="grid grid-cols-2 gap-2">
        <textarea
          className={`${inputCls} h-auto min-h-[5rem] py-2`}
          rows={3}
          value={es}
          onChange={(e) => onChange("es", e.target.value)}
          placeholder="Español"
        />
        <textarea
          className={`${inputCls} h-auto min-h-[5rem] py-2`}
          rows={3}
          value={en}
          onChange={(e) => onChange("en", e.target.value)}
          placeholder="English"
        />
      </div>
      {hint && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

/** A titled card whose body collapses; BilingualSection reuses it. */
export function BilingualSection({
  title,
  action,
  children,
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="space-y-4 rounded-xl border border-border bg-background/40 p-4">
      {(title || action) && (
        <div className="flex items-center justify-between">
          {title && <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <input
        className={inputCls}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  rows = 3,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  hint?: string;
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <textarea
        className={`${inputCls} h-auto py-2`}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 py-1">
      <span className="text-sm text-foreground">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors ${
          checked ? "bg-primary" : "bg-muted"
        }`}
        role="switch"
        aria-checked={checked}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow transition-transform ${
            checked ? "translate-x-[1.375rem]" : "translate-x-0.5"
          }`}
        />
      </button>
    </label>
  );
}

export type SelectOption = string | { value: string; label: string };

export function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly SelectOption[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <select className={inputCls} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => {
          const val = typeof o === "string" ? o : o.value;
          const lbl = typeof o === "string" ? o : o.label;
          return (
            <option key={val} value={val}>
              {lbl}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  // Stored colors are bare "H S% L%" triplets; show a hex swatch derived from a
  // color input that writes back hex (brand-theme.toHslTriplet accepts both).
  const isHex = value.trim().startsWith("#");
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-input bg-background"
          value={isHex ? value : "#666666"}
          onChange={(e) => onChange(e.target.value)}
        />
        <input
          className={inputCls}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#3366cc / 123 46% 34%"
        />
      </div>
    </div>
  );
}

/** A bg-card panel with an uppercase title row and an Eye/EyeOff collapse. */
export function AdminCard({
  title,
  action,
  children,
  defaultOpen = true,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between px-5 py-3.5">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{title}</h2>
        <div className="flex items-center gap-2">
          {action}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="toggle"
          >
            {open ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <div
        className={`grid transition-all duration-300 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="space-y-4 px-5 pb-5">{children}</div>
        </div>
      </div>
    </section>
  );
}
