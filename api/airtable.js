// File: api/airtable.js

export default async function handler(req, res) {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = "1";

  let allRecords = [];
  let offset = "";

  try {
    do {
      const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}?pageSize=100&sort[0][field]=Placement&sort[0][direction]=asc${offset ? `&offset=${offset}` : ''}`;

      const airtableResponse = await fetch(url, {
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      });

      if (!airtableResponse.ok) {
        const errorText = await airtableResponse.text();
        console.error("Airtable response error:", errorText);
        throw new Error(`Airtable error: ${airtableResponse.status}`);
      }

      const data = await airtableResponse.json();

      const simplified = data.records.map(record => ({
        Placement: record.fields["Placement"] || "",
        Area: record.fields["Area"] || "",
        Street: record.fields["Street"] || "",
        Address: record.fields["Address"] || "",
        Room: record.fields["Room"] || "",
        "Entrance Key": record.fields["Entrance Key"] || "",
        "Room A Key": record.fields["Room A Key"] || "",
        "Room B Key": record.fields["Room B Key"] || "",
        "Room C Key": record.fields["Room C Key"] || "",
        "Room D Key": record.fields["Room D Key"] || "",
        "Mailbox Key": record.fields["Mailbox Key"] || ""
      }));

      allRecords = allRecords.concat(simplified);
      offset = data.offset ? `&offset=${data.offset}` : "";
    } while (offset);

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(allRecords);

  } catch (error) {
    console.error("Error fetching Airtable data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
