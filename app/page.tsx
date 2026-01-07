import { FileUp } from "lucide-react";
import Navigation from "@/components/dashboard/Navigation";
import GaugeChart from "@/components/dashboard/GaugeChart";
import TrendAccuracyChart from "@/components/dashboard/LineChartForecast";
import ComparisonBarChart from "@/components/dashboard/BarChartComparison";
import UploadButton from "@/components/dashboard/UploadButton";

// Import Service yang sudah kita buat
import { ForecastAccuracyService } from "@/services/forecastAccuracy";

export default async function ExecutiveSummary({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string; plant?: string }>;
}) {
  // 1. Ambil filter dari URL
  const params = await searchParams;
  const currentYear = new Date().getFullYear();
  
  const filters = {
    year: params.year ? parseInt(params.year) : currentYear,
    month: params.month ? parseInt(params.month) : undefined,
    plant: params.plant || undefined,
  };

  // 2. Ambil data akurasi menggunakan Method baru (Raw Query)
  // Data sudah otomatis dikali 100 oleh service
  const [overallAcc, fishAcc, shrimpAcc, monthlyTrend, plantComparison] = await Promise.all([
    ForecastAccuracyService.getOverallAccuracy(filters),
    ForecastAccuracyService.getFishAccuracy(filters),
    ForecastAccuracyService.getShrimpAccuracy(filters),
    ForecastAccuracyService.getMonthlyTrendData(filters), // Mengambil tren 12 bulan
    ForecastAccuracyService.getPlantComparison(filters), // Mengambil perbandingan plant
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
                  className="h-full w-auto object-contain object-left opacity-20 scale-120" // Opacity 70% dan object-contain agar proporsi terjaga
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
               {/* Label dinamis berdasarkan filter */}
               {[
                 { label: "Plant:", value: filters.plant || "All" },
                 { label: "Year:", value: filters.year },
                 { label: "Month:", value: filters.month || "All" }
               ].map((item) => (
                 <div key={item.label} className="w-32 bg-white text-slate-700 px-3 py-1.5 rounded-md text-xs font-bold shadow-md flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-all">
                   <span>{item.label} {item.value}</span>
                   <span className="text-[10px] opacity-40">▼</span>
                 </div>
               ))}
            </div>
             
            <div className="flex justify-center lg:justify-end order-1 lg:order-2">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Anda bisa meneruskan filter ke chart jika diperlukan nantinya */}
          <TrendAccuracyChart data={monthlyTrend}/>
          <ComparisonBarChart data={plantComparison}/>
        </div>

      </div>

      <footer className="text-center text-xs text-slate-500 py-6 mt-10 border-t border-slate-200">
        © 2025 Digital Production | National Supply Chain
      </footer>      
    </main>
  );
}
