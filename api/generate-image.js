import OpenAI from "openai";

export default async function handler(req, res) {
  // CORS 設定（外部からアクセスする場合に必要）
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // POSTでpromptを受け取る
  const { prompt } = req.body || {};
  if (!prompt) {
    return res.status(400).json({ error: "prompt is required" });
  }

  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const result = await client.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
      response_format: "b64_json",
    });

    const imageBase64 = result.data[0].b64_json;

    return res.status(200).json({
      success: true,
      prompt,
      image_base64: imageBase64,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Failed to generate image",
      detail: error.message,
    });
  }
}

