export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME } = process.env;

  console.log("ENV CHECK:", {
    keyExists: !!AIRTABLE_API_KEY,
    keyPrefix: AIRTABLE_API_KEY?.slice(0, 10), // see more of the token
    base: AIRTABLE_BASE_ID,
    table: AIRTABLE_TABLE_NAME,
  });

  try {
    const data = req.body;

    const formattedData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        Array.isArray(value) ? value.join(", ") : value,
      ])
    );

    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        records: [{ fields: formattedData }],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("AIRTABLE ERROR BODY:", errorBody);
      return res.status(response.status).json({ error: errorBody });
    }

    const result = await response.json();
    res.status(200).json({ success: true, record: result });
  } catch (error) {
    console.error("HANDLER ERROR:", error);
    res.status(500).json({ error: error.message });
  }
}
