export interface MeetingParticipantType {
    id: number,
    meeting_id: number,
    full_name: string,
    type: "delegate"|"chairman"|null,
    status: "joined"|"not-joined"|null,
    created_at: Date|string|null,
    updated_at: Date|string|null,
    deleted_at: Date|string|null
}