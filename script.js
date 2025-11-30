// フロント側：画像生成APIを呼び出す関数
async function generateImage(promptText) {
  const response = await fetch("/api/generate-image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ prompt: promptText })
  });

  const result = await response.json();

  if (result.error) {
    console.error(result.error);
    return null;
  }

  return result.image; // Base64画像を返す
}
