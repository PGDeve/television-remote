export interface ChannelData {
    code: string
    description: string
    type: "image" | "video" | "render" | "renderColor" 
    url: string
}

export class ChannelData implements ChannelData { 
    code = '';
    description = '';
    type: "render" | "image" | "video" | "renderColor" = "image";
    url = ""
}

export interface AppError {
    title: string,
    description: string
}