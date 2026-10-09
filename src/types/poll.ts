export interface PollOption {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  accentClass: string;
}

export interface VoteRecord {
  id: string;
  optionId: string;
  optionTitle: string;
  studentName: string;
  timestamp: number;
}

export interface OptionBreakdown {
  count: number;
  percentage: number;
  option: PollOption;
}

export interface PollState {
  question: string;
  options: PollOption[];
  totalVotes: number;
  breakdown: Record<string, OptionBreakdown>;
  topFriction: {
    option: PollOption;
    count: number;
    percentage: number;
  } | null;
  votes: VoteRecord[];
  lastResetAt: number;
}
