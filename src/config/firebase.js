import * as firebase from "firebase";

import { FirebaseConfig } from "../config/keys";
firebase.initializeApp(FirebaseConfig);

export const authRef = firebase.auth();
export const provider = new firebase.auth.GoogleAuthProvider();
export const db = firebase.firestore();
const settings = {timestampsInSnapshots: true};
db.settings(settings);
export const storageRef = firebase.storage().ref();

// export const todosRef = databaseRef.child("todos");