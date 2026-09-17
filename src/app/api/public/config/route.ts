import { NextResponse } from "next/server";
import {
  getPlatformConfig,
  setPlatformConfig,
  DEFAULT_WEBSITE_CONFIG,
  DEFAULT_DASHBOARD_FEATURES,
  DEFAULT_TOOLS_CATALOG,
} from "@/lib/db";
import { defaultNavItems } from "@/config/seeds/defaultNav";
import { defaultWidgets } from "@/config/seeds/defaultWidgets";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const website = getPlatformConfig("website_config", DEFAULT_WEBSITE_CONFIG);
    const features = getPlatformConfig("dashboard_features", DEFAULT_DASHBOARD_FEATURES);
    let nav = getPlatformConfig("dashboard_nav", defaultNavItems);
    let tools = getPlatformConfig("tools_catalog", DEFAULT_TOOLS_CATALOG);
    let widgets = getPlatformConfig("dashboard_widgets", defaultWidgets);

    // Ensure any newly added default nav items (e.g. Growth Strategy, Executive Playbooks) are merged if missing from DB
    const existingNavHrefs = new Set(nav.map((n: any) => n.href));
    let hasNewNav = false;
    for (const dn of defaultNavItems) {
      if (!existingNavHrefs.has(dn.href)) {
        nav.push(dn);
        hasNewNav = true;
      }
    }
    if (hasNewNav) {
      nav.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
      setPlatformConfig("dashboard_nav", nav);
    }

    // Ensure any newly added default tools are merged if missing from DB
    const existingToolIds = new Set(tools.map((t: any) => t.id));
    let hasNewTools = false;
    for (const dt of DEFAULT_TOOLS_CATALOG) {
      if (!existingToolIds.has(dt.id)) {
        tools.push(dt);
        hasNewTools = true;
      }
    }
    if (hasNewTools) {
      setPlatformConfig("tools_catalog", tools);
    }
    
    // Ensure any newly added default widgets (like DataUploadWidget) are merged if missing from DB
    const existingIds = new Set(widgets.map((w: any) => w.id));
    let hasNewWidgets = false;
    for (const dw of defaultWidgets) {
      if (!existingIds.has(dw.id)) {
        widgets.push(dw);
        hasNewWidgets = true;
      }
    }
    // Re-sort if we added new ones
    if (hasNewWidgets) {
      widgets.sort((a: any, b: any) => (b.priority || 0) - (a.priority || 0));
    }

    return NextResponse.json({
      success: true,
      website,
      features,
      nav,
      tools,
      widgets,
    });
  } catch (error: any) {
    console.error("Failed to fetch public config:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        website: DEFAULT_WEBSITE_CONFIG,
        features: DEFAULT_DASHBOARD_FEATURES,
        nav: defaultNavItems,
        tools: DEFAULT_TOOLS_CATALOG,
        widgets: defaultWidgets,
      },
      { status: 500 }
    );
  }
}
