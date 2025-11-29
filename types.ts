export interface UserProfile {
  age: string;
  gender: 'male' | 'female' | 'other' | '';
  healthContext: string;
}

export interface RecommendedProduct {
  name: string;
  reason: string;
}

export interface AnalysisResult {
  summary: string;
  pros: string[];
  cons: string[];
  recommendations: RecommendedProduct[];
}

export interface ScanHistoryItem {
  id: string;
  timestamp: number;
  result: AnalysisResult;
  imagePreviewUrl?: string; // Storing base64 thumbnail if possible, or just keeping logic simple
}

export enum AppState {
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
}