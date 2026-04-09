console.log("ENV CHECK:", {
  keyExists: !!process.env.AIRTABLE_API_KEY,
  keyPreview: process.env.AIRTABLE_API_KEY?.slice(0,5),
  base: process.env.AIRTABLE_BASE_ID,
  table: process.env.AIRTABLE_TABLE_NAME
    
import Airtable from "airtable";

export default async function handler(req, res) {
  console.log("API HIT");

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const base = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY,
    }).base(process.env.AIRTABLE_BASE_ID);

    const data = req.body;
    console.log("DATA RECEIVED:", data);

    const response = await base(process.env.AIRTABLE_TABLE_NAME).create([
      {
       fields: Object.fromEntries(
  Object.entries(data).map(([key, value]) => [
    key,
    Array.isArray(value) ? value.join(", ") : value
  ])
),
      },
    ]);

    console.log("AIRTABLE RESPONSE:", response);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("AIRTABLE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
}
