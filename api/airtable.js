export default async function handler(req, res) {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME;

  if (!apiKey || !baseId || !tableName) {
    return res.status(500).json({ error: "Missing environment variables" });
  }

  let records = [];
  let offset = null;

  try {
    do {
      const params = new URLSearchParams({
        pageSize: 100,
        ...(offset && { offset }),
        "sort[0][field]": "Placement",
        "sort[0][direction]": "asc",
      });

      const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}?${params.toString()}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      if (!response.ok) {
        const error = await response.text();
        return res.status(response.status).json({ error });
      }

      const data = await response.json();
      records.push(...data.records.map((r) => r.fields));
      offset = data.offset;
    } while (offset);

    res.status(200).json(records);
  } catch (err) {
    console.error("Airtable Fetch Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
