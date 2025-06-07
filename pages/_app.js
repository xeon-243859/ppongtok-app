// pages/_app.js
import "@/styles/globals.css"; // 없으면 이 줄은 삭제해도 됨
import { AuthProvider } from "@/contexts/AuthContext";

export default function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
