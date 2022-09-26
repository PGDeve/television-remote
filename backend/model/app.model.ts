export interface ChannelData {
    code: string
    description: string
    type: "image" | "video" | "render" | "renderColor" 
    url: string
}

export interface ChannelObject {
    [id: string]: ChannelData
}