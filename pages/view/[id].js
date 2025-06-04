// src/pages/view/[id].js

import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ViewPage() {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/view/${id}`)
      .then(res => res.json())
      .then(setData)
      .catch(() => setData(null));
  }, [id]);

  if (!data) return <p>메시지를 불러오는 중입니다...</p>;
  if (data.error) return <p>메시지를 찾을 수 없습니다.</p>;

 return (
  <div style={{ padding: "1rem" }}>
    <h1>💌 공유된 메시지</h1>

    {data.videoUrl && (
      <video controls autoPlay muted style={{ width: "100%", marginBottom: 16 }}>
        <source src={data.videoUrl} />
      </video>
    )}

    {data.imageUrls?.length > 0 &&
      data.imageUrls.map((url, i) => (
        <img key={i} src={url} alt={`이미지 ${i}`} style={{ width: "100%", marginBottom: 16 }} />
      ))}

    <div style={{ background: "#fee", padding: "1rem", fontSize: "1.2rem" }}>
      {data.caption}
    </div>

    {/* 🎵 음악 자동 재생 */}
{data.music && (
  <audio src={data.music} autoPlay loop />
)}

</div>  // ← 이거 추가
); 
}