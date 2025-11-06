export namespace HttpResponses {
    export interface createEventResponse {
        dayOfWeek: string,
        id: number,
        start: string,
        stop?: string
    }

    export interface event {
        dayOfWeek: string,
        id: number,
        start: string,
        stop?: string
    }
}