import { AttendanceStatus } from "./attendace-status";

export interface AttendanceEntry {
  createdAt: string;
  status: AttendanceStatus;
  note?: string;
}

export interface Activity {
  id: string;
  date: string;
  attended: number;
  late: number;
  notAttended: number;
  unexcused: number;
  entire: number;

  attendance: Record<string, AttendanceEntry>; // memberId -> entry
}
