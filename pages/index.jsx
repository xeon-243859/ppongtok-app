import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/intro"); // ✅ 인트로 페이지로 리디렉션
  }, [router]);

  return null; // 아무것도 렌더링하지 않음
}
