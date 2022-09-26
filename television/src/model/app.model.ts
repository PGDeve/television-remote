export interface ChannelData {
    code: string
    description: string
    type: "image" | "video" | "render" | "renderColor" 
    url: string
}

export class ChannelData implements ChannelData {}

export interface AppError {
    title: string,
    description: string
}