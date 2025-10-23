import { useRef, useEffect } from 'react';

const WebRTCPlayer = () => {
  const videoRef = useRef<HTMLVideoElement|null>(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://192.168.0.34:8555/stream/mp4_loop`);
    ws.onmessage = (event) => {
      const video = videoRef.current;
      const mediaSource = new MediaSource();
      if(video)
        video.src = URL.createObjectURL(mediaSource);
      mediaSource.addEventListener("sourceopen", () => {
        const sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.42E01E"');
        sourceBuffer.appendBuffer(event.data);
      });
    };
  }, []);

  return <video ref={videoRef} controls autoPlay />;
};

export default WebRTCPlayer