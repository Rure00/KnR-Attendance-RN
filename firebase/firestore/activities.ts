import firestore from "@react-native-firebase/firestore";

const usersCollection = firestore().collection("Users");

const users = await firestore().collection('Users').get();
const user = await firestore().collection('Users').doc('ABC').get();

