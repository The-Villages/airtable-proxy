// /api/airtable.js
export default async function handler(req, res) {
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME;
  const apiKey = process.env.AIRTABLE_API_KEY;

  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}?pageSize=100&sort[0][field]=Placement&sort[0][direction]=asc`;

  try {
    const airtableResponse = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!airtableResponse.ok) {
      const errorBody = await airtableResponse.text();
      throw new Error(`Airtable API error: ${errorBody}`);
    }

    const data = await airtableResponse.json();

    // Extract just the fields
    const records = data.records.map(record => record.fields);

    res.status(200).json(records);
  } catch (error) {
    console.error("Proxy error:", error.message);
    res.status(500).json({ error: error.message });
  }
}
