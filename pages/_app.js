// pages/_app.js
// import "../src/styles/globals.css"; // 실제 필요하면 경로 확인하고 유지
import { AuthProvider } from "../src/contexts/AuthContext";

export default function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
