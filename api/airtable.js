// api/airtable.js

export default async function handler(req, res) {
  const airtableToken = 'patd2ctkR4bsBQCm2.39c9a83458cc16080e6292ce147df431b90b9f676b2e68de4034fbdf6f91320f';
  const baseId = 'appWbzilqayDuWDhi';
  const tableName = 'Imported table';

  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}?maxRecords=1000`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${airtableToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: await response.text() });
    }

    const data = await response.json();
    const records = data.records.map(record => record.fields);
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
