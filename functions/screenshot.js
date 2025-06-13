// ✅ Step 1: Firebase Functions - captureScreenshot

const functions = require("firebase-functions/v2/https");
const { onRequest } = functions;
const admin = require("firebase-admin");
const { Storage } = require("@google-cloud/storage");
const puppeteer = require("puppeteer-core");
const chromium = require("chrome-aws-lambda");


const db = admin.firestore();
const storage = new Storage();

exports.captureScreenshot = onRequest({
  memory: "2GB", // memory updated//
  timeoutSeconds: 60,   // 🕒 최대 실행 시간도 충분히 확보//
}, async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "Missing message ID" });

  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 630 });
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
    await page.goto(`https://ppongtok-app.vercel.app/view/${id}`, {
      waitUntil: "networkidle0",
    });

    const screenshotBuffer = await page.screenshot({ type: "png" });
    await browser.close();

    const filePath = `thumbnails/${id}.png`;
    const bucket = admin.storage().bucket();
    const file = bucket.file(filePath);

    await file.save(screenshotBuffer, {
      metadata: { contentType: "image/png" },
    });

    const [url] = await file.getSignedUrl({
      action: "read",
      expires: "03-01-2100",
    });

    await db.collection("messages").doc(id).update({
      thumbnailUrl: url,
    });

    res.status(200).json({ thumbnailUrl: url });
  } catch (error) {
    console.error("Error capturing screenshot:", error);
    res.status(500).send("Screenshot capture failed.");
  }
});
// 임시로 주석 추가했음 메모리부족 1기가로 상향조정//
// 임로 주석 추가//
// v2: memory fix patch//