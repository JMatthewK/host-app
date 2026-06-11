import React, { useEffect, useState } from "react";
import YouTube from "react-youtube";

function App() {
  const [currentVideo, setCurrentVideo] = useState(null);
  const [queue, setQueue] = useState([]);

  // Fetch next video
  const fetchNextVideo = async () => {
    const res = await fetch("http://localhost:8000/queue/next");
    const data = await res.json();
    if (data.video_id) {
      setCurrentVideo(data.video_id);
      fetchQueue();
    }
  };

  // Fetch queue list
  const fetchQueue = async () => {
    const res = await fetch("http://localhost:8000/queue/list");
    const data = await res.json();
    setQueue(data);
  };

  useEffect(() => {
    fetchNextVideo();
  }, []);

  const onEnd = () => {
    fetchNextVideo();
  };

  return (
    <div style={{ background: "#111", color: "#fff", height: "100vh", textAlign: "center" }}>
      <h1>Sing Now - Host Player</h1>

      {currentVideo && (
        <YouTube
          videoId={currentVideo}
          onEnd={onEnd}
          opts={{
            height: "540",
            width: "960",
            playerVars: { autoplay: 1 },
          }}
        />
      )}

      <h2>Up Next</h2>
      <ul>
        {queue.map((item, idx) => (
          <li key={idx}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
