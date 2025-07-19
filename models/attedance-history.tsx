import { AttendanceStatus } from "./attendace-status";

export interface AttendanceHistory {
  memberId: string;
  attendanceRate: number;
  total: number;
  attendNum: number;
  nonAttendNum: number;
  lateNum: number;
  forcibleNum: number;

  yearlyAttendance: YearlyAttendance[];
}

export interface DailyAttendance {
  date: string;
  attendance: AttendanceStatus;
}

export interface YearlyAttendance {
  year: number;
  monthlyAttendances: Record<number, DailyAttendance[]>; // key: 1~12 (월)
}

export const dummyAttendanceHistory: AttendanceHistory = {
  memberId: `1`,
  attendanceRate: 85,
  total: 20,
  attendNum: 17,
  nonAttendNum: 2,
  lateNum: 1,
  forcibleNum: 0,
  yearlyAttendance: [
    {
      year: 2025,
      monthlyAttendances: {
        1: [
          { date: "2025-01-05", attendance: "참석" },
          { date: "2025-01-12", attendance: "지각" },
          { date: "2025-01-19", attendance: "불참" },
        ],
        2: [
          { date: "2025-02-02", attendance: "참석" },
          { date: "2025-02-09", attendance: "참석" },
        ],
        3: [
          { date: "2025-03-01", attendance: "불참" },
          { date: "2025-03-15", attendance: "참석" },
          { date: "2025-03-22", attendance: "참석" },
        ],
        4: [],
        5: [
          { date: "2025-05-05", attendance: "참석" },
          { date: "2025-05-12", attendance: "참석" },
        ],
        6: [],
        7: [{ date: "2025-07-01", attendance: "지각" }],
        8: [],
        9: [],
        10: [],
        11: [],
        12: [],
      },
    },
  ],
};
