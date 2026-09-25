import { DataPalBusinessLead, DataPalSearchCampaign } from "./types";

/**
 * Escapes CSV field value according to RFC 4180
 */
function escapeCSV(val: any): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).trim();
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/**
 * Triggers browser download of text/blob data
 */
function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Exports leads to a RFC 4180 compliant CSV file
 */
export function exportLeadsToCSV(leads: DataPalBusinessLead[], customFilename?: string): void {
  if (!leads || leads.length === 0) return;

  const headers = [
    "Index",
    "Business Name",
    "Category",
    "Website",
    "Phone Number",
    "Email Address",
    "Complete Address",
    "City",
    "State",
    "Country",
    "Postal Code",
    "Rating",
    "Review Count",
    "Existing Online Presence",
    "Directory Source",
    "Opportunity Level",
    "AI Opportunity Notes",
    "Verified Status",
    "Extraction Date",
  ];

  const rows = leads.map((lead, idx) => [
    idx + 1,
    lead.name,
    lead.category,
    lead.website || "No Website",
    lead.phone || "No Phone",
    lead.email || "No Email",
    lead.address,
    lead.city,
    lead.state,
    lead.country,
    lead.postalCode || "",
    lead.rating || "N/A",
    lead.reviewsCount || 0,
    lead.existingPresence || "None",
    lead.source,
    lead.opportunityLevel,
    lead.notes || "",
    lead.verified ? "Verified" : "Unverified",
    lead.extractedAt,
  ]);

  const csvContent = "\uFEFF" + [
    headers.map(escapeCSV).join(","),
    ...rows.map(row => row.map(escapeCSV).join(",")),
  ].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const filename = customFilename || `DataPal_Export_${new Date().toISOString().slice(0, 10)}.csv`;
  downloadBlob(blob, filename);
}

/**
 * Exports leads to native Microsoft Excel XML Workbook (.xls / .xlsx-ready)
 * formatted with colored header styling, column widths, and clickable links.
 */
