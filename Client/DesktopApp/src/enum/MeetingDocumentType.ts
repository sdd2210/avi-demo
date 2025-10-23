export interface MeetingDocumentType {
    id: number,
    meeting_id: number,
    file_name: string,
    file_suffix: string,
    file_oriName: string,
    file_path: string,
    file_type: string,
    created_at: Date|string|null,
    updated_at: Date|string|null,
    deleted_at: Date|string|null,
    description: string,
    hidden: boolean
}