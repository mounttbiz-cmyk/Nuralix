import { NextResponse } from "next/server";
import {
  getPlatformConfig,
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
    const nav = getPlatformConfig("dashboard_nav", defaultNavItems);
    const tools = getPlatformConfig("tools_catalog", DEFAULT_TOOLS_CATALOG);
    const widgets = getPlatformConfig("dashboard_widgets", defaultWidgets);

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
