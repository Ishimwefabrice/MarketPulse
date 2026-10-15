import Database from "better-sqlite3";
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
const DB_PATH = path.join(DATA_DIR, "marketpulse.db");

let dbInstance: Database.Database | null = null;

function getDb(): Database.Database {
  if (dbInstance) return dbInstance;
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  dbInstance = new Database(DB_PATH);
  dbInstance.pragma("journal_mode = WAL");
  dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS businesses (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      niche TEXT NOT NULL,
      city TEXT NOT NULL,
      competitors TEXT NOT NULL DEFAULT '',
      goals TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS briefs (
      id TEXT PRIMARY KEY,
      business_id TEXT NOT NULL,
      payload TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (business_id) REFERENCES businesses(id)
    );
  `);
  return dbInstance;
}

function parseGoals(raw: string): BusinessGoal[] {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (g): g is BusinessGoal =>
        g === "traffic" || g === "pricing" || g === "content",
    );
  } catch {
    return [];
  }
}

function rowToBusiness(row: {
  id: string;
  name: string;
  niche: string;
  city: string;
  competitors: string;
  goals: string;
  created_at: string;
}): Business {
  return {
    id: row.id,
    name: row.name,
    niche: row.niche,
    city: row.city,
    competitors: row.competitors,
    goals: parseGoals(row.goals),
    created_at: row.created_at,
  };
}

export function createBusiness(input: CreateBusinessInput): Business {
  const db = getDb();
  const business: Business = {
    id: randomUUID(),
    name: input.name.trim(),
    niche: input.niche.trim(),
    city: input.city.trim(),
    competitors: (input.competitors ?? "").trim(),
    goals: input.goals,
    created_at: new Date().toISOString(),
  };
  db.prepare(
    `INSERT INTO businesses (id, name, niche, city, competitors, goals, created_at)
     VALUES (@id, @name, @niche, @city, @competitors, @goals, @created_at)`,
  ).run({
    ...business,
    goals: JSON.stringify(business.goals),
  });
  return business;
}

export function getBusiness(id: string): Business | null {
  const row = getDb()
    .prepare(`SELECT * FROM businesses WHERE id = ?`)
    .get(id) as
    | {
        id: string;
        name: string;
        niche: string;
        city: string;
        competitors: string;
        goals: string;
        created_at: string;
      }
    | undefined;
  return row ? rowToBusiness(row) : null;
}

export function listBusinesses(): Business[] {
  const rows = getDb()
    .prepare(`SELECT * FROM businesses ORDER BY created_at DESC`)
    .all() as Array<{
    id: string;
    name: string;
    niche: string;
    city: string;
    competitors: string;
    goals: string;
    created_at: string;
  }>;
  return rows.map(rowToBusiness);
}

export function saveBrief(businessId: string, payload: BriefPayload): Brief {
  const brief: Brief = {
    id: randomUUID(),
    business_id: businessId,
    created_at: new Date().toISOString(),
    payload,
  };
  getDb()
    .prepare(
      `INSERT INTO briefs (id, business_id, payload, created_at)
       VALUES (@id, @business_id, @payload, @created_at)`,
    )
    .run({
      id: brief.id,
      business_id: brief.business_id,
      payload: JSON.stringify(brief.payload),
      created_at: brief.created_at,
    });
  return brief;
}

export function getBrief(id: string): Brief | null {
  const row = getDb()
    .prepare(`SELECT * FROM briefs WHERE id = ?`)
    .get(id) as
    | {
        id: string;
        business_id: string;
        payload: string;
        created_at: string;
      }
    | undefined;
  if (!row) return null;
  return {
    id: row.id,
    business_id: row.business_id,
    created_at: row.created_at,
    payload: JSON.parse(row.payload) as BriefPayload,
  };
}

export function listBriefsForBusiness(businessId: string): Brief[] {
  const rows = getDb()
    .prepare(
      `SELECT * FROM briefs WHERE business_id = ? ORDER BY created_at DESC`,
    )
    .all(businessId) as Array<{
    id: string;
    business_id: string;
    payload: string;
    created_at: string;
  }>;
  return rows.map((row) => ({
    id: row.id,
    business_id: row.business_id,
    created_at: row.created_at,
    payload: JSON.parse(row.payload) as BriefPayload,
  }));
}
