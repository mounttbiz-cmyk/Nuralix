import {
  LayoutDashboard,
  MessageSquare,
  AlertTriangle,
  Compass,
  CheckSquare,
  TrendingUp,
  BookOpen,
  FileText,
  Zap,
  Settings,
  ShieldAlert,
  HelpCircle,
  Sliders,
  LucideProps,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  LayoutDashboard,
  MessageSquare,
  AlertTriangle,
  Compass,
  CheckSquare,
  TrendingUp,
  BookOpen,
  FileText,
  Zap,
  Settings,
  ShieldAlert,
  HelpCircle,
  Sliders,
};

export function DynamicIcon({ name, ...props }: { name: string } & LucideProps) {
  const IconComponent = ICON_MAP[name] || HelpCircle;
  return <IconComponent {...props} />;
}
