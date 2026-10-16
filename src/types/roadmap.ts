export type RoadmapPhase = 'planning' | 'legality' | 'operations' | 'marketing';

export interface RoadmapStep {
  id: string;
  phase: RoadmapPhase;
  title: string;
  description: string;
  educationalTip: string;
  actionUrl?: string; // Tautan ke panduan resmi (misal OSS untuk NIB)
  isCrucialForMicroBusiness: boolean;
}

export interface RoadmapProgressState {
  completedStepIds: string[];
  lastUpdated: string;
}

