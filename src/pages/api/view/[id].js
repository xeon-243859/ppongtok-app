export default function handler(req, res) {
  const { id } = req.query;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta property="og:title" content="누군가 당신에게 메시지를 보냈어요!" />
      <meta property="og:description" content="감동적인 영상 메시지를 확인해보세요." />
      <meta property="og:image" content="https://firebasestorage.googleapis.com/v0/b/your-app-id.appspot.com/o/og-images%2F${id}.jpg?alt=media" />
      <meta property="og:url" content="https://ppongtok-app.vercel.app/api/view/${id}" />
      <meta name="twitter:card" content="summary_large_image" />
    </head>
    <body>
      <script>
        window.location.href = "https://ppongtok-app.vercel.app/view/${id}";
      </script>
    </body>
    </html>
  `;

  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
