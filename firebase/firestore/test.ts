import { Activity, AttendanceEntry } from "@/models/activity";
import { Member } from "@/models/member";
import { logWithTag } from "@/utils/logWithTag";
import {
  createNewActivity,
  getActivityByDate,
  getAllActivities,
  updateActivity,
} from "./activities";
import {
  getAttendanceByActivityId,
  getAttendanceOfMember,
  setAttendanceForMember,
} from "./attendance";
import {
  createNewMember,
  getAllMembers,
  getMemberById,
  updateMember,
} from "./members";

export async function testFirestore() {
  logWithTag("KnR_Attendance", "--------------------------------------------");
  await testMemberFunctions();

  logWithTag("KnR_Attendance", "--------------------------------------------");
  await testActivityFunctions();

  logWithTag("KnR_Attendance", "--------------------------------------------");
  await testAttendanceFunctions();
}

// ✅ 테스트: 멤버 CRUD
async function testMemberFunctions() {
  logWithTag("KnR_Attendance", "🔍 testMemberFunctions 시작");

  const newMember: Omit<Member, "id"> = {
    name: "홍길동",
    phoneNumber: "010-1234-5678",
    birth: new Date(1999, 5, 19),
    position: ["MF", "FW"],
    joinAt: new Date(2020, 3, 12),
  };

  // Create
  await createNewMember(newMember);
  logWithTag("KnR_Attendance", "✅ 새 멤버 생성 완료");

  // Read All
  const members = await getAllMembers();
  logWithTag("KnR_Attendance", `👥 모든 멤버: ${members}`);

  // Get One
  if (members.length > 0) {
    const first = await getMemberById(members[0].id);
    logWithTag("KnR_Attendance", `🔍 첫 번째 멤버:${first}`);

    // Update
    const updated = {
      ...first!,
      name: "변경된 이름",
    };
    await updateMember(updated);
    logWithTag("KnR_Attendance", "✏️ 멤버 업데이트 완료");

    // Delete
    // await deleteMember(updated);
    // logWithTag("KnR_Attendance","🗑️ 멤버 삭제 완료");
  }
}

// ✅ 테스트: 활동 CRUD
async function testActivityFunctions() {
  logWithTag("KnR_Attendance", "🔍 testActivityFunctions 시작");

  const today = new Date();
  const newActivity: Omit<Activity, "id"> = {
    date: today,
    note: "테스트 활동",
    late: 0,
    attended: 0,
    notAttended: 0,
    unexcused: 0,
    entire: 0,
    attendance: {}, // 초기값
  };

  // Create
  await createNewActivity(newActivity);
  logWithTag("KnR_Attendance", "✅ 새 활동 생성 완료");

  // Read All
  const activities = await getAllActivities();
  logWithTag("KnR_Attendance", `📅 모든 활동:${activities}`);

  // Get by Date
  const actByDate = await getActivityByDate(today);
  logWithTag("KnR_Attendance", `📆 오늘 날짜로 조회된 활동:  ${actByDate}`);

  // Update
  if (actByDate) {
    const updated = {
      ...actByDate,
      note: "업데이트된 활동 노트",
    };
    await updateActivity(updated);
    logWithTag("KnR_Attendance", "✏️ 활동 업데이트 완료");

    // Delete
    // await deleteActivity(updated);
    // logWithTag("KnR_Attendance","🗑️ 활동 삭제 완료");
  }
}

// ✅ 테스트: 출석 관리
async function testAttendanceFunctions() {
  logWithTag("KnR_Attendance", "🔍 testAttendanceFunctions 시작");

  const members = await getAllMembers();
  const activities = await getAllActivities();

  if (members.length === 0 || activities.length === 0) {
    logWithTag("KnR_Attendance", "❌ 멤버나 활동이 부족합니다. 테스트 중단.");
    return;
  }

  const member = members[0];
  const activity = activities[0];

  const newEntry: AttendanceEntry = {
    createdAt: new Date(),
    status: "참석",
    note: "정상 출석 처리",
  };

  // Set attendance
  await setAttendanceForMember(activity.id, member.id, newEntry);
  logWithTag("KnR_Attendance", `✅ ${member.name} 출석 등록 완료`);

  // Get by activity
  const allAttendance = await getAttendanceByActivityId(activity.id);
  logWithTag(
    "KnR_Attendance",
    `📋 ${activity.note}의 출석 현황: ${allAttendance}`
  );

  // Get by member
  const memberAttendance = await getAttendanceOfMember(activity.id, member.id);
  logWithTag(
    "KnR_Attendance",
    `👤 ${member.name}의 출석 정보: ${memberAttendance}`
  );
}
