import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

// --- INTERFACES FOR DATABASE ROWS (Snake Case) ---
interface MonthlyPerformanceRow {
  plant: string | null;
  business_unit: string | null;
  year: number | null;
  jan: string | number | null;
  feb: string | number | null;
  mar: string | number | null;
  apr: string | number | null;
  may: string | number | null;
  jun: string | number | null;
  jul: string | number | null;
  aug: string | number | null;
  sep: string | number | null;
  oct: string | number | null;
  nov: string | number | null;
  dec: string | number | null;
  ytd_avg: string | number | null;
  vs_target: string | number | null;
}

interface TrendAnalysisRow {
  year: number | null;
  month: number | null;
  overall_accuracy: string | number | null;
  fish_accuracy: string | number | null;
  shrimp_accuracy: string | number | null;
  best_performing: string | null;
  worst_performing: string | null;
}

interface RawDataRow {
  code: string;
  forecast: number;
  sales: number;
  business_unit: string;
}

interface AccuracyFilters {
  year: number;
  month?: number;
  // week?: number;
  plant?: string;
}

// --- INTERFACES FOR UI (Camel Case) ---
export interface MonthlyPerformanceData {
  plant: string;
  businessUnit: string;
  year: number;
  monthlyData: { month: string; value: number }[];
  ytdAvg: number;
  vsTarget: number;
}

export interface TrendAnalysisData {
  year: number;
  month: string;
  overallAccuracy: number; // Ubah ke number agar sesuai interface Anda
  fishAccuracy: number;    // Ubah ke number agar sesuai interface Anda
  shrimpAccuracy: number;  // Ubah ke number agar sesuai interface Anda
  bestPerforming: string;
  worstPerforming: string;
}

// Helper
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

interface CodeSummary {
  sum_f: number;
  sum_s: number;
}

function calculateAccuracyByUnit(data: RawDataRow[], businessUnitFilter: string | null = null): number {
  if (!data || data.length === 0) return 0;

  let filteredData = data;
  if (businessUnitFilter && businessUnitFilter.trim().length > 0) {
    const filterKey = businessUnitFilter.toLowerCase();
    filteredData = data.filter(row => row.business_unit && row.business_unit.toLowerCase() === filterKey);
  }

  if (filteredData.length === 0) return 0.0;

  const summaryMap = new Map<string, CodeSummary>();

  for (const row of filteredData) {
    const key = row.code;
    const current = summaryMap.get(key) || { sum_f: 0, sum_s: 0 };
    current.sum_f += Number(row.forecast) || 0;
    current.sum_s += Number(row.sales) || 0;
    summaryMap.set(key, current);
  }

  const validErrors: number[] = [];
  for (const summary of summaryMap.values()) {
    const sum_f = summary.sum_f;
    const sum_s = summary.sum_s;
    let validErrorValue = 0;

    if (sum_f <= 0 || sum_s <= 0) {
      validErrorValue = 0.0;
    } else {
      const rawErrorRate = Math.abs(sum_f - sum_s) / sum_f;
      validErrorValue = rawErrorRate > 1.0 ? 0.0 : rawErrorRate;
    }

    if (validErrorValue > 0) {
      validErrors.push(validErrorValue);
    }
  }

  if (validErrors.length === 0) return 1.0;

  const totalValidError = validErrors.reduce((sum, error) => sum + error, 0);
  const avgValidError = totalValidError / validErrors.length;
  return 1.0 - avgValidError;
}

