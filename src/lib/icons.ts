// Icon registry over lucide-react.
//
// Icons are editable content: JSON stores an `iconName` string and components
// resolve it through this central map so admins can pick from a known set.
// Every icon registered here is one actually imported by a public page/component.

import {
  // landing / hero / how-it-works / values
  UserPlus,
  Package,
  Share2,
  Scale,
  Leaf,
  MapPin,
  Eye,
  ArrowRight,
  Sprout,
  // about
  CheckCircle2,
  // features
  Palette,
  MessageCircle,
  QrCode,
  ClipboardList,
  Globe,
  Hammer,
  UtensilsCrossed,
  Users,
  // fairs
  Monitor,
  ArrowLeftRight,
  Search,
  Handshake,
  Calendar,
  // community
  ShoppingBag,
  Star,
  Heart,
  // examples
  ExternalLink,
  Store,
  Smartphone,
  Shirt,
  Paintbrush,
  Dumbbell,
  PawPrint,
  Sparkles,
  Loader2,
  AlertCircle,
  // blog
  BookOpen,
  User,
  // contact
  Mail,
  Phone,
  MessageSquare,
  // legal pages
  FileText,
  Shield,
  Settings,
  // cta / layout
  Building2,
  Home,
  LogOut,
  Menu,
  X,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";

export const ICONS = {
  "user-plus": UserPlus,
  package: Package,
  "share-2": Share2,
  scale: Scale,
  leaf: Leaf,
  "map-pin": MapPin,
  eye: Eye,
  "arrow-right": ArrowRight,
  sprout: Sprout,
  "check-circle-2": CheckCircle2,
  palette: Palette,
  "message-circle": MessageCircle,
  "qr-code": QrCode,
  "clipboard-list": ClipboardList,
  globe: Globe,
  hammer: Hammer,
  "utensils-crossed": UtensilsCrossed,
  users: Users,
  monitor: Monitor,
  "arrow-left-right": ArrowLeftRight,
  search: Search,
  handshake: Handshake,
  calendar: Calendar,
  "shopping-bag": ShoppingBag,
  star: Star,
  heart: Heart,
  "external-link": ExternalLink,
  store: Store,
  smartphone: Smartphone,
  shirt: Shirt,
  paintbrush: Paintbrush,
  dumbbell: Dumbbell,
  "paw-print": PawPrint,
  sparkles: Sparkles,
  "loader-2": Loader2,
  "alert-circle": AlertCircle,
  "book-open": BookOpen,
  user: User,
  mail: Mail,
  phone: Phone,
  "message-square": MessageSquare,
  "file-text": FileText,
  shield: Shield,
  settings: Settings,
  "building-2": Building2,
  home: Home,
  "log-out": LogOut,
  menu: Menu,
  x: X,
  "chevron-down": ChevronDown,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

/** Resolve an editable icon name to a component; falls back to a sensible default. */
export function resolveIcon(name: string): LucideIcon {
  return ICONS[name as IconName] ?? ICONS.sparkles;
}

/** All registered icon names — for the admin icon picker. */
export const ICON_NAMES = Object.keys(ICONS) as IconName[];
