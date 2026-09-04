import React from "react";
import { HealthScoreWidget } from "./HealthScoreWidget";
import { BriefingWidget } from "./BriefingWidget";
import { KpiGridWidget } from "./KpiGridWidget";
import { GapsPreviewWidget } from "./GapsPreviewWidget";
import { TasksPreviewWidget } from "./TasksPreviewWidget";
import { SimulatorHighlightWidget } from "./SimulatorHighlightWidget";
import { WidgetDef } from "@/config/schemas/widget";

const COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
  HealthScoreWidget,
  BriefingWidget,
  KpiGridWidget,
  GapsPreviewWidget,
  TasksPreviewWidget,
  SimulatorHighlightWidget,
};

export function RenderWidget({ widget }: { widget: WidgetDef }) {
  const Component = COMPONENT_MAP[widget.component];
  if (!Component) {
    return null;
  }
  return <Component key={widget.id} />;
}
