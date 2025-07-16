import { statuses } from "./attendace-status";

export type Position = "GK" | "DF" | "MF" | "FW";
export const positions: [Position, Position, Position, Position] = [
  "GK",
  "DF",
  "MF",
  "FW",
];

export interface Member {
  id: string;
  name: string;
  birth: Date;
  position: Position[];
  joinAt: Date;
  phoneNumber: string;
}

export const testMembers: Member[] = [
  {
    id: "1",
    name: "김민재",
    birth: new Date("1996-11-15"),
    position: ["DF"],
    joinAt: new Date("2023-03-01"),
    phoneNumber: "010-1234-5678",
  },
  {
    id: "2",
    name: "이강인",
    birth: new Date("2001-02-19"),
    position: ["MF"],
    joinAt: new Date("2022-07-10"),
    phoneNumber: "010-2345-6789",
  },
  {
    id: "3",
    name: "손흥민",
    birth: new Date("1992-07-08"),
    position: ["FW"],
    joinAt: new Date("2021-09-20"),
    phoneNumber: "010-3456-7890",
  },
  {
    id: "4",
    name: "조현우",
    birth: new Date("1991-09-25"),
    position: ["GK"],
    joinAt: new Date("2020-01-15"),
    phoneNumber: "010-4567-8901",
  },
  {
    id: "5",
    name: "황희찬",
    birth: new Date("1996-01-26"),
    position: ["FW"],
    joinAt: new Date("2023-04-12"),
    phoneNumber: "010-5678-9012",
  },
  {
    id: "6",
    name: "정우영",
    birth: new Date("1999-09-20"),
    position: ["MF"],
    joinAt: new Date("2021-06-30"),
    phoneNumber: "010-6789-0123",
  },
  {
    id: "7",
    name: "백승호",
    birth: new Date("1997-03-17"),
    position: ["MF"],
    joinAt: new Date("2022-08-21"),
    phoneNumber: "010-7890-1234",
  },
  {
    id: "8",
    name: "김승규",
    birth: new Date("1990-09-30"),
    position: ["GK"],
    joinAt: new Date("2019-05-10"),
    phoneNumber: "010-8901-2345",
  },
  {
    id: "9",
    name: "권창훈",
    birth: new Date("1994-06-30"),
    position: ["MF"],
    joinAt: new Date("2020-11-03"),
    phoneNumber: "010-9012-3456",
  },
  {
    id: "10",
    name: "홍철",
    birth: new Date("1990-09-17"),
    position: ["DF"],
    joinAt: new Date("2018-04-27"),
    phoneNumber: "010-0123-4567",
  },
];

export const randomAttendanceMap = new Map(
  testMembers.map(
    (member) =>
      [member, statuses[Math.floor(Math.random() * statuses.length)]] as const
  )
);
