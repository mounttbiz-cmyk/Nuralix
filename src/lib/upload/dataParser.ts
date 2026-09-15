/**
 * Intelligent Data Parser for Business Metrics & Financial Uploads
 * Supports CSV (columnar, key-value, multi-month time series) and JSON.
 */

export interface ParsedBusinessMetrics {
  name?: string;
  industry?: string;
  industryLabel?: string;
  founderName?: string;
  monthlyRevenue?: number;
  annualRevenue?: number;
  monthlyBurn?: number;
  cashOnHand?: number;
  teamSize?: number;
  grossMargin?: number;
  growthRate?: number;
  runwayMonths?: number;
  revPerHead?: number;
  trend?: number[];
  detectedColumns: string[];
  rowCount: number;
  rawRowsPreview: Record<string, any>[];
  sourceFileName?: string;
}

export function parseCurrencyOrNumber(val: any): number | null {
  if (val === null || val === undefined) return null;
  if (typeof val === "number") return isNaN(val) ? null : val;

  let str = String(val).trim();
  if (!str) return null;

  // Handle percentages
  const isPercent = str.endsWith("%");
  str = str.replace(/[%₹$€£\s,]/g, "");

  let multiplier = 1;
  const lower = str.toLowerCase();

  if (lower.endsWith("cr")) {
    multiplier = 10000000;
    str = str.slice(0, -2);
  } else if (lower.endsWith("l") || lower.endsWith("lac") || lower.endsWith("lakh")) {
    multiplier = 100000;
    str = str.replace(/(lakh|lac|l)$/i, "");
  } else if (lower.endsWith("k")) {
    multiplier = 1000;
    str = str.slice(0, -1);
  } else if (lower.endsWith("m") || lower.endsWith("mn")) {
    multiplier = 1000000;
    str = str.replace(/(mn|m)$/i, "");
  }

  const num = parseFloat(str);
  if (isNaN(num)) return null;

  const result = num * multiplier;
  return isPercent ? result : result;
}

/**
 * Standard CSV row parser respecting quoted fields and delimiters
 */
