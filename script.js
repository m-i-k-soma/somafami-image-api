async function generateImage() {
  const prompt = document.getElementById("prompt").value;

  const res = await fetch("/api/generate-image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ prompt })
  });

  let data;
  try {
    data = await res.json();
  } catch (e) {
    alert("サーバーが JSON を返していません（500エラー）");
    console.error(e);
    return;
  }

  if (!res.ok) {
    alert("画像生成に失敗しました: " + (data.error || "Unknown error"));
    return;
  }

  // 画像表示
  const imgTag = document.getElementById("result-img");
  imgTag.src = "data:image/png;base64," + data.image;
}
