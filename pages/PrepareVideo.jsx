import { useEffect } from "react";
import { useRouter } from "next/router"; // ✅ useNavigate → useRouter

export default function PrepareVideo() {
  const router = useRouter();

  useEffect(() => {
    localStorage.setItem("last-page", "/style/select");
    router.replace("/video/select"); // ✅ navigate → router.replace
  }, [router]);

  return null;
}
