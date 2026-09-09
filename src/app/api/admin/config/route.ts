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
import { defaultMetrics } from "@/config/seeds/defaultMetrics";
import { platformConfigStore } from "@/config/store";

export const dynamic = "force-dynamic";

interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  action: "publish" | "draft" | "rollback" | "override" | "reset";
  entityType: string;
  entityId: string;
  note?: string;
}

export async function GET() {
  try {
    const website = getPlatformConfig("website_config", DEFAULT_WEBSITE_CONFIG);
    const features = getPlatformConfig("dashboard_features", DEFAULT_DASHBOARD_FEATURES);
    const nav = getPlatformConfig("dashboard_nav", defaultNavItems);
    const widgets = getPlatformConfig("dashboard_widgets", defaultWidgets);
    const tools = getPlatformConfig("tools_catalog", DEFAULT_TOOLS_CATALOG);
    const metrics = getPlatformConfig("dashboard_metrics", defaultMetrics);
    const auditLogs = getPlatformConfig<AuditLogItem[]>("audit_logs", [
      {
        id: "log_init",
        timestamp: new Date().toISOString(),
        actor: "Superadmin",
        action: "publish",
        entityType: "system",
        entityId: "init",
        note: "System initialized with enterprise defaults",
      },
    ]);
    const version = getPlatformConfig<number>("config_version", 1);

    return NextResponse.json({
      success: true,
      data: {
        website,
        features,
        nav,
        widgets,
        tools,
        metrics,
        auditLogs,
        version,
      },
    });
  } catch (error: any) {
    console.error("Admin config GET error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { section, payload, note, actor = "Superadmin" } = body;

    const currentVersion = getPlatformConfig<number>("config_version", 1);
    const nextVersion = currentVersion + 1;
    const currentAuditLogs = getPlatformConfig<AuditLogItem[]>("audit_logs", []);

    const newLog: AuditLogItem = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor,
      action: "publish",
      entityType: section || "all",
      entityId: `v${nextVersion}`,
      note: note || `Published updates to ${section || "platform configuration"}`,
    };

    // Update the targeted section
    if (section === "website" && payload) {
      setPlatformConfig("website_config", payload);
    } else if (section === "features" && payload) {
      setPlatformConfig("dashboard_features", payload);
    } else if (section === "nav" && payload) {
      setPlatformConfig("dashboard_nav", payload);
      // Synchronize in-memory store
      if (Array.isArray(payload)) {
        platformConfigStore.setNav(payload);
      }
    } else if (section === "widgets" && payload) {
      setPlatformConfig("dashboard_widgets", payload);
      if (Array.isArray(payload)) {
        platformConfigStore.setWidgets(payload);
      }
    } else if (section === "tools" && payload) {
      setPlatformConfig("tools_catalog", payload);
    } else if (section === "all" && payload) {
      if (payload.website) setPlatformConfig("website_config", payload.website);
      if (payload.features) setPlatformConfig("dashboard_features", payload.features);
      if (payload.nav) setPlatformConfig("dashboard_nav", payload.nav);
      if (payload.widgets) setPlatformConfig("dashboard_widgets", payload.widgets);
      if (payload.tools) setPlatformConfig("tools_catalog", payload.tools);
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid section or missing payload" },
        { status: 400 }
      );
    }

    // Save audit log & updated version
    const updatedAuditLogs = [newLog, ...currentAuditLogs].slice(0, 100);
    setPlatformConfig("audit_logs", updatedAuditLogs);
    setPlatformConfig("config_version", nextVersion);

    return NextResponse.json({
      success: true,
      version: nextVersion,
      auditLogs: updatedAuditLogs,
      message: `Successfully saved ${section} configuration (v${nextVersion})`,
    });
  } catch (error: any) {
    console.error("Admin config POST error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const currentVersion = getPlatformConfig<number>("config_version", 1);
    const nextVersion = currentVersion + 1;
    const currentAuditLogs = getPlatformConfig<AuditLogItem[]>("audit_logs", []);

    setPlatformConfig("website_config", DEFAULT_WEBSITE_CONFIG);
    setPlatformConfig("dashboard_features", DEFAULT_DASHBOARD_FEATURES);
    setPlatformConfig("dashboard_nav", defaultNavItems);
    setPlatformConfig("dashboard_widgets", defaultWidgets);
    setPlatformConfig("tools_catalog", DEFAULT_TOOLS_CATALOG);

    const resetLog: AuditLogItem = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: "Superadmin",
      action: "reset",
      entityType: "system",
      entityId: "factory_reset",
      note: "Reset all platform configurations to factory defaults",
    };

    const updatedAuditLogs = [resetLog, ...currentAuditLogs].slice(0, 100);
    setPlatformConfig("audit_logs", updatedAuditLogs);
    setPlatformConfig("config_version", nextVersion);

    return NextResponse.json({
      success: true,
      version: nextVersion,
      auditLogs: updatedAuditLogs,
      message: "Reset all configurations to default values",
    });
  } catch (error: any) {
    console.error("Admin config DELETE error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
