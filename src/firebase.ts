import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAu7_Ua0Y9stnSZw5y-unHwKMjnhggKAU0",
  authDomain: "x-matter-2cc2b.firebaseapp.com",
  databaseURL: "https://x-matter-2cc2b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "x-matter-2cc2b",
  storageBucket: "x-matter-2cc2b.firebasestorage.app",
  messagingSenderId: "959163336638",
  appId: "1:959163336638:web:9c48833d31bced80661bef",
  measurementId: "G-97P8116VCQ"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export interface ChangelogEntry {
  ver: string;
  date: string;
  status: 'dev' | 'alpha' | 'beta' | 'release';
  changes: { type: 'new' | 'fix' | 'upd'; text: string }[];
}

export interface ScriptData {
  name: string;
  code: string;
}

const CHANGELOG_REF = 'renault/changelog';
const SCRIPT_REF = 'renault/script';

export async function getChangelog(): Promise<ChangelogEntry[]> {
  try {
    const snapshot = await get(ref(db, CHANGELOG_REF));
    if (snapshot.exists()) {
      return snapshot.val() as ChangelogEntry[];
    }
  } catch (e) {
    console.error('Firebase read error:', e);
  }
  return [];
}

export async function saveChangelog(entries: ChangelogEntry[]): Promise<void> {
  try {
    await set(ref(db, CHANGELOG_REF), entries);
  } catch (e) {
    console.error('Firebase write error:', e);
  }
}

export async function getScript(): Promise<ScriptData | null> {
  try {
    const snapshot = await get(ref(db, SCRIPT_REF));
    if (snapshot.exists()) {
      return snapshot.val() as ScriptData;
    }
  } catch (e) {
    console.error('Firebase read error:', e);
  }
  return null;
}

export async function saveScript(data: ScriptData): Promise<void> {
  try {
    await set(ref(db, SCRIPT_REF), data);
  } catch (e) {
    console.error('Firebase write error:', e);
  }
}
