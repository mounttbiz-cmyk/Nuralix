import { NextResponse } from "next/server";
import { resolveTenantConfig } from "@/config/resolver";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const industry = (searchParams.get("industry") as any) || "saas";
  const businessModel = (searchParams.get("model") as any) || "subscription";

  const config = resolveTenantConfig({
    industry,
    businessModel,
  });

  return NextResponse.json(config);
}