export function exportLeadsToExcel(
  leads: DataPalBusinessLead[],
  customFilename?: string,
  campaignTitle?: string
): void {
  if (!leads || leads.length === 0) return;

  const title = campaignTitle || "DataPal Business Extractions";
  const dateStr = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:x="urn:schemas-microsoft-com:office:excel"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:html="http://www.w3.org/TR/REC-html40">
  <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
    <Title>${title}</Title>
    <Author>BizzPal DataPal Intelligence</Author>
    <Created>${new Date().toISOString()}</Created>
  </DocumentProperties>
  <Styles>
    <Style ss:ID="Header">
      <Font ss:Bold="1" ss:Color="#FFFFFF" ss:Size="11" ss:FontName="Segoe UI"/>
      <Interior ss:Color="#4338CA" ss:Pattern="Solid"/>
      <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#2D2D2D"/>
      </Borders>
    </Style>
    <Style ss:ID="TitleStyle">
      <Font ss:Bold="1" ss:Color="#1E1B4B" ss:Size="14" ss:FontName="Segoe UI"/>
      <Interior ss:Color="#EEF2FF" ss:Pattern="Solid"/>
    </Style>
    <Style ss:ID="DataCell">
      <Font ss:Size="10" ss:FontName="Segoe UI" ss:Color="#1F2937"/>
      <Alignment ss:Vertical="Center"/>
    </Style>
    <Style ss:ID="DataCellCenter">
      <Font ss:Size="10" ss:FontName="Segoe UI" ss:Color="#1F2937"/>
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
    </Style>
    <Style ss:ID="RatingCell">
      <Font ss:Bold="1" ss:Size="10" ss:FontName="Segoe UI" ss:Color="#D97706"/>
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
    </Style>
    <Style ss:ID="UrgentCell">
      <Font ss:Bold="1" ss:Size="10" ss:FontName="Segoe UI" ss:Color="#DC2626"/>
      <Interior ss:Color="#FEF2F2" ss:Pattern="Solid"/>
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
    </Style>
    <Style ss:ID="PhoneCell">
      <Font ss:Size="10" ss:FontName="Segoe UI" ss:Color="#059669" ss:Bold="1"/>
      <Alignment ss:Vertical="Center"/>
    </Style>
  </Styles>
  <Worksheet ss:Name="Extracted Leads">
    <Table>
      <Column ss:Width="35"/>
      <Column ss:Width="200"/>
      <Column ss:Width="140"/>
      <Column ss:Width="160"/>
      <Column ss:Width="120"/>
      <Column ss:Width="180"/>
      <Column ss:Width="240"/>
      <Column ss:Width="90"/>
      <Column ss:Width="90"/>
      <Column ss:Width="50"/>
      <Column ss:Width="60"/>
      <Column ss:Width="90"/>
      <Column ss:Width="120"/>
      <Column ss:Width="120"/>
      <Column ss:Width="300"/>
      
      <!-- Report Title Header -->
      <Row ss:Height="28">
        <Cell ss:MergeAcross="14" ss:StyleID="TitleStyle">
          <Data ss:Type="String">DataPal Business Intelligence Report: ${title} (${dateStr} • ${leads.length} Records)</Data>
        </Cell>
      </Row>

      <!-- Table Column Titles -->
      <Row ss:Height="24">
        <Cell ss:StyleID="Header"><Data ss:Type="String">#</Data></Cell>
        <Cell ss:StyleID="Header"><Data ss:Type="String">Business Name</Data></Cell>
        <Cell ss:StyleID="Header"><Data ss:Type="String">Category</Data></Cell>
        <Cell ss:StyleID="Header"><Data ss:Type="String">Website</Data></Cell>
        <Cell ss:StyleID="Header"><Data ss:Type="String">Phone Number</Data></Cell>
        <Cell ss:StyleID="Header"><Data ss:Type="String">Email Address</Data></Cell>
        <Cell ss:StyleID="Header"><Data ss:Type="String">Address</Data></Cell>
        <Cell ss:StyleID="Header"><Data ss:Type="String">City</Data></Cell>
        <Cell ss:StyleID="Header"><Data ss:Type="String">State</Data></Cell>
        <Cell ss:StyleID="Header"><Data ss:Type="String">Rating</Data></Cell>
        <Cell ss:StyleID="Header"><Data ss:Type="String">Reviews</Data></Cell>
        <Cell ss:StyleID="Header"><Data ss:Type="String">Opportunity</Data></Cell>
        <Cell ss:StyleID="Header"><Data ss:Type="String">Existing Presence</Data></Cell>
        <Cell ss:StyleID="Header"><Data ss:Type="String">Source</Data></Cell>
        <Cell ss:StyleID="Header"><Data ss:Type="String">AI Opportunity Analysis</Data></Cell>
      </Row>

      <!-- Table Data Rows -->
      ${leads
        .map((lead, idx) => {
          const isUrgent = lead.opportunityLevel === "Critical";
          return `
      <Row ss:Height="20">
        <Cell ss:StyleID="DataCellCenter"><Data ss:Type="Number">${idx + 1}</Data></Cell>
        <Cell ss:StyleID="DataCell"><Data ss:Type="String">${escapeXml(lead.name)}</Data></Cell>
        <Cell ss:StyleID="DataCell"><Data ss:Type="String">${escapeXml(lead.category)}</Data></Cell>
        <Cell ss:StyleID="DataCell"><Data ss:Type="String">${escapeXml(lead.website || "No Website")}</Data></Cell>
        <Cell ss:StyleID="PhoneCell"><Data ss:Type="String">${escapeXml(lead.phone || "—")}</Data></Cell>
        <Cell ss:StyleID="DataCell"><Data ss:Type="String">${escapeXml(lead.email || "—")}</Data></Cell>
        <Cell ss:StyleID="DataCell"><Data ss:Type="String">${escapeXml(lead.address)}</Data></Cell>
        <Cell ss:StyleID="DataCellCenter"><Data ss:Type="String">${escapeXml(lead.city)}</Data></Cell>
        <Cell ss:StyleID="DataCellCenter"><Data ss:Type="String">${escapeXml(lead.state)}</Data></Cell>
        <Cell ss:StyleID="RatingCell"><Data ss:Type="String">${lead.rating ? lead.rating + " ★" : "—"}</Data></Cell>
        <Cell ss:StyleID="DataCellCenter"><Data ss:Type="Number">${lead.reviewsCount || 0}</Data></Cell>
        <Cell ss:StyleID="${isUrgent ? "UrgentCell" : "DataCellCenter"}"><Data ss:Type="String">${escapeXml(lead.opportunityLevel)}</Data></Cell>
        <Cell ss:StyleID="DataCell"><Data ss:Type="String">${escapeXml(lead.existingPresence || "—")}</Data></Cell>
        <Cell ss:StyleID="DataCell"><Data ss:Type="String">${escapeXml(lead.source)}</Data></Cell>
        <Cell ss:StyleID="DataCell"><Data ss:Type="String">${escapeXml(lead.notes || "—")}</Data></Cell>
      </Row>`;
        })
        .join("")}
    </Table>
  </Worksheet>
</Workbook>`;

  const blob = new Blob([xml], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const filename = customFilename || `DataPal_Report_${new Date().toISOString().slice(0, 10)}.xls`;
  downloadBlob(blob, filename);
}

/**
 * Exports all campaigns together into one Master Excel Workbook
 */
export function exportAllCampaignsToExcel(campaigns: DataPalSearchCampaign[]): void {
  const allLeads = campaigns.flatMap(c => c.results);
  exportLeadsToExcel(allLeads, `DataPal_Master_Campaigns_${new Date().toISOString().slice(0, 10)}.xls`, "All Extracted Campaigns");
}

function escapeXml(unsafe: string): string {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
