import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/intro"); // ✅ 인트로 페이지로 리디렉션
  }, [router]);

}
 return (
    <div style={{ padding: "2rem", fontSize: "1.5rem", color: "black" }}>
      👋 인트로 페이지로 이동 중입니다...
    </div>
  );
