export default async function handler(req, res) {
  try {
    // Vercel の Edge Function では req.json() で body を取得
    const body = await req.json();
    const prompt = body.prompt;

    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    const response = await fetch(
      "https://api.stability.ai/v2beta/stable-image/generate/core",
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
      return res.status(500).json({ error: "Image generation failed" });
    }

    res.status(200).json({ image: result.image });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
