RSGT HSSE — PPE & Store Management System

This is a static HTML/CSS/JS prototype for RSGT's HSSE PPE & Store Management System.

How to run locally:

```powershell
# from the Website folder
python -m http.server 8000
# open http://localhost:8000/
```

Next steps:
- Tidy assets into `/assets/` and split CSS/JS files
- Initialize Git and push to GitHub for Pages hosting

Google Sheets shared data setup:
- Create a Google Sheet.
- Open [google-apps-script.gs](google-apps-script.gs) in Apps Script and paste its contents into `Code.gs`.
- Set `SPREADSHEET_ID` to your sheet ID.
- Deploy the script as a web app with access set to `Anyone`.
- Put the deployed web app URL into `window.__HSSE_GOOGLE_SHEETS__` inside `RSGT_HSSE_System.html`.
- The sheet tab will use `key`, `data`, and `updated_at` columns.
