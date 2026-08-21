# Excel submission setup

The repair form still saves to MySQL and, when Microsoft settings are configured, appends the same submission to the supplied workbook through Microsoft Graph.

## 1. Create the Excel table

In the workbook, create a table named `RepairRequests`. Its header row must contain these columns in this order:

`Timestamp`, `Full Name`, `Phone`, `Email`, `Drone Brand`, `Drone Model`, `Problem Type`, `Description`, `Requirement`, `Pickup`, `Status`

The table can be on any worksheet in the workbook.

## 2. Create Microsoft credentials

In Microsoft Entra admin center, create an app registration and add the Microsoft Graph **Application** permission `Files.ReadWrite.All`. Grant admin consent for the tenant, then create a client secret. Keep the secret on the server and never add it to client-side `VITE_*` variables.

## 3. Configure deployment variables

Copy `.env.example` to the deployment environment and set:

- `MICROSOFT_TENANT_ID`: your Entra tenant ID
- `MICROSOFT_CLIENT_ID`: the app registration client ID
- `MICROSOFT_CLIENT_SECRET`: the client secret value
- `EXCEL_DRIVE_ID`: `686B6BFFBB9F4A1D` from the supplied URL
- `EXCEL_WORKBOOK_ITEM_ID`: `s9cdceaa4d2df4c978bd735e0e4dd3f63` from the supplied URL
- `EXCEL_TABLE_NAME`: `RepairRequests`

Restart the server after changing environment variables. A form submission will then add one row to the table.