// Firebase 설정 파일
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// See: https://support.google.com/firebase/answer/7015592
const firebaseConfig = {
  projectId: "knr-attendance-3957b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
