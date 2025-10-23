const config = {
    API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8888',
    VIDEOSTREAM_URL: import.meta.env.VITE_VIDEO_STREAM || 'http://localhost:8888',
    MEETING_INFOR_PATH: "meeting-infor",
    MEETING_SCHEDULE_PATH: "meeting-schedule",
    PATICIPANT_PATH: "participants",
    DOCUMENT_PATH: "document",
    CONFIG_UPDATE_PATH: "api/config-data",
    CONFIG_UPDATE_PATH_WITH_FILE: "api/config-data",
    CONFIG_FILE: "assert/config/meeting_infor.json"
}

export default config;