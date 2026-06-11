import React, { useState, useEffect } from 'react';
import YouTube from "react-youtube";

function App() {
  const [currentVideo, setCurrentVideo] = useState(null);
  const [queue, setQueue] = useState([]);
  const [history, setHistory] = useState([]);
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

  const fetchHistory = async() => {
    try {
      const res = await fetch(`${api}/history/list`);
      const data = await res.json();
      console.log("HISTORY RESPONSE:", data);
      setHistory(data);
    } catch (err) {
      console.error("Error fetching history:", err);
    } 
  };

  useEffect(() => {
    fetchNextVideo();
    fetchQueue();
    fetchHistory();
  }, []);

  const onEnd = () => {
    goNext();
  };

  const goNext = async() => {
    const res = await fetch(`${api}/queue/next`);
    const data = await res.json();
    if (data.video_id) {
      setCurrentVideo(data.video_id);
      fetchQueue();
      fetchHistory();
    } else {
      setCurrentVideo(null);
    }
  }

  const goPrevious = async() => { 
    const res = await fetch(`${api}/queue/previous`);
    const data = await res.json();
    if (data.video_id) {
      setCurrentVideo(data.video_id);
      fetchQueue();
      fetchHistory();
    } else {
      setCurrentVideo(null);
    }
  };

  return (
      <div style={{ background: "#111", color: "#fff", minHeight: "100vh", textAlign: "center" }}>
        <h1>Sing Now - Host Player</h1>

        <div style={{ marginBottom: "20px" }}>
          <button 
          onClick={goPrevious}
          disabled={history.length === 0}
          style={{ marginRight: "10px" }}>  
            ⏮ Previous
          </button>
          <button 
          onClick={goNext} 
          disabled={queue.length === 0}>
            ⏭ Next
          </button>
        </div>

        {currentVideo && (
          <YouTube
            key={currentVideo}
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

        <h2>Recently Played</h2>
        <ul>
          {history.map((item, idx) => (
            <li key={idx}>{item.title}</li>
          ))}
        </ul>
      </div>
    );
}

export default App;
