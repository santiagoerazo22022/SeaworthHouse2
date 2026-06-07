// Server-safe module — no Firebase SDK imports here.
// This file is imported by both server and client code.

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

export const IS_DEMO =
  !projectId || projectId === "demo" || projectId === "";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
