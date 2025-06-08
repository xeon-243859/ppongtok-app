import { useEffect } from "react";
import { useRouter } from "next/router";

export default function IndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/image/theme"); // 또는 앱의 메인 경로
  }, []);

  return null;
}
