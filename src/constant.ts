export interface ListenEvents {
  message: (room: string, data: any) => void
}
