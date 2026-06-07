// Client-only module — imported exclusively by "use client" components.
// Never import this from server components or server-only modules.

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { IS_DEMO, firebaseConfig } from "./firebase";

function initClientAuth() {
  if (IS_DEMO) return null;
  const app =
    getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  return getAuth(app);
}

export const auth = initClientAuth();
