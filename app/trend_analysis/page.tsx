import { ForecastAccuracyService } from "@/services/forecastAccuracy";
import Navigation from "@/components/dashboard/Navigation";
import UploadButton from "@/components/dashboard/UploadButton";

export default async function TrendAnalysis({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string }>;
}) {
  // 1. Ambil filter dari URL (Server Side)
  const params = await searchParams;
  const currentYear = new Date().getFullYear();
  const selectedYear = params.year ? parseInt(params.year) : currentYear;
  const selectedMonth = params.month ? parseInt(params.month) : undefined;

  // 2. Tarik data dari Service menggunakan Raw Query ke View
  const trendData = await ForecastAccuracyService.getTrendAnalysis(selectedYear, selectedMonth);

  return (
    <main className="min-h-screen bg-slate-50">

      {/* HEADER SECTION */}
      <header className="bg-[#FF8C00] pt-4 pb-6 px-6 text-white shadow-lg">
        <div className="max-w-7xl mx-auto">
          
          {/* Baris Atas: Logo, Judul, dan Navigasi */}
          <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-4 text-center lg:text-left">
            
            <div className="flex flex-col items-center lg:items-start gap-3">
              <div className="relative w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center border border-white/30 overflow-hidden flex-shrink-0">
                <div className="text-[10px] opacity-50 text-center px-1">Image Area</div>
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

            {/* Filter Group */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 order-2 lg:order-1">
               <div className="w-32 bg-white text-slate-700 px-3 py-1.5 rounded-md text-xs font-bold shadow-md flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-all active:scale-95">
                 <span>Year: {selectedYear}</span>
                 <span className="text-[10px] opacity-40">▼</span>
               </div>
               <div className="w-32 bg-white text-slate-700 px-3 py-1.5 rounded-md text-xs font-bold shadow-md flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-all active:scale-95">
                 <span>Month: {selectedMonth}</span>
                 <span className="text-[10px] opacity-40">▼</span>
               </div>
            </div>
             
            {/* Tombol Tambah Data */}
            <div className="flex justify-center lg:justify-end order-1 lg:order-2">
              <UploadButton />
            </div>
                
          </div>
          
        </div>
      </header>

      {/* CONTENT SECTION - Tabel Trend Analysis */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
          <div className="overflow-x-auto text-slate-700">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="bg-[#00C9A7] text-white uppercase tracking-wider font-bold">
                  <th className="px-4 py-3 border-r border-white/10">Year</th>
                  <th className="px-4 py-3 border-r border-white/10">Month</th>
                  <th className="px-4 py-3 border-r border-white/10 text-center">Overall Accuracy</th>
                  <th className="px-4 py-3 border-r border-white/10 text-center">Fish Accuracy</th>
                  <th className="px-4 py-3 border-r border-white/10 text-center">Shrimp Accuracy</th>
                  <th className="px-4 py-3 border-r border-white/10 text-center">Best Performing Plant</th>
                  <th className="px-4 py-3 text-center">Worst Performing Plant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {trendData.length > 0 ? (
                  trendData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors odd:bg-white even:bg-slate-50/30">
                      <td className="px-4 py-3 border-r border-slate-100">{row.year}</td>
                      <td className="px-4 py-3 border-r border-slate-100 font-medium">{row.month}</td>
                      <td className="px-4 py-3 border-r border-slate-100 text-center font-bold">
                          {row.overallAccuracy.toFixed(2)}%
                      </td>
                      <td className="px-4 py-3 border-r border-slate-100 text-center">
                          {row.fishAccuracy.toFixed(2)}%
                      </td>
                      <td className="px-4 py-3 border-r border-slate-100 text-center">
                          {row.shrimpAccuracy.toFixed(2)}%
                      </td>
                      <td className="px-4 py-3 border-r border-slate-100 text-center font-semibold text-teal-600">
                          {row.bestPerforming}
                      </td>
                      <td className="px-4 py-3 text-center font-semibold text-red-600">
                          {row.worstPerforming}
                      </td>
                    </tr>
                  ))
                ) : (
                  /* Logic Empty State seragam dengan Performance Detail */
                  <tr>
                    <td colSpan={18} className="py-20 text-center text-slate-400 italic bg-white">
                      No data found for the year the selected period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <footer className="text-center text-xs text-slate-500 py-6 mt-10 border-t border-slate-200">
        © 2025 Digital Production | National Supply Chain
      </footer> 
    </main>
  );
}