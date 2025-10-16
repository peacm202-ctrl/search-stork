export interface Stock {
  ticker: string;
  companyName: string;
  keyMetricLabel: string; // e.g., "P/E Ratio", "Recent Volume"
  keyMetricValue: string; // e.g., "18.5", "25M"
  analysis: string; // The analysis text
}
