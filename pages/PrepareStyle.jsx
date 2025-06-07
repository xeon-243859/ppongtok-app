import { useEffect } from "react";
import { useRouter } from "next/router"; // ✅ useNavigate → useRouter

export default function PrepareStyle() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/style/select"); // ✅ navigate → router.replace
  }, [router]);

  return null;
}
