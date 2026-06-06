// Inventory — interactive SVG dependency graph of every module under src/.
// Reads the inventory slice from the admin store (never re-scans). Columns
// left→right by category (data→logic→UI); color-chip toggles hide categories;
// search highlights matches; clicking a node highlights its uses/usedBy + opens
// a detail panel; pan via pointer drag, non-passive wheel zoom; fullscreen.
// Read-only tooling page (no Save, no dirty) — only action is Download.

import { useEffect, useMemo, useRef, useState } from "react";
import { Download, Maximize2, Minimize2, RotateCcw, Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAdminStore, downloadJson } from "@/lib/admin-store";
import { PageHeader } from "@/components/admin/PageHeader";

type NodeType =
  | "content"
  | "repository"
  | "service"
  | "lib"
  | "hook"
  | "component"
  | "admin"
  | "page";

interface GraphNode {
  id: string;
  label: string;
  type: string;
  path: string;
}
interface GraphEdge {
  from: string;
  to: string;
  kind: string;
}

// Category → column index (data → logic → UI), legend color (raw fill: encodes
// the legend, not content), and i18n label key.
const TYPE_META: Record<NodeType, { col: number; color: string; labelKey: string }> = {
  content: { col: 0, color: "#0ea5e9", labelKey: "admin.inventory.type.content" },
  repository: { col: 1, color: "#8b5cf6", labelKey: "admin.inventory.type.repository" },
  service: { col: 1, color: "#a855f7", labelKey: "admin.inventory.type.service" },
  lib: { col: 2, color: "#f59e0b", labelKey: "admin.inventory.type.lib" },
  hook: { col: 2, color: "#eab308", labelKey: "admin.inventory.type.hook" },
  component: { col: 3, color: "#10b981", labelKey: "admin.inventory.type.component" },
  admin: { col: 3, color: "#14b8a6", labelKey: "admin.inventory.type.admin" },
  page: { col: 4, color: "#ef4444", labelKey: "admin.inventory.type.page" },
};
const DEFAULT_META = { col: 2, color: "#94a3b8", labelKey: "admin.inventory.type.lib" };
const metaFor = (type: string) => TYPE_META[type as NodeType] ?? DEFAULT_META;

const COL_WIDTH = 260;
const ROW_HEIGHT = 30;
const NODE_W = 190;
const NODE_H = 22;
const MARGIN_TOP = 24;
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

