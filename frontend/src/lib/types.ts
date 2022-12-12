export enum NotificationType_type {
  add_friend = 'add_friend',
}

export type NotificationType = {
  _id: string
  message: string
  type: NotificationType_type
  username: string
  from: string
}

export type TicTacToeGameType = {
  current_player: string
  board: string[]
  winner: string
  // a property with the name of the player existe : alex : "X"
}

enum CardType_suite {
  spades,
  diamonds,
  clubs,
  hearts,
}
export type CardType = {
  file: string
  value: string
  suite: CardType_suite
}
export type PresidentType = {
  current_player: string,
  playZoneCards: CardType[]
}

export type Connect4Type = {
  last_move: { p: string; x: number; y: number }
  board: string[][]
  winner: string
  current_player: string
}

export type GameMsgType = {
  _id: string
  message: string
  state: string
  room: string
}

export type MsgType = {
  _id: string
  room: string
  message: string
}

export type RoomType = {
  name: string
  _id: string
}

export type FriendType = {
  username: string
  _id: string
}
