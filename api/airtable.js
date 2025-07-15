export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");

  const airtableToken = 'patuJ8KmzLqa8gSkg.d29bbf048bb5d11044dcd289d23fbb403ac7a8c871d2a40d0df666feecbfb12b';
  const baseId = 'appErm2taGSSBKmNd';
  const tableName = '1';

  const allRecords = [];
  let offset = '';

  try {
    do {
      const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}?pageSize=100&sort[0][field]=Placement&sort[0][direction]=asc${offset ? `&offset=${offset}` : ''}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${airtableToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Airtable error: ${response.statusText}`);
      }

      const data = await response.json();
      allRecords.push(...data.records.map(record => record.fields));
      offset = data.offset;
    } while (offset);

    res.status(200).json(allRecords);
  } catch (error) {
    console.error('Proxy fetch error:', error);
    res.status(500).json({ error: error.message });
  }
}