export default function InventoryPage() {
  const { t } = useLanguage();
  const inventory = useAdminStore((s) => s.inventory);
  const nodes = (inventory.nodes as GraphNode[]) ?? [];
  const edges = (inventory.edges as GraphEdge[]) ?? [];

  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [scale, setScale] = useState(0.8);
  const [tx, setTx] = useState(40);
  const [ty, setTy] = useState(0);
  const [isFull, setIsFull] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);

  // Distinct categories present, in column order, for the chip row.
  const presentTypes = useMemo(() => {
    const set = new Set(nodes.map((n) => n.type));
    return Array.from(set).sort((a, b) => metaFor(a).col - metaFor(b).col || a.localeCompare(b));
  }, [nodes]);

  // Lay out visible nodes into columns, stacked vertically (sorted by label).
  const layout = useMemo(() => {
    const visible = nodes.filter((n) => !hidden.has(n.type));
    const byCol = new Map<number, GraphNode[]>();
    for (const n of visible) {
      const col = metaFor(n.type).col;
      if (!byCol.has(col)) byCol.set(col, []);
      byCol.get(col)!.push(n);
    }
    const pos = new Map<string, { x: number; y: number }>();
    for (const [col, list] of byCol) {
      list.sort((a, b) => a.label.localeCompare(b.label));
      list.forEach((n, i) => {
        pos.set(n.id, { x: col * COL_WIDTH + 20, y: MARGIN_TOP + i * ROW_HEIGHT });
      });
    }
    const maxRows = Math.max(0, ...Array.from(byCol.values()).map((l) => l.length));
    const cols = Math.max(0, ...Array.from(byCol.keys())) + 1;
    return {
      pos,
      width: cols * COL_WIDTH + 40,
      height: MARGIN_TOP + maxRows * ROW_HEIGHT + 40,
    };
  }, [nodes, hidden]);

  // Neighborhood of the selected node.
  const neighbors = useMemo(() => {
    if (!selected) return { uses: [] as string[], usedBy: [] as string[], edgeKeys: new Set<string>() };
    const uses: string[] = [];
    const usedBy: string[] = [];
    const edgeKeys = new Set<string>();
    for (const e of edges) {
      if (e.from === selected) {
        uses.push(e.to);
        edgeKeys.add(e.from + ">" + e.to);
      }
      if (e.to === selected) {
        usedBy.push(e.from);
        edgeKeys.add(e.from + ">" + e.to);
      }
    }
    return { uses, usedBy, edgeKeys };
  }, [selected, edges]);

  const neighborSet = useMemo(
    () => new Set([...(selected ? [selected] : []), ...neighbors.uses, ...neighbors.usedBy]),
    [selected, neighbors],
  );

  const q = query.trim().toLowerCase();
  const matches = (n: GraphNode) =>
    q !== "" && (n.label.toLowerCase().includes(q) || n.id.toLowerCase().includes(q));

  // Non-passive wheel zoom — React's onWheel is passive, so attach manually.
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setScale((s) => clamp(s * (e.deltaY < 0 ? 1.1 : 0.9), 0.25, 3));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Track fullscreen state to swap the icon.
  useEffect(() => {
    const onFs = () => setIsFull(document.fullscreenElement === boxRef.current);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const toggleFull = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else boxRef.current?.requestFullscreen();
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    dragRef.current = { x: e.clientX, y: e.clientY, tx, ty };
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    setTx(d.tx + (e.clientX - d.x));
    setTy(d.ty + (e.clientY - d.y));
  };
  const onPointerUp = (e: React.PointerEvent) => {
    dragRef.current = null;
    (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
  };

  const reset = () => {
    setScale(0.8);
    setTx(40);
    setTy(0);
  };

  const toggleType = (type: string) =>
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });

  const selectedNode = nodes.find((n) => n.id === selected) ?? null;
  const counts = (inventory.counts as Record<string, number>) ?? {};
  const generatedAt = (inventory.generatedAt as string) ?? "";

  // Edges to draw: skip any touching a hidden category.
  const drawableEdges = edges.filter((e) => {
    const a = nodes.find((n) => n.id === e.from);
    const b = nodes.find((n) => n.id === e.to);
    return a && b && !hidden.has(a.type) && !hidden.has(b.type);
  });

  return (
    <div>
      <PageHeader
        title={t("admin.inventory.title")}
        description={t("admin.inventory.subtitle")}
        actions={
          <button
            type="button"
            onClick={() => downloadJson("inventory.json", inventory)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
          >
            <Download className="h-3.5 w-3.5" /> {t("admin.versions.download")}
          </button>
        }
      />

      <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span>
          {nodes.length} {t("admin.inventory.nodes")} · {edges.length} {t("admin.inventory.edges")}
        </span>
        {generatedAt && (
          <span>
            {t("admin.inventory.generatedAt")}: {new Date(generatedAt).toLocaleString()}
          </span>
        )}
      </div>

      {/* Chips + search */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {presentTypes.map((type) => {
          const meta = metaFor(type);
          const off = hidden.has(type);
          return (
            <button
              key={type}
              type="button"
              onClick={() => toggleType(type)}
              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                off
                  ? "border-border bg-muted/40 text-muted-foreground opacity-50"
                  : "border-border bg-card text-foreground"
              }`}
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: meta.color }} />
              {t(meta.labelKey)}
              <span className="text-muted-foreground">{counts[type] ?? 0}</span>
            </button>
          );
        })}
        <div className="relative ml-auto">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("admin.inventory.search")}
            className="h-9 w-56 rounded-lg border border-input bg-background pl-8 pr-3 text-sm text-foreground focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <div className="flex gap-4">
        {/* Graph canvas */}
        <div
          ref={boxRef}
          className={`relative flex-1 overflow-hidden rounded-2xl border border-border bg-card ${
            isFull ? "h-screen w-screen" : "h-[600px]"
          }`}
        >
          <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
            <span className="rounded-lg bg-background/80 px-2 py-1 text-xs text-muted-foreground">
              {Math.round(scale * 100)}%
            </span>
            <button
              type="button"
              onClick={reset}
              title={t("admin.inventory.reset")}
              className="rounded-lg border border-border bg-background/80 p-1.5 text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={toggleFull}
              title={isFull ? t("admin.inventory.exitFullscreen") : t("admin.inventory.fullscreen")}
              className="rounded-lg border border-border bg-background/80 p-1.5 text-muted-foreground hover:text-foreground"
            >
              {isFull ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          </div>

          <svg
            ref={svgRef}
            className="h-full w-full touch-none"
            style={{ cursor: dragRef.current ? "grabbing" : "grab" }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelected(null);
            }}
          >
            <g transform={`translate(${tx},${ty}) scale(${scale})`}>
              {/* Edges */}
              {drawableEdges.map((e, i) => {
                const a = layout.pos.get(e.from);
                const b = layout.pos.get(e.to);
                if (!a || !b) return null;
                const active = neighbors.edgeKeys.has(e.from + ">" + e.to);
                const dimmed = selected && !active;
                return (
                  <line
                    key={i}
                    x1={a.x + NODE_W}
                    y1={a.y + NODE_H / 2}
                    x2={b.x}
                    y2={b.y + NODE_H / 2}
                    stroke={active ? "#2563eb" : "currentColor"}
                    className={active ? "text-primary" : "text-border"}
                    strokeWidth={active ? 1.5 : 0.5}
                    opacity={dimmed ? 0.06 : active ? 0.9 : 0.25}
                  />
                );
              })}

              {/* Nodes */}
              {nodes
                .filter((n) => !hidden.has(n.type))
                .map((n) => {
                  const p = layout.pos.get(n.id);
                  if (!p) return null;
                  const meta = metaFor(n.type);
                  const isMatch = matches(n);
                  const isSel = n.id === selected;
                  const inNeighborhood = neighborSet.has(n.id);
                  const dimmed =
                    (selected && !inNeighborhood) || (q !== "" && !isMatch);
                  return (
                    <g
                      key={n.id}
                      transform={`translate(${p.x},${p.y})`}
                      style={{ cursor: "pointer" }}
                      opacity={dimmed ? 0.2 : 1}
                      onClick={(ev) => {
                        ev.stopPropagation();
                        setSelected((cur) => (cur === n.id ? null : n.id));
                      }}
                    >
                      <rect
                        width={NODE_W}
                        height={NODE_H}
                        rx={5}
                        stroke={meta.color}
                        strokeWidth={isSel ? 2.5 : 1}
                        className={isSel || isMatch ? "" : "fill-card"}
                        style={isSel || isMatch ? { fill: meta.color } : undefined}
                      />
                      <circle cx={10} cy={NODE_H / 2} r={3.5} fill={meta.color} />
                      <text
                        x={20}
                        y={NODE_H / 2 + 3.5}
                        fontSize={10}
                        className={isSel || isMatch ? "fill-white" : "fill-foreground"}
                      >
                        {n.label.length > 26 ? n.label.slice(0, 25) + "…" : n.label}
                      </text>
                    </g>
                  );
                })}
            </g>
          </svg>
        </div>

        {/* Detail panel */}
        <aside className="hidden w-72 shrink-0 rounded-2xl border border-border bg-card p-4 lg:block">
          {!selectedNode ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              {t("admin.inventory.selectHint")}
            </p>
          ) : (
            <div className="space-y-4">
              <div>
                <span
                  className="inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold text-white"
                  style={{ background: metaFor(selectedNode.type).color }}
                >
                  {t(metaFor(selectedNode.type).labelKey)}
                </span>
                <h3 className="mt-2 break-all font-semibold text-foreground">
                  {selectedNode.label}
                </h3>
                <p className="mt-0.5 break-all text-[11px] text-muted-foreground">
                  {selectedNode.path}
                </p>
              </div>

              <NeighborList
                title={`${t("admin.inventory.uses")} (${neighbors.uses.length})`}
                ids={neighbors.uses}
                nodes={nodes}
                emptyLabel={t("admin.inventory.none")}
                onPick={setSelected}
              />
              <NeighborList
                title={`${t("admin.inventory.usedBy")} (${neighbors.usedBy.length})`}
                ids={neighbors.usedBy}
                nodes={nodes}
                emptyLabel={t("admin.inventory.none")}
                onPick={setSelected}
              />
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function NeighborList({
  title,
  ids,
  nodes,
  emptyLabel,
  onPick,
}: {
  title: string;
  ids: string[];
  nodes: GraphNode[];
  emptyLabel: string;
  onPick: (id: string) => void;
}) {
  return (
    <div>
      <h4 className="mb-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {title}
      </h4>
      {ids.length === 0 ? (
        <p className="text-xs text-muted-foreground">{emptyLabel}</p>
      ) : (
        <ul className="space-y-1">
          {ids
            .slice()
            .sort()
            .map((id) => {
              const n = nodes.find((x) => x.id === id);
              const meta = metaFor(n?.type ?? "lib");
              return (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => onPick(id)}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-xs text-foreground hover:bg-muted"
                  >
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ background: meta.color }}
                    />
                    <span className="truncate">{n?.label ?? id}</span>
                  </button>
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
}
