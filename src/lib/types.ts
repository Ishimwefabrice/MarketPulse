export type BusinessGoal = "traffic" | "pricing" | "content";

export interface Business {
  id: string;
  name: string;
  niche: string;
  city: string;
  competitors: string;
  goals: BusinessGoal[];
  created_at: string;
}

export interface Source {
  title: string;
  url: string;
  snippet: string;
  query: string;
}

export interface CompetitorCard {
  name: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  sourceUrls: string[];
}

export interface PriceSignal {
  item: string;
  signal: string;
  evidence: string;
  sourceUrls: string[];
}

export interface ContentDraft {
  channel: string;
  headline: string;
  body: string;
  why: string;
}

export interface ActionItem {
  priority: "high" | "medium" | "low";
  action: string;
  rationale: string;
}

export interface Opportunity {
  title: string;
  detail: string;
  sourceUrls: string[];
}

export interface BriefPayload {
  summary: string;
  competitors: CompetitorCard[];
  priceSignals: PriceSignal[];
  opportunities: Opportunity[];
  contentDrafts: ContentDraft[];
  actions: ActionItem[];
  sources: Source[];
}

export interface Brief {
  id: string;
  business_id: string;
  created_at: string;
  payload: BriefPayload;
}

export interface CreateBusinessInput {
  name: string;
  niche: string;
  city: string;
  competitors?: string;
  goals: BusinessGoal[];
}
