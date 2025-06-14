const functions = require("firebase-functions/v2/https");
const { onRequest } = functions;
const admin = require("firebase-admin");
const { Storage } = require("@google-cloud/storage");
const puppeteer = require("puppeteer-core");
const chromium = require("chrome-aws-lambda");

console.log("🚀 captureScreenshot function started");
console.log("💡 FORCED DEPLOY at", new Date().toISOString());
// 🔁 강제 배포용 더미 변경
const FORCE_DEPLOY = true;


if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();
const storage = new Storage();

exports.captureScreenshot = onRequest(
  {
    memory: "2GiB",           // ✅ 반드시 여기에 직접 지정!
    timeoutSeconds: 60,
    region: "us-central1",    // ⬅️ region도 명시해 주세요
  },
  async (req, res) => {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "Missing message ID" });
    console.log("🔥 FORCE REDEPLOY", new Date().toISOString());

    try {
      const executablePath =
        (await chromium.executablePath) || "/usr/bin/chromium-browser";
      if (!executablePath) {
        console.error("❌ Chromium 실행 경로를 찾을 수 없습니다.");
        return res.status(500).send("Chromium executablePath not found.");
      }

      console.log("🚀 launching browser...");
      const browser = await puppeteer.launch({
        args: chromium.args,
        executablePath,
        headless: chromium.headless,
      });
    

      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 630 });

      const url = `https://ppongtok-app.vercel.app/view/${id}`;
      console.log("📸 접속 URL:", url);

      try {
        await page.goto(url, {
          waitUntil: "networkidle0",
          timeout: 60000,
        });
        console.log("✅ 페이지 로딩 완료");
      } catch (navErr) {
        console.error("❌ 페이지 로딩 실패:", navErr);
        await browser.close();
        return res.status(500).send("Page failed to load.");
      }

      const screenshotBuffer = await page.screenshot({ type: "png" });
      await browser.close();
      console.log("📷 스크린샷 완료");

      const filePath = `thumbnails/${id}.png`;
      const bucket = admin.storage().bucket();
      const file = bucket.file(filePath);

      try {
        await file.save(screenshotBuffer, {
          metadata: { contentType: "image/png" },
        });
        console.log("✅ Firebase Storage 저장 완료");
      } catch (storageErr) {
        console.error("❌ Firebase Storage 저장 실패:", storageErr);
        return res.status(500).send("Storage upload failed.");
      }

      const [signedUrl] = await file.getSignedUrl({
        action: "read",
        expires: "03-01-2100",
      });

      try {
        await db.collection("messages").doc(id).update({
          thumbnailUrl: signedUrl,
        });
        console.log("✅ Firestore 업데이트 완료");
      } catch (dbErr) {
        console.error("❌ Firestore 업데이트 실패:", dbErr);
        return res.status(500).send("Firestore update failed.");
      }

      res.status(200).json({ thumbnailUrl: signedUrl });
    } catch (error) {
      console.error("❌ Screenshot capture failed (전체):", error);
      res.status(500).send("Screenshot capture failed.");
    }
  }
);
