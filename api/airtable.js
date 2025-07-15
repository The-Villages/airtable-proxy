// api/airtable.js
export default async function handler(req, res) {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME;

  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}?pageSize=100&sort[0][field]=Placement&sort[0][direction]=asc`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error from Airtable:', errorText);
      return res.status(500).json({ error: errorText });
    }

    const data = await response.json();
    const formatted = data.records.map(r => r.fields);

    res.status(200).json(formatted);
  } catch (err) {
    console.error('Proxy Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
