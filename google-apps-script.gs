const SPREADSHEET_ID = '1EYMb6Yu9pVMovtzKEL6K4E2lnnj8fx_qc7Q_IZAd0wI';
const SHEET_NAME = 'hsse_state';

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action ? String(e.parameter.action) : 'load').toLowerCase();
  const key = e && e.parameter && e.parameter.key ? String(e.parameter.key) : '';

  if (!key) return jsonResponse_({ ok: false, error: 'Missing key' });
  if (action !== 'load') return jsonResponse_({ ok: false, error: 'Unsupported action' });

  return jsonResponse_({ ok: true, data: readValue_(key) });
}

function doPost(e) {
  const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  const action = String(body.action || '').toLowerCase();
  const key = String(body.key || '');

  if (!key) return jsonResponse_({ ok: false, error: 'Missing key' });
  if (action !== 'save') return jsonResponse_({ ok: false, error: 'Unsupported action' });

  writeValue_(key, body.data);
  return jsonResponse_({ ok: true });
}

function readValue_(key) {
  const sheet = getSheet_();
  const rows = sheet.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === key) {
      const raw = rows[i][1];
      if (!raw) return [];
      return JSON.parse(String(raw));
    }
  }

  return [];
}

function writeValue_(key, data) {
  const sheet = getSheet_();
  const rows = sheet.getDataRange().getValues();
  const payload = JSON.stringify(data);
  const now = new Date();

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === key) {
      sheet.getRange(i + 1, 2, 1, 2).setValues([[payload, now]]);
      return;
    }
  }

  sheet.appendRow([key, payload, now]);
}

function getSheet_() {
  if (SPREADSHEET_ID === 'PASTE_SPREADSHEET_ID_HERE') {
    throw new Error('Set SPREADSHEET_ID in google-apps-script.gs');
  }

  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.appendRow(['key', 'data', 'updated_at']);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['key', 'data', 'updated_at']);
  }

  return sheet;
}

function jsonResponse_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}