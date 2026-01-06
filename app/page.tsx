import { FileUp } from "lucide-react";
import Navigation from "@/components/dashboard/Navigation";
import FilterGroup from "@/components/dashboard/filterGroup";

import GaugeChart from "@/components/dashboard/GaugeChart";
import TrendAccuracyChartMonthly from "@/components/dashboard/LineChartForecastMonthly";
import TrendAccuracyChartWeekly from "@/components/dashboard/LineChartForecastWeekly";
import ComparisonBarChart from "@/components/dashboard/BarChartComparison";
import PlantAchievementCard from "@/components/dashboard/PlantAchievementCard";
import AccuracyGrowthCard from "@/components/dashboard/AccuracyGrowthCard";

import DownloadButton from "@/components/dashboard/downloadButton";
import UploadButton from "@/components/dashboard/UploadButton";

// Import Service yang sudah kita buat
import { ForecastAccuracyService } from "@/services/forecastAccuracy";

export default async function ExecutiveSummary({
  searchParams,
}: {
  searchParams: Promise<any>;
}) {
  // 1. Ambil filter dari URL
  const params = await searchParams;
  const options = await ForecastAccuracyService.getFilterOptions();

  const selectedYear = params.year 
    ? Number(params.year)
    : options.year[0];

  // Ambil Plants (Multi Select): Konversi string "A,B" jadi ["A", "B"]
  const selectedPlants = params.plant 
    ? String(params.plant).split(",").filter((v) => v !== "") 
    : [];

  // Ambil Months (Multi Select): Konversi string "1,2" jadi [1, 2]
  const selectedMonths = params.month 
    ? String(params.month).split(",").map(Number).filter((n) => !isNaN(n)) 
    : [];    

  const selectedWeek = params.week ? Number(params.week) : undefined;

  const filters = {
    year: selectedYear, 
    months: selectedMonths,
    plants: selectedPlants,
  };

  
  let currentMonthForMoM: number;
  let prevMonthForMoM: number;
  let prevYearForMoM: number = selectedYear;

  if (filters.months && filters.months.length > 0) {
    // Ambil bulan terbesar yang dipilih user
    currentMonthForMoM = Math.max(...filters.months);
  } else {
    // Jika user tidak pilih bulan (All), gunakan bulan sekarang
    currentMonthForMoM = new Date().getMonth() + 1;
  }

  // Hitung mundur 1 bulan
  if (currentMonthForMoM === 1) {
    prevMonthForMoM = 12;
    prevYearForMoM = selectedYear - 1;
  } else {
    prevMonthForMoM = currentMonthForMoM - 1;
    prevYearForMoM = selectedYear;
  }

  // 2. Ambil data akurasi menggunakan Method baru (Raw Query)
  // Data sudah otomatis dikali 100 oleh service
  const [overallAcc, fishAcc, shrimpAcc, monthlyTrend, weeklyTrend, plantComparison, overallAccMoMCurrent, overallAccMoMPrev] = await Promise.all([
    ForecastAccuracyService.getOverallAccuracy(filters),
    ForecastAccuracyService.getFishAccuracy(filters),
    ForecastAccuracyService.getShrimpAccuracy(filters),
    ForecastAccuracyService.getMonthlyTrendData(filters),
    ForecastAccuracyService.getWeeklyTrendData({
        ...filters,
        week: selectedWeek
    }),
    ForecastAccuracyService.getPlantComparison({
        ...filters,
        week: selectedWeek
    }),
    ForecastAccuracyService.getOverallAccuracy({ 
        ...filters, 
        months: [currentMonthForMoM]
    }),
    ForecastAccuracyService.getOverallAccuracy({
        ...filters,
        months: [prevMonthForMoM],
        year: prevYearForMoM
    })
  ]);

  return (
    <main className="min-h-screen bg-slate-50">

      {/* HEADER SECTION */}
      <header className="bg-[#FF8C00] pt-4 pb-6 px-6 text-white shadow-lg">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-4 text-center lg:text-left">
            
            <div className="flex flex-col items-center lg:items-start gap-0">

              <div className="relative h-24 md:h-32 w-auto overflow-hidden flex-shrink-0">
                <img 
                  src="/image_png_1.PNG"
                  alt="Logo" 
                  className="h-full w-auto object-contain object-left opacity-20 scale-120"
                />
              </div>

              <div>
                <h1 className="text-2xl font-black tracking-tighter uppercase">
                  Monitoring Forecast Accuracy
                </h1>
                <p className="text-xs md:text-sm italic opacity-80 mt-1 text-orange-100">
                  Striving to achieve the best planning process
                </p>
              </div>
            </div>
            
            <div className="w-full lg:w-auto flex justify-center">
              <Navigation />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mt-4 pt-4 border-t border-white/20">

            <div className="flex flex-wrap justify-center lg:justify-start gap-2 order-2 lg:order-1">
               <FilterGroup options={options} />
            </div>
             
            <div className="flex flex-wrap justify-center lg:justify-end gap-3 order-1 lg:order-2">
              <DownloadButton />
              <UploadButton />
            </div>
                
          </div>
          
        </div>
      </header>

      {/* CONTENT SECTION (Executive Summary) */}
      <div className="max-w-7xl mx-auto px-8 py-10">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Menggunakan nilai asli dari Service yang sudah dikali 100 */}
          <GaugeChart title="Overall Accuracy" value={overallAcc} type="overall"/>
          <GaugeChart title="Fish Segment" value={fishAcc} type="fish"/>
          <GaugeChart title="Shrimp Segment" value={shrimpAcc} type="shrimp"/>
        </div>

        {/* BARIS 2: TREND CHART (Kiri) & 2 SUMMARY CARDS VERTICAL (Kanan) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 items-stretch">

          {/* Trend Chart mengambil 2/3 lebar (lg:col-span-2) */}
          <div className="lg:col-span-2">
            <TrendAccuracyChartMonthly data={monthlyTrend}/>
          </div>

          {/* 2 Summary Cards di-stack secara vertikal dalam 1 kolom sisanya */}
          {/* h-full dan flex-1 di sini penting agar tinggi card mengikuti tinggi chart di kiri */}
          <div className="flex flex-col gap-4 h-full">
            
            <div className="flex-1">
              {/* Nantinya ini diganti dengan komponen MoM Card */}
              <AccuracyGrowthCard 
                currentAccuracy={overallAccMoMCurrent} 
                previousAccuracy={overallAccMoMPrev} 
                currentMonth={currentMonthForMoM}
              />
            </div>

            <div className="flex-1">
              <PlantAchievementCard data={plantComparison} target={75} />
            </div>

          </div>

        </div>

        {/* BARIS 3: COMPARISON BAR CHART (Full Width di bawah) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <div className="lg:col-span-1">
            <TrendAccuracyChartWeekly 
              data={weeklyTrend} 
              currentMonth={currentMonthForMoM} 
            />
          </div>
          <div className="lg:col-span-2">
            <ComparisonBarChart data={plantComparison}/>
          </div>
        </div>   

      </div>

      <footer className="text-center text-xs text-slate-500 py-6 mt-10 border-t border-slate-200">
        © 2025 Digital Production | National Supply Chain
      </footer>      
    </main>
  );
}