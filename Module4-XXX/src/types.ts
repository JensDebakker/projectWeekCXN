import { Type } from "@google/genai";

export enum GamePhase {
  INTRO = "INTRO",
  PHASE_1 = "PHASE_1", // OSINT Collector
  PHASE_2 = "PHASE_2", // Phishing Builder
  PHASE_3 = "PHASE_3", // Reveal
  SUMMARY = "SUMMARY"
}

export type InfoType = "name" | "role" | "tech" | "vendor" | "absence" | "company";

export interface ContentSegment {
  text: string;
  isDangerous?: boolean;
  type?: InfoType;
  reason?: string;
  tip?: string;
  severity?: "red" | "orange";
}

export interface SocialPost {
  id: number;
  platform: "LinkedIn" | "Twitter" | "X";
  author: string;
  role: string;
  avatar: string;
  timestamp: string;
  content: ContentSegment[];
}

export interface CollectedInfo {
  id: string;
  text: string;
  type: InfoType;
  reason: string;
}

export interface PhishingChoice {
  id: string;
  label: string;
  value: string;
  isBest?: boolean;
  requiredInfoType?: InfoType;
}

export interface PhishingStep {
  id: string;
  title: string;
  options: PhishingChoice[];
}
