export default async function handler(req, res) {
  const token = "patd2ctkR4bsBQCm2.39c9a83458cc16080e6292ce147df431b90b9f676b2e68de4034fbdf6f91320f";
  const baseId = "appWbzilqayDuWDhi";
  const tableName = "Imported table"; // Adjust if you've renamed it
  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}?maxRecords=500&view=Grid%20view`;

  try {
    const airtableRes = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!airtableRes.ok) {
      throw new Error(`Airtable error: ${airtableRes.status}`);
    }

    const data = await airtableRes.json();
    const formatted = data.records.map(r => r.fields);
    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
