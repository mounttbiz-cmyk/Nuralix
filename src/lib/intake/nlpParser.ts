/**
 * Natural Language Parser for Day-to-Day Business Inputs
 * Extracts orders, revenue, expenses/burn, cash on hand, team size, and descriptions
 * from statements like:
 * "Today we received 42 orders and revenue was ₹85,000"
 * "Burn was ₹45,000 and revenue ₹1,10,000 from 30 orders"
 * "Closed a deal for 500000 with 5 new enterprise customers"
 */

export interface ExtractedBusinessRecord {
  rawText: string;
  detectedAt: string;
  dailyRevenue?: number;
  dailyOrders?: number;
  dailyExpenses?: number;
  monthlyRevenueEquivalent?: number;
  monthlyBurnEquivalent?: number;
  cashOnHand?: number;
  teamSize?: number;
  notes?: string;
  summary: string;
  confidence: number;
  matchedFields: string[];
}

export function parseNaturalBusinessInput(text: string): ExtractedBusinessRecord | null {
  if (!text || text.trim().length < 5) return null;

  const clean = text.trim();
  const matchedFields: string[] = [];
  let dailyRevenue: number | undefined;
  let dailyOrders: number | undefined;
  let dailyExpenses: number | undefined;
  let cashOnHand: number | undefined;
  let teamSize: number | undefined;

  // Helper to extract Indian/standard numbers e.g. "85,000", "85000", "1,20,000", "150k", "1.5L"
  const parseNum = (str: string): number => {
    let s = str.replace(/[,\s₹INR$]/gi, "");
    if (s.toLowerCase().endsWith("k")) {
      return parseFloat(s) * 1000;
    }
    if (s.toLowerCase().endsWith("l") || s.toLowerCase().endsWith("lakh") || s.toLowerCase().endsWith("lac")) {
      return parseFloat(s) * 100000;
    }
    if (s.toLowerCase().endsWith("cr") || s.toLowerCase().endsWith("crore")) {
      return parseFloat(s) * 10000000;
    }
    return parseFloat(s);
  };

  // 1. Match Orders (e.g. "42 orders", "orders: 42", "received 50 orders", "15 sales")
  const orderRegex = /(?:(\d+)\s*(?:orders?|sales?|units?|customers?|clients?|deals?))|(?:(?:orders?|sales?|deals?)\s*(?:were|was|of|:)?\s*(\d+))/i;
  const orderMatch = clean.match(orderRegex);
  if (orderMatch) {
    const rawVal = orderMatch[1] || orderMatch[2];
    if (rawVal) {
      dailyOrders = parseInt(rawVal, 10);
      matchedFields.push("dailyOrders");
    }
  }

  // 2. Match Revenue / Income / Inflow (e.g. "revenue was ₹85,000", "earned 85,000", "sales ₹1,50,000", "revenue of 1.5L")
  const revRegex = /(?:(?:revenue|income|inflow|sales|gross|billed)\s*(?:was|were|of|is|hit|at|:)?\s*(?:[₹$]|INR\s*)?([0-9]+(?:,[0-9]+)*(?:\.[0-9]+)?\s*(?:k|lakh|lac|cr|crore|l)?))|(?:(?:[₹$]|INR\s*)([0-9]+(?:,[0-9]+)*(?:\.[0-9]+)?\s*(?:k|lakh|lac|cr|crore|l)?)\s*(?:in\s*)?(?:revenue|sales|income|inflow))/i;
  const revMatch = clean.match(revRegex);
  if (revMatch) {
    const rawVal = revMatch[1] || revMatch[2];
    if (rawVal) {
      const val = parseNum(rawVal);
      if (!isNaN(val) && val > 0) {
        dailyRevenue = val;
        matchedFields.push("dailyRevenue");
      }
    }
  }

  // 3. Match Expenses / Burn / Spend (e.g. "expenses were ₹30,000", "burn was 45k", "spent ₹15,000 on ads")
  const expRegex = /(?:(?:expenses?|burn|cost|spend|spent|outflow)\s*(?:was|were|of|is|at|:)?\s*(?:[₹$]|INR\s*)?([0-9]+(?:,[0-9]+)*(?:\.[0-9]+)?\s*(?:k|lakh|lac|cr|crore|l)?))|(?:(?:[₹$]|INR\s*)([0-9]+(?:,[0-9]+)*(?:\.[0-9]+)?\s*(?:k|lakh|lac|cr|crore|l)?)\s*(?:in\s*)?(?:expenses?|burn|spend|costs?))/i;
  const expMatch = clean.match(expRegex);
  if (expMatch) {
    const rawVal = expMatch[1] || expMatch[2];
    if (rawVal) {
      const val = parseNum(rawVal);
      if (!isNaN(val) && val > 0) {
        dailyExpenses = val;
        matchedFields.push("dailyExpenses");
      }
    }
  }

  // 4. Match Cash on Hand / Reserves / Bank balance
  const cashRegex = /(?:(?:cash|reserves|bank|liquidity|balance)\s*(?:was|were|of|is|at|:)?\s*(?:[₹$]|INR\s*)?([0-9]+(?:,[0-9]+)*(?:\.[0-9]+)?\s*(?:k|lakh|lac|cr|crore|l)?))/i;
  const cashMatch = clean.match(cashRegex);
  if (cashMatch) {
    const rawVal = cashMatch[1];
    if (rawVal) {
      const val = parseNum(rawVal);
      if (!isNaN(val) && val > 0) {
        cashOnHand = val;
        matchedFields.push("cashOnHand");
      }
    }
  }

  // 5. Match Team Size & Headcount (e.g. "team headcount is now 16", "team size is 15", "headcount: 20", "team is 18")
  const teamRegex = /(?:(?:team(?:\s+headcount|\s+size)?|headcount|staff|engineers|employees)\s*(?:is|was|at|of|reached|to|hit|:)?\s*(?:now|currently)?\s*(\d+))/i;
  const teamMatch = clean.match(teamRegex);
  if (teamMatch && teamMatch[1]) {
    teamSize = parseInt(teamMatch[1], 10);
    matchedFields.push("teamSize");
  }

  // 6. Match Hiring Delta (e.g. "hired 2 engineers", "added 3 members")
  const hireRegex = /(?:hired|added|onboarded)\s*(\d+)\s*(?:engineers?|developers?|members?|employees?|people|staff)?/i;
  const hireMatch = clean.match(hireRegex);
  if (hireMatch && hireMatch[1] && teamSize === undefined) {
    // If no absolute team size was given, note the delta
    matchedFields.push("hiringDelta");
  }

  // If we only have bare numbers with currency (e.g. "₹85,000 today from 42 orders")
  if (!dailyRevenue) {
    const currencyOnlyRegex = /(?:[₹$]|INR\s*)([0-9]+(?:,[0-9]+)*(?:\.[0-9]+)?\s*(?:k|lakh|lac|cr|crore|l)?)/i;
    const currMatch = clean.match(currencyOnlyRegex);
    if (currMatch && currMatch[1]) {
      const val = parseNum(currMatch[1]);
      if (!isNaN(val) && val > 0) {
        dailyRevenue = val;
        matchedFields.push("dailyRevenue");
      }
    }
  }

  // Monthly approximations
  const monthlyRevenueEquivalent = dailyRevenue ? Math.round(dailyRevenue * 30) : undefined;
  const monthlyBurnEquivalent = dailyExpenses ? Math.round(dailyExpenses * 30) : undefined;

  // Build summary description
  const parts: string[] = [];
  if (dailyOrders !== undefined) parts.push(`${dailyOrders} orders`);
  if (dailyRevenue !== undefined) parts.push(`₹${dailyRevenue.toLocaleString("en-IN")} revenue`);
  if (dailyExpenses !== undefined) parts.push(`₹${dailyExpenses.toLocaleString("en-IN")} expenses/burn`);
  if (cashOnHand !== undefined) parts.push(`₹${cashOnHand.toLocaleString("en-IN")} cash reserve`);
  if (teamSize !== undefined) parts.push(`${teamSize} team headcount`);
  if (hireMatch && hireMatch[1]) parts.push(`+${hireMatch[1]} new hires`);

  // If no specific numeric metric was extracted, preserve as operational update note
  if (matchedFields.length === 0) {
    matchedFields.push("operationalNotes");
    parts.push("Daily operational milestone recorded");
  }

  return {
    rawText: clean,
    detectedAt: new Date().toISOString(),
    dailyRevenue,
    dailyOrders,
    dailyExpenses,
    monthlyRevenueEquivalent,
    monthlyBurnEquivalent,
    cashOnHand,
    teamSize,
    summary: parts.join(" · "),
    confidence: matchedFields.includes("dailyRevenue") || matchedFields.includes("teamSize") ? 0.95 : 0.85,
    matchedFields,
  };
}
