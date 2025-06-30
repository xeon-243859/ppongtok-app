import { useRouter } from "next/router";
import { useEffect } from "react";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import { useAuth } from "../src/contexts/AuthContext";

export default function PaymentPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const db = getFirestore();

  const handlePurchase = async (passCount, bonus = 0) => {
    const user = currentUser;

    if (!user) {
      alert("로그인 후 이용권을 구매할 수 있습니다!");
      router.push("/loginpage");
      return;
    }

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    let currentPass = 0;
    if (userSnap.exists()) {
      currentPass = userSnap.data().freePassCount || 0;
    }

    await updateDoc(userRef, {
      freePassCount: currentPass + passCount + bonus,
    });

    // --- 여기부터가 수정된 부분입니다 ---

    // 1. 사용자에게 더 친절한 안내 메시지를 보여줍니다.
    alert(`이용권이 ${passCount + bonus}장 충전되었습니다. 이전 페이지로 돌아가 공유를 계속 진행해주세요.`);

    // 2. 특정 경로로 이동하는 대신, 이전 페이지로 돌아갑니다.
    // 이렇게 하면 '공유하기'를 눌렀다가 결제하러 온 사용자가 원래 있던 미리보기 페이지로 돌아갈 수 있습니다.
    router.back();

    // --- 여기까지 수정 ---
  };

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h2>이용권 구매</h2>
      <p>원하는 이용권 패키지를 선택해주세요.</p>
      <button onClick={() => handlePurchase(1)}>1회 이용권 - 1,000원</button>
      <button onClick={() => handlePurchase(5, 1)}>5회 이용권 + 1장 무료 - 5,000원</button>
      <button onClick={() => handlePurchase(10, 3)}>10회 이용권 + 3장 무료 - 10,000원</button>
    </div>
  );
}
