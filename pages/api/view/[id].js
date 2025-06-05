export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).send("Missing message ID");
  }

  try {
    const response = await fetch(`https://ogmeta-lqxptgkh3q-uc.a.run.app/${id}`);
    const html = await response.text();

    res.setHeader("Content-Type", "text/html");
    res.status(200).send(html);  // ✅ Functions 결과 HTML 그대로 전달
  } catch (error) {
    console.error("SSR Proxy Error:", error);
    res.status(500).send("Server error");
  }
}


