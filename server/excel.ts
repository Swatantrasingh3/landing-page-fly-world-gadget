import { ENV } from "./_core/env";

export type ExcelRepairRow = {
  fullName: string;
  phone: string;
  email: string;
  droneBrand: string;
  droneModel: string;
  problemType: string;
  problemDescription: string;
  repairRequirement: string;
  pickupPreference: string;
};

function isConfigured() {
  return Boolean(
    ENV.microsoftTenantId &&
      ENV.microsoftClientId &&
      ENV.microsoftClientSecret &&
      ENV.excelDriveId &&
      ENV.excelWorkbookItemId,
  );
}

async function getAccessToken() {
  const response = await fetch(
    `https://login.microsoftonline.com/${encodeURIComponent(ENV.microsoftTenantId)}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: ENV.microsoftClientId,
        client_secret: ENV.microsoftClientSecret,
        scope: "https://graph.microsoft.com/.default",
        grant_type: "client_credentials",
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Microsoft token request failed (${response.status})`);
  }

  const data = (await response.json()) as { access_token?: string };
  if (!data.access_token) throw new Error("Microsoft token response had no access token");
  return data.access_token;
}

export async function appendRepairToExcel(row: ExcelRepairRow) {
  if (!isConfigured()) return { configured: false } as const;

  const token = await getAccessToken();
  const endpoint = [
    "https://graph.microsoft.com/v1.0",
    `drives/${encodeURIComponent(ENV.excelDriveId)}`,
    `items/${encodeURIComponent(ENV.excelWorkbookItemId)}`,
    `workbook/tables/${encodeURIComponent(ENV.excelTableName)}/rows/add`,
  ].join("/");
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      values: [[
        new Date().toISOString(),
        row.fullName,
        row.phone,
        row.email,
        row.droneBrand,
        row.droneModel,
        row.problemType,
        row.problemDescription,
        row.repairRequirement,
        row.pickupPreference,
        "new",
      ]],
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    console.error("[Excel] Failed to append repair request:", details);
    throw new Error(`Excel request failed (${response.status})`);
  }

  return { configured: true } as const;
}