import { NextResponse } from 'next/server';

export async function GET() {
  const token = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME;

  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;

  let records = [];
  let offset = '';

  try {
    do {
      const res = await fetch(`${url}${offset ? `?offset=${offset}` : ''}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Airtable API error: ${res.statusText}`);
      }

      const data = await res.json();
      records.push(...data.records.map(r => r.fields));
      offset = data.offset || '';

    } while (offset);

    return NextResponse.json(records);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