export function parseCsv(text: string): { headers: string[]; rows: Record<string, any>[] } {
  const lines = text
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  // Detect delimiter: comma, semicolon, tab
  const firstLine = lines[0];
  const commaCount = (firstLine.match(/,/g) || []).length;
  const semiCount = (firstLine.match(/;/g) || []).length;
  const tabCount = (firstLine.match(/\t/g) || []).length;

  let delimiter = ",";
  if (semiCount > commaCount && semiCount > tabCount) delimiter = ";";
  else if (tabCount > commaCount && tabCount > semiCount) delimiter = "\t";

  function splitLine(line: string): string[] {
    const values: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === delimiter && !inQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    return values;
  }

  const rawHeaders = splitLine(lines[0]);
  const headers = rawHeaders.map(h => h.replace(/^["']|["']$/g, "").trim());

  const rows: Record<string, any>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = splitLine(lines[i]);
    const rowObj: Record<string, any> = {};
    headers.forEach((h, idx) => {
      let val = values[idx] ?? "";
      val = val.replace(/^["']|["']$/g, "").trim();
      rowObj[h] = val;
    });
    rows.push(rowObj);
  }

  return { headers, rows };
}

/**
 * Normalizes fuzzy column names to standard keys
 */
function normalizeKey(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}

const FIELD_ALIASES: Record<string, string[]> = {
  monthlyRevenue: [
    "monthlyrevenue",
    "mrr",
    "monthlyincome",
    "monthlysales",
    "revenue",
    "turnover",
    "sales",
    "collections",
    "netrevenue",
  ],
  annualRevenue: [
    "annualrevenue",
    "arr",
    "yearlyrevenue",
    "yearlysales",
    "annualturnover",
    "totalrevenue",
  ],
  monthlyBurn: [
    "monthlyburn",
    "burn",
    "burnrate",
    "expenses",
    "monthlyexpenses",
    "operatingexpenses",
    "opex",
    "outflows",
    "cost",
  ],
  cashOnHand: [
    "cashonhand",
    "cash",
    "cashreserves",
    "bankbalance",
    "reserves",
    "liquidity",
    "treasury",
    "liquidcapital",
  ],
  teamSize: [
    "teamsize",
    "headcount",
    "employees",
    "staff",
    "team",
    "fte",
    "members",
  ],
  name: [
    "name",
    "companyname",
    "businessname",
    "organization",
    "company",
    "enterprise",
  ],
  founderName: [
    "foundername",
    "founder",
    "ceo",
    "owner",
    "leader",
  ],
  industry: [
    "industry",
    "sector",
    "category",
    "domain",
    "vertical",
    "businesstype",
  ],
  grossMargin: [
    "grossmargin",
    "margin",
    "grossprofitmargin",
    "profitmargin",
    "marginpercent",
  ],
  growthRate: [
    "growthrate",
    "growth",
    "momgrowth",
    "revenuegrowth",
    "yoygrowth",
  ],
};

function matchField(key: string): string | null {
  const norm = normalizeKey(key);
  for (const [standardKey, aliases] of Object.entries(FIELD_ALIASES)) {
    if (aliases.includes(norm)) {
      return standardKey;
    }
  }
  return null;
}

/**
 * Intelligent metric extraction from parsed headers and rows
 */
export function extractMetricsFromRows(
  headers: string[],
  rows: Record<string, any>[]
): ParsedBusinessMetrics {
  const result: ParsedBusinessMetrics = {
    detectedColumns: headers,
    rowCount: rows.length,
    rawRowsPreview: rows.slice(0, 10),
  };

  if (rows.length === 0) return result;

  // Check if this is a 2-column Key-Value format (e.g. "Metric", "Value")
  const isKeyValue =
    headers.length === 2 &&
    (normalizeKey(headers[0]).includes("metric") ||
      normalizeKey(headers[0]).includes("key") ||
      normalizeKey(headers[0]).includes("attribute") ||
      normalizeKey(headers[0]).includes("item"));

  if (isKeyValue) {
    const keyCol = headers[0];
    const valCol = headers[1];

    for (const row of rows) {
      const field = matchField(String(row[keyCol] || ""));
      const rawVal = row[valCol];
      if (!field || rawVal === undefined) continue;

      if (["monthlyRevenue", "annualRevenue", "monthlyBurn", "cashOnHand", "teamSize", "grossMargin", "growthRate"].includes(field)) {
        const num = parseCurrencyOrNumber(rawVal);
        if (num !== null) (result as any)[field] = num;
      } else {
        (result as any)[field] = String(rawVal).trim();
      }
    }
  } else {
    // Columnar or time-series format
    // Map column headers to standard fields
    const colToField: Record<string, string> = {};
    headers.forEach(h => {
      const field = matchField(h);
      if (field) colToField[h] = field;
    });

    // If multi-row, look for chronological ordering or take the latest row
    const latestRow = rows[rows.length - 1];

    // Extract latest snapshot
    for (const [header, field] of Object.entries(colToField)) {
      const rawVal = latestRow[header];
      if (rawVal === undefined || rawVal === "") continue;

      if (["monthlyRevenue", "annualRevenue", "monthlyBurn", "cashOnHand", "teamSize", "grossMargin", "growthRate"].includes(field)) {
        const num = parseCurrencyOrNumber(rawVal);
        if (num !== null) (result as any)[field] = num;
      } else {
        (result as any)[field] = String(rawVal).trim();
      }
    }

    // If multi-row, extract revenue trend for sparklines
    const revenueHeader = Object.keys(colToField).find(h => colToField[h] === "monthlyRevenue");
    if (revenueHeader && rows.length > 1) {
      const trendValues = rows
        .map(r => parseCurrencyOrNumber(r[revenueHeader]))
        .filter((n): n is number => n !== null && !isNaN(n));
      if (trendValues.length > 1) {
        result.trend = trendValues.slice(-12);
      }
    }
  }

  // Derive missing metrics
  if (result.monthlyRevenue && !result.annualRevenue) {
    result.annualRevenue = result.monthlyRevenue * 12;
  } else if (result.annualRevenue && !result.monthlyRevenue) {
    result.monthlyRevenue = Math.round(result.annualRevenue / 12);
  }

  if (result.monthlyBurn && result.cashOnHand && result.monthlyBurn > 0) {
    result.runwayMonths = Number((result.cashOnHand / result.monthlyBurn).toFixed(1));
  }

  if (result.annualRevenue && result.teamSize && result.teamSize > 0) {
    result.revPerHead = Math.round(result.annualRevenue / result.teamSize);
  }

  // Map industry label
  if (result.industry) {
    const ind = result.industry.toLowerCase().trim();
    if (ind.includes("saas") || ind.includes("software") || ind.includes("cloud")) {
      result.industry = "saas";
      result.industryLabel = "B2B SaaS & Cloud Platforms";
    } else if (ind.includes("d2c") || ind.includes("ecommerce") || ind.includes("retail")) {
      result.industry = "d2c";
      result.industryLabel = "D2C & Direct Commerce";
    } else if (ind.includes("agency") || ind.includes("services") || ind.includes("consult")) {
      result.industry = "agency";
      result.industryLabel = "Agency & Professional Services";
    } else if (ind.includes("tech") || ind.includes("it")) {
      result.industry = "saas";
      result.industryLabel = "IT & Technology Services";
    } else {
      result.industryLabel = result.industry.toUpperCase();
    }
  }

  return result;
}

/**
 * Universal entry point: Parses CSV or JSON text content
 */
export function parseUploadedContent(content: string, filename: string): ParsedBusinessMetrics {
  const isJson = filename.toLowerCase().endsWith(".json") || content.trim().startsWith("{") || content.trim().startsWith("[");

  if (isJson) {
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const headers = Object.keys(parsed[0]);
        const metrics = extractMetricsFromRows(headers, parsed);
        metrics.sourceFileName = filename;
        return metrics;
      } else if (typeof parsed === "object" && parsed !== null) {
        // Flat object
        const metrics: ParsedBusinessMetrics = {
          detectedColumns: Object.keys(parsed),
          rowCount: 1,
          rawRowsPreview: [parsed],
          sourceFileName: filename,
        };

        for (const [k, v] of Object.entries(parsed)) {
          const field = matchField(k);
          if (!field) continue;
          if (["monthlyRevenue", "annualRevenue", "monthlyBurn", "cashOnHand", "teamSize", "grossMargin", "growthRate"].includes(field)) {
            const num = parseCurrencyOrNumber(v);
            if (num !== null) (metrics as any)[field] = num;
          } else {
            (metrics as any)[field] = String(v).trim();
          }
        }

        if (metrics.monthlyRevenue && !metrics.annualRevenue) {
          metrics.annualRevenue = metrics.monthlyRevenue * 12;
        } else if (metrics.annualRevenue && !metrics.monthlyRevenue) {
          metrics.monthlyRevenue = Math.round(metrics.annualRevenue / 12);
        }
        if (metrics.monthlyBurn && metrics.cashOnHand && metrics.monthlyBurn > 0) {
          metrics.runwayMonths = Number((metrics.cashOnHand / metrics.monthlyBurn).toFixed(1));
        }
        if (metrics.annualRevenue && metrics.teamSize && metrics.teamSize > 0) {
          metrics.revPerHead = Math.round(metrics.annualRevenue / metrics.teamSize);
        }
        return metrics;
      }
    } catch (e: any) {
      throw new Error(`Invalid JSON format: ${e.message}`);
    }
  }

  // Parse as CSV
  const { headers, rows } = parseCsv(content);
  if (headers.length === 0) {
    throw new Error("Could not detect headers in CSV. Please ensure the file is not empty.");
  }
  const metrics = extractMetricsFromRows(headers, rows);
  metrics.sourceFileName = filename;
  return metrics;
}

/**
 * Sample CSV Templates for Download
 */
export function generateSampleBusinessCsv(): string {
  return [
    "Company Name,Industry,Monthly Revenue (INR),Annual Revenue (INR),Monthly Burn (INR),Cash On Hand (INR),Team Size,Gross Margin %",
    "Novacrest Technologies,saas,1850000,22200000,320000,2800000,22,84%",
  ].join("\r\n");
}

export function generateSampleMonthlyFinancialsCsv(): string {
  return [
    "Month,Monthly Revenue (INR),Monthly Burn (INR),Cash On Hand (INR),Team Size,Gross Margin %",
    "Oct 2025,1200000,280000,3800000,16,79%",
    "Nov 2025,1350000,290000,3600000,18,80%",
    "Dec 2025,1500000,300000,3350000,19,81%",
    "Jan 2026,1620000,310000,3100000,20,83%",
    "Feb 2026,1740000,315000,2950000,21,83%",
    "Mar 2026,1850000,320000,2800000,22,84%",
  ].join("\r\n");
}
