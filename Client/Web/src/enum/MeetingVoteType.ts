interface MeetingOption {
    id: "okBtn"|"noBtn"|"noAns"|"new_option"|any,
    name: string,
}
interface MeetingAnsOption {
    id: "okBtn"|"noBtn"|"noAns",
    value: number,
    color: "success"|"error"|"default",
}

export interface MeetingVoteType {
    id: number,
    content: string,
    options: Array<MeetingOption>,
    ans: Array<MeetingAnsOption>,
    is_done: boolean,
    is_start: boolean,
    status: "start"|"running"|"done",
    timeout: number
}