// --- SERVICE OBJECT ---
export const ForecastAccuracyService = {
  getMonthlyPerformance: async (year?: number): Promise<MonthlyPerformanceData[]> => {
    const targetYear = year || new Date().getFullYear();
    try {
      const result = await db.execute(sql`
        SELECT * FROM plant_performance_detail_monthly
        WHERE year = ${targetYear}
        ORDER BY plant ASC, business_unit ASC
      `);

      const rows = result as unknown as MonthlyPerformanceRow[];

      return rows.map((row) => ({
        plant: row.plant ?? "Unknown",
        businessUnit: row.business_unit ?? "N/A",
        year: Number(row.year) || targetYear,
        monthlyData: [
          { month: 'Jan', value: Number(row.jan) * 100 || 0 },
          { month: 'Feb', value: Number(row.feb) * 100 || 0 },
          { month: 'Mar', value: Number(row.mar) * 100 || 0 },
          { month: 'Apr', value: Number(row.apr) * 100 || 0 },
          { month: 'May', value: Number(row.may) * 100 || 0 },
          { month: 'Jun', value: Number(row.jun) * 100 || 0 },
          { month: 'Jul', value: Number(row.jul) * 100 || 0 },
          { month: 'Aug', value: Number(row.aug) * 100 || 0 },
          { month: 'Sep', value: Number(row.sep) * 100 || 0 },
          { month: 'Oct', value: Number(row.oct) * 100 || 0 },
          { month: 'Nov', value: Number(row.nov) * 100 || 0 },
          { month: 'Dec', value: Number(row.dec) * 100 || 0 },
        ],
        ytdAvg: Number(row.ytd_avg) * 100|| 0,
        vsTarget: Number(row.vs_target) * 100|| 0,
      }));
    } catch (error) {
      console.error("Error in getMonthlyPerformance:", error);
      return [];
    }
  },

  getTrendAnalysis: async (year?: number, month?: number): Promise<TrendAnalysisData[]> => {
    const targetYear = year || new Date().getFullYear();
    try {
      // Pastikan query tetap menggunakan sintaks yang benar untuk parameter opsional
      const monthCondition = month ? sql`AND month = ${month}` : sql``;

      const result = await db.execute(sql`
        SELECT 
          year,
          month, 
          overall_accuracy,
          fish_accuracy,
          shrimp_accuracy,
          best_performing,
          worst_performing
        FROM trend_analysis_monthly 
        WHERE year = ${targetYear}
        ${monthCondition}
        ORDER BY month ASC
      `);

      const rows = result as unknown as TrendAnalysisRow[];

      return rows.map((row) => ({
        year: Number(row.year) || targetYear,
        month: row.month ? monthNames[Number(row.month) - 1] : "Unknown",
        // Gunakan Number() untuk memastikan tipe data sesuai interface (number)
        overallAccuracy: Number(row.overall_accuracy) * 100 || 0,
        fishAccuracy: Number(row.fish_accuracy) * 100 || 0,
        shrimpAccuracy: Number(row.shrimp_accuracy) * 100 || 0,
        bestPerforming: row.best_performing ?? "-",
        worstPerforming: row.worst_performing ?? "-",
      }));
    } catch (error) {
      console.error("Error in getTrendAnalysis:", error);
      return [];
    }
  },

  getForecastAccuracyData: async (filters: AccuracyFilters): Promise<RawDataRow[]> => {
    try {
      const monthClause = filters.month ? sql`AND month = ${filters.month}` : sql``;
      // const weekClause = filters.week ? sql`AND week = ${filters.week}` : sql``;
      const plantClause = filters.plant ? sql`AND plant = ${filters.plant}` : sql``;

      const result = await db.execute(sql`
        SELECT code, forecast, sales, business_unit 
        FROM data_collection_forecast_accuracy
        WHERE year = ${filters.year}
        ${monthClause}
        ${plantClause}
      `);

      return result as unknown as RawDataRow[];
      
    } catch (error) {
      console.error("Error in getForecastAccuracyData:", error);
      return [];
    }
  },

  getOverallAccuracy: async (filters: AccuracyFilters): Promise<number> => {
    const data = await ForecastAccuracyService.getForecastAccuracyData(filters);
    return calculateAccuracyByUnit(data, null) * 100;
  },

  getFishAccuracy: async (filters: AccuracyFilters): Promise<number> => {
    const data = await ForecastAccuracyService.getForecastAccuracyData(filters);
    return calculateAccuracyByUnit(data, 'fish') * 100;
  },

  getShrimpAccuracy: async (filters: AccuracyFilters): Promise<number> => {
    const data = await ForecastAccuracyService.getForecastAccuracyData(filters);
    return calculateAccuracyByUnit(data, 'shrimp') * 100;
  }  

};