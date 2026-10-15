import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type {
  Brief,
  BriefPayload,
  Business,
  BusinessGoal,
  CreateBusinessInput,
} from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "store.json");

interface Store {
  businesses: Business[];
  briefs: Brief[];
}

function emptyStore(): Store {
  return { businesses: [], briefs: [] };
}

function ensureStore(): Store {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    const initial = emptyStore();
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), "utf8");
    return initial;
  }
  try {
    const raw = fs.readFileSync(DB_PATH, "utf8");
    const parsed = JSON.parse(raw) as Store;
    return {
      businesses: Array.isArray(parsed.businesses) ? parsed.businesses : [],
      briefs: Array.isArray(parsed.briefs) ? parsed.briefs : [],
    };
  } catch {
    return emptyStore();
  }
}

function writeStore(store: Store): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_PATH, JSON.stringify(store, null, 2), "utf8");
}

function normalizeGoals(goals: BusinessGoal[]): BusinessGoal[] {
  return goals.filter(
    (g): g is BusinessGoal =>
      g === "traffic" || g === "pricing" || g === "content",
  );
}

export function createBusiness(input: CreateBusinessInput): Business {
  const store = ensureStore();
  const business: Business = {
    id: randomUUID(),
    name: input.name.trim(),
    niche: input.niche.trim(),
    city: input.city.trim(),
    competitors: (input.competitors ?? "").trim(),
    goals: normalizeGoals(input.goals),
    created_at: new Date().toISOString(),
  };
  store.businesses.unshift(business);
  writeStore(store);
  return business;
}

export function getBusiness(id: string): Business | null {
  return ensureStore().businesses.find((b) => b.id === id) ?? null;
}

export function listBusinesses(): Business[] {
  return ensureStore().businesses;
}

export function saveBrief(businessId: string, payload: BriefPayload): Brief {
  const store = ensureStore();
  const brief: Brief = {
    id: randomUUID(),
    business_id: businessId,
    created_at: new Date().toISOString(),
    payload,
  };
  store.briefs.unshift(brief);
  writeStore(store);
  return brief;
}

export function getBrief(id: string): Brief | null {
  return ensureStore().briefs.find((b) => b.id === id) ?? null;
}

export function listBriefsForBusiness(businessId: string): Brief[] {
  return ensureStore().briefs.filter((b) => b.business_id === businessId);
}
