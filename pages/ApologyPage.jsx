// pages/ApologyPage.jsx
import styles from "./apologypage.module.css";

export default function ApologyPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🙏 진심 어린 사과를 전해볼까요?</h1>
      <p className={styles.description}>
        마음을 담아 진심으로 사과하는 메시지를 전하세요.
      </p>
      <button
        className={styles.button}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#4fc3f7")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#81d4fa")}
      >
        메시지 작성하기 ✍️
      </button>
    </div>
  );
}
