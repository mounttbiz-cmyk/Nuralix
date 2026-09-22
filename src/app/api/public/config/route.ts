import { NextResponse } from "next/server";
import {
  getPlatformConfig,
  setPlatformConfig,
  DEFAULT_WEBSITE_CONFIG,
  DEFAULT_DASHBOARD_FEATURES,
  DEFAULT_TOOLS_CATALOG,
  DEFAULT_SUBSCRIPTION_PLANS,
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
    let plans = getPlatformConfig("subscription_plans", DEFAULT_SUBSCRIPTION_PLANS);

    // If database had empty sets, seed with defaults
    if (!Array.isArray(nav) || nav.length === 0) {
      nav = defaultNavItems;
      setPlatformConfig("dashboard_nav", nav);
    }

    if (!Array.isArray(tools) || tools.length === 0) {
      tools = DEFAULT_TOOLS_CATALOG;
      setPlatformConfig("tools_catalog", tools);
    }

    if (!Array.isArray(widgets) || widgets.length === 0) {
      widgets = defaultWidgets;
      setPlatformConfig("dashboard_widgets", widgets);
    }

    return NextResponse.json({
      success: true,
      website,
      features,
      nav,
      tools,
      widgets,
      plans,
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
        plans: DEFAULT_SUBSCRIPTION_PLANS,
      },
      { status: 500 }
    );
  }
}
