import React from "react";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";


const PaymentPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const db = getFirestore();

 const handlePurchase = async (passCount, bonus = 0) => {
  const user = currentUser;

  if (!user) {
    alert("로그인 후 이용권을 구매할 수 있습니다!");
    navigate("/login");
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

  alert(`이용권이 ${passCount + bonus}장 충전되었습니다!`);
  navigate("/share");
};

return (
  <div className="payment-container" style={{ padding: 20, textAlign: "center" }}>
    <h2>이용권 구매</h2>
    <p>원하는 이용권 패키지를 선택해주세요.</p>
    <button onClick={() => handlePurchase(1)}>1회 이용권 - 1,000원</button>
    <button onClick={() => handlePurchase(5, 1)}>5회 이용권 + 1장 무료 - 5,000원</button>
    <button onClick={() => handlePurchase(10, 3)}>10회 이용권 + 3장 무료 - 10,000원</button>
  </div>
);
};
export default PaymentPage;
