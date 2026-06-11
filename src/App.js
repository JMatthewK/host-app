import React, { useState, useEffect } from 'react';
import YouTube from "react-youtube";

function App() {
  const [currentVideo, setCurrentVideo] = useState(null);
  const [queue, setQueue] = useState([]);
  const api = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  console.log("API URL:", api);


  const fetchNextVideo = async () => {
      try {
        const res = await fetch(`${api}/queue/next`);
        const data = await res.json();
        if (data.video_id) {
          setCurrentVideo(data.video_id);
          fetchQueue();
          console.log("Next video:", data.video_id);
        } else {
          setCurrentVideo(null);
          console.log("Queue Empty")
        } 
      } catch (err) {
          console.error("Error fetching next video:", err);
    };
  }

  const fetchQueue = async() => {
    try {
      const res = await fetch(`${api}/queue/list`);
      const data = await res.json();
      setQueue(data);
    } catch (err) {
      console.error("Error fetching queue:", err);
    } 
  };

  useEffect(() => {
    fetchNextVideo();
  }, []);

  const onEnd = () => {
    fetchNextVideo();
  };

  return (
      <div style={{ background: "#111", color: "#fff", minHeight: "100vh", textAlign: "center" }}>
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
