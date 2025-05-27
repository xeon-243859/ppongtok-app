import { useParams } from "react-router-dom";

const MessageViewerPage = () => {
  const { id } = useParams();

  return (
    <div>
      <h2>💌 받은 메시지</h2>
      <p>메시지 ID: {id}</p>
      {/* 이 ID로 Firebase에서 이미지/영상/자막 불러오기 */}
    </div>
  );
};

export default MessageViewerPage;
