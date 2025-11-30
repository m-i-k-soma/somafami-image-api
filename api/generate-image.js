// Vercel Serverless Function: /api/generate-image.js

export default async function handler(req, res) {
  try {
    const { prompt } = req.body;

    const response = await fetch(
      "https://api.stability.ai/v2beta/stable-image/generate/ultra",
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

    // Base64 画像を返却
    res.status(200).json({ image: result.image });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
