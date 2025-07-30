import { AttendanceStatus } from "./attendace-status";

export interface AttendanceEntry {
  createdAt: Date;
  status: AttendanceStatus;
  note?: string;
}

export interface Activity {
  id: string;
  date: Date;
  attended: number;
  late: number;
  notAttended: number;
  unexcused: number;
  entire: number;

  attendance: Record<string, AttendanceEntry>; // memberId -> entry
}
