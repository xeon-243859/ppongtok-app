import { useEffect } from "react";
import { useRouter } from "next/router"; // ✅ react-router-dom → next/router

export default function RedirectToStyle() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/style/select"); // ✅ navigate → router.replace
  }, [router]);

  return null;
}
