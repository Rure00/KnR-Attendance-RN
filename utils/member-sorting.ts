// https://velog.io/@exafe1009/jsts-%EC%A0%95%EB%A0%AC-%ED%95%9C%EA%B8%80-%EC%98%81%EB%AC%B8-%EC%88%AB%EC%9E%90-%EC%88%9C

import { AttendanceEntry } from "@/models/activity";
import { AttendanceStatus } from "@/models/attendace-status";
import { Member } from "@/models/member";

const patternNumber = /[0-9]/;
const patternAlphabet = /[a-zA-Z]/;
const patternHangul = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
const orderLevelDesc = [patternNumber, patternAlphabet, patternHangul];
const isAlphaBet = (s: string) => patternAlphabet.test(s.charAt(0));

const getLevel = (s: string) => {
  const index = orderLevelDesc.findIndex((pattern) => pattern.test(s));
  return index;
};

export const sortGroupString = (source: string[]) => {
  return source.sort((a, b) => {
    const aLevel = getLevel(a.charAt(0));
    const bLevel = getLevel(b.charAt(0));
    if (aLevel === bLevel) {
      return a.charCodeAt(0) - b.charCodeAt(0);
    }
    return bLevel - aLevel;
  });
};

export const memberNameSorting = (members: Member[]) => {
  return members.sort((a, b) => {
    return a.name.localeCompare(b.name, "ko-KR");
  });
};

export const memberAttendanceStatusSorting = (
  memberRecord: Record<string, Member>,
  attendanceRecord: Record<string, AttendanceEntry>
) => {
  const priority: AttendanceStatus[] = ["참석", "불참", "지각", "무단"];

  return priority.flatMap((status) =>
    Object.entries(attendanceRecord)
      .filter(([_, value]) => value.status === status)
      .map(([key, _]) => {
        return memberRecord[key]!;
      })
  );
};
