export interface MeetingInforType {
    id: number,
    name: string,
    start_date: Date|string|null,
    end_date: Date|string|null,
    place: string
}

export interface MeetingScheduleType {
    id: number,
    meeting_id: number,
    content: string,
    start_date: Date|string|null,
    end_date: Date|string|null,
    created_at: Date|string|null,
    updated_at: Date|string|null,
    deleted_at: Date|string|null
}