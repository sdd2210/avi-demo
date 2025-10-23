import { useEffect, 
  // useRef,
   useState } from 'react';
import instance from '../../api/axios';
import config from '../../config/config';
// import Hls from 'hls.js';
import { VideoOff } from 'lucide-react';
// import { useSelector } from 'react-redux';
// import type { RootState } from '../../redux/store';

interface HlsVideoPlayerProps {
  controls?: boolean;
  autoPlay?: boolean;
  className?: string;
}

const WebRTSPlayer = ({
  // controls = false, 
  // autoPlay = true,
  className = '' 
}: HlsVideoPlayerProps) => {
  // const videoRef = useRef<HTMLVideoElement>(null);

  
  // Dùng useRef với kiểu Hls để giữ instance của Hls.js
  // const hlsRef = useRef<Hls | null>(null);

  const [hlsUrl, setHlsUrl] = useState()
  const getMeetingInfor = async () =>{
    try {
        const meetingData = await instance.get(config.CONFIG_FILE);
        setHlsUrl(meetingData.data?.link_stream ?? config.VIDEOSTREAM_URL)
    } catch (error) {
        
    }
  }

  // const handleHls = () =>{
  //   const video = videoRef.current;

  //   if (!video || !hlsUrl) {
  //     return;
  //   }

  //   // Dọn dẹp instance Hls.js hiện tại trước khi khởi tạo cái mới (quan trọng cho cleanup)
  //   if (hlsRef.current) {
  //       hlsRef.current.destroy();
  //       hlsRef.current = null;
  //   }

  //   // 2. Kiểm tra hỗ trợ của trình duyệt
  //   if (Hls.isSupported()) {
  //     // 3. Khởi tạo Hls.js
  //     const hls = new Hls({
  //       // Có thể thêm các cấu hình khác tại đây, ví dụ:
  //       // TỐI ƯU Hóa ABR VÀ BUFFERING
  //       // capLevelToPlayerSize: true, // GIỚI HẠN CHẤT LƯỢNG theo kích thước player
  //       // maxBufferLength: 30,        // Giới hạn đệm ở 30 giây
  //       // maxMaxBufferLength: 600,    // Giới hạn đệm khi paused
  //       backBufferLength: 90,

  //       // TỐI ƯU LIVE STREAM (Nếu bạn stream trực tiếp)
  //       lowLatencyMode: true,       // Bật chế độ độ trễ thấp
  //       // liveSyncDurationCount: 3,   // Giữ đồng bộ live point
  //       // // liveMaxLatencyDuration: 10,
  //       // initialLiveManifestSize: 1,

  //       enableWorker: true,
  //       autoStartLoad: true,
  //       // Lựa chọn, nếu muốn thấy thông tin chi tiết trên console:
  //       // debug: false, 
  //     });
  //     hlsRef.current = hls;

  //     hls.attachMedia(video);
      
  //     hls.on(Hls.Events.MEDIA_ATTACHED, () => {
  //       hls.loadSource(hlsUrl);
  //     });
      
  //     hls.on(Hls.Events.MANIFEST_PARSED, () => {
  //       if (autoPlay) {
  //         // Trả về một Promise, nên dùng .catch() để xử lý
  //         video.play().catch(error => {
  //           console.warn('Auto-play was prevented:', error);
  //           // Có thể hiện thị thông báo cho người dùng
  //         });
  //       }
  //     });

  //     // 4. Xử lý lỗi
  //     hls.on(Hls.Events.ERROR, (_event, data) => {
  //       console.error('HLS Error:', data);
  //       if (data.fatal) {
  //         switch (data.type) {
  //           case Hls.ErrorTypes.NETWORK_ERROR:
  //             console.log('Fatal network error, trying to recover...');
  //             hls.startLoad();
  //             break;
  //           case Hls.ErrorTypes.MEDIA_ERROR:
  //             console.log('Fatal media error, trying to recover...');
  //             hls.recoverMediaError();
  //             break;
  //           default:
  //             hls.destroy();
  //             hlsRef.current = null;
  //             break;
  //         }
  //       }
  //     });
  //   } 
  //   // Fallback cho các trình duyệt hỗ trợ HLS native (chủ yếu là Safari)
  //   else if (video.canPlayType('application/vnd.apple.mpegurl')) {
  //     video.src = hlsUrl;
  //     if (autoPlay) {
  //       video.addEventListener('loadedmetadata', () => video.play());
  //     }
  //   } else {
  //       console.error('Trình duyệt không hỗ trợ HLS hoặc MSE.');
  //   }
  // }

  // useEffect(() => {
  //   handleHls();
  //   // 5. Hàm Cleanup
  //   return () => {
  //     // Hủy instance Hls.js khi component bị unmount hoặc props thay đổi
  //     if (hlsRef.current) {
  //       hlsRef.current.destroy();
  //     }
  //     hlsRef.current = null;
  //   };
  // }, [hlsUrl, autoPlay]); // Dependencies: Chạy lại useEffect khi hlsUrl hoặc autoPlay thay đổi

  
  useEffect(() => {
    getMeetingInfor();
  }, []);

  // useEffect(() => {
  //   setIsWaiting(global_state.isWaiting);
  //   if(global_state.isWaiting){
  //     if (hlsRef.current) {
  //       hlsRef.current.destroy();
  //     }
  //   }else{
  //     getMeetingInfor();
  //   }
  // }, [global_state.isWaiting]);

  return (<>
    <div className='w-full h-full relative'>
      <VideoOff className='text-slate-400 absolute z-20 top-1/2 left-1/2 -translate-1/2' size={100}/>
      {/* <video
        ref={videoRef}
        controls={controls}
        autoPlay={autoPlay}
        muted
        className={className + " relative z-21 h-full aspect-video object-cover mx-auto "}
      /> */}
      <iframe src={hlsUrl} className={className + " relative z-21 h-full aspect-video object-cover mx-auto "}></iframe>
    </div>
  </>);
};

export default WebRTSPlayer