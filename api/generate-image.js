export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // JSON本文の読み取り
  let prompt;
  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const text = Buffer.concat(chunks).toString();
    const json = JSON.parse(text);
    prompt = json.prompt;
  } catch (e) {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  try {
    const response = await fetch(
      "https://api.stability.ai/v2beta/stable-image/generate/core", // ←★無料モデル
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.STABILITY_API_KEY}`,
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: prompt,
          output_format: "png"
        })
      }
    );

    const result = await response.json();

    if (!result || !result.image) {
      return res.status(500).json({ error: "Image generation failed", detail: result });
    }

    res.status(200).json({ image: result.image });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}


