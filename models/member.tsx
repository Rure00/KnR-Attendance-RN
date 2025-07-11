export type Position = "GK" | "DF" | "MF" | "FW"

export interface Member{
    id: string,
    name: string,
    birt: Date,
    position: Position[],
    joinAt: Date,
    phoneNumber: string
}



export const testMembers: Member[] = [
  {
    id: "1",
    name: "김민재",
    birt: new Date("1996-11-15"),
    position: ["DF"],
    joinAt: new Date("2023-03-01"),
    phoneNumber: "010-1234-5678",
  },
  {
    id: "2",
    name: "이강인",
    birt: new Date("2001-02-19"),
    position: ["MF"],
    joinAt: new Date("2022-07-10"),
    phoneNumber: "010-2345-6789",
  },
  {
    id: "3",
    name: "손흥민",
    birt: new Date("1992-07-08"),
    position: ["FW"],
    joinAt: new Date("2021-09-20"),
    phoneNumber: "010-3456-7890",
  },
  {
    id: "4",
    name: "조현우",
    birt: new Date("1991-09-25"),
    position: ["GK"],
    joinAt: new Date("2020-01-15"),
    phoneNumber: "010-4567-8901",
  },
];