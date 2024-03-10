export interface MessageDTO {
    name: string
    message: string
    date: string
}

export interface CreateMessageDTO {
    receiverId?: string
    message: string
}