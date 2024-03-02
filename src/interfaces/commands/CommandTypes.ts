export enum CommandType {
  Public = "공통",
  ServerOwner = "서버장",
  President = "넬장",
  Regular = "정회원",
  Associate = "준회원",
}

export const commandTypes = Object.values(CommandType);
