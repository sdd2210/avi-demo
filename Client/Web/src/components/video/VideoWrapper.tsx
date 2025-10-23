import { useEffect, useState } from 'react';
import instance from '../../api/axios';
import config from '../../config/config';
import WebRTSPlayer from './WebRTSPlayer';
import WaitingScreen from '../submenu/waitingScreen/WaitingScreen';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';

interface HlsVideoPlayerProps {
    controls?: boolean;
    autoPlay?: boolean;
    className?: string;
}

const VideoWrapper = ({
    controls = false,
    autoPlay = true,
    className = ''
}: HlsVideoPlayerProps) => {

    const global_state = useSelector((state: RootState) => state.global_state);
    const [isWaiting, setIsWaiting] = useState(false)
    const [waitingTitle, setWaitingTitle] = useState("")
    const [waitingContent, setWaitingContent] = useState("")
    const getMeetingInfor = async () => {
        try {
            const meetingData = await instance.get(config.CONFIG_FILE);
            setWaitingTitle(meetingData.data.title_waiting)
            setWaitingContent(meetingData.data.content_waiting)

        } catch (error) {

        }
    }

    useEffect(() => {
        if (global_state.isWaiting) {
            getMeetingInfor();
            setIsWaiting(true)
        } else {
            setIsWaiting(false)
        }
    }, [global_state.isWaiting]);


    return (<>
        <div className='w-full h-full relative'>
            {
                isWaiting &&
                <>
                    <WaitingScreen content={waitingContent} title={waitingTitle} />
                </>
            }
            {
                !isWaiting &&
                <>
                    <WebRTSPlayer controls={controls} autoPlay={autoPlay} className={className} />
                </>
            }
        </div>
    </>);
};

export default VideoWrapper