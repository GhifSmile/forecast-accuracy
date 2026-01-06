import Navigation from "@/components/dashboard/Navigation";
import FilterGroup from "@/components/dashboard/filterGroup";
import UploadButton from "@/components/dashboard/UploadButton";
import DownloadButton from "@/components/dashboard/downloadButton";

import { ForecastAccuracyService } from "@/services/forecastAccuracy";

export default async function PerformanceDetailPage({
  searchParams,
}: {
  searchParams: Promise<any>;
}) {
  const params = await searchParams;
  const options = await ForecastAccuracyService.getFilterOptions();

  const selectedYear = params.year 
    ? Number(params.year.split(",")[0]) 
    : options.year[0];

  const filters = {
    year: selectedYear,
  };

  const performanceData = await ForecastAccuracyService.getMonthlyPerformance(filters);

  return (
    <main className="min-h-screen bg-slate-50">
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
                <FilterGroup options={options} showMonth={false} showPlant={false}/>
            </div>
            <div className="flex flex-wrap justify-center lg:justify-end gap-3 order-1 lg:order-2">
              <DownloadButton />
              <UploadButton />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
          <div className="overflow-x-auto text-slate-700">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="bg-[#00C9A7] text-white uppercase tracking-wider font-bold">
                  <th className="px-4 py-3 border-r border-white/10">Plant</th>
                  <th className="px-4 py-3 border-r border-white/10">Segment</th>
                  <th className="px-4 py-3 border-r border-white/10 text-center">Year</th>
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => (
                    <th key={m} className="px-2 py-3 border-r border-white/10 text-center">{m}</th>
                  ))}
                  <th className="px-4 py-3 border-r border-white/10 text-center">YTD Avg</th>
                  <th className="px-4 py-3 border-r border-white/10 text-center">VS Target</th>
                  <th className="px-4 py-3 border-r border-white/10 text-center">Status</th>
                  <th className="px-4 py-3">Action Needed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {performanceData.length > 0 ? (
                  performanceData.map((row, idx) => {
                    const vsT = row.vsTarget;
                    const vsTargetPercent = vsT;

                    let statusEmoji = "🔴";
                    let actionText = "Immediate Action";
                    let colorClass = "text-red-500";

                    if (vsT >= 0) {
                      statusEmoji = "🟢";
                      actionText = "-";
                      colorClass = "text-green-600";
                    } else if (vsT >= -20 && vsT < 0) { // Skala berubah karena sudah dikali 100
                      statusEmoji = "🟡";
                      actionText = "Review Forecast Model";
                      colorClass = "text-yellow-600";
                    }

                    return (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors odd:bg-white even:bg-slate-50/30">
                        <td className="px-4 py-3 font-bold text-slate-800">{row.plant}</td>
                        <td className="px-4 py-3 uppercase">{row.businessUnit}</td>
                        <td className="px-4 py-3 text-center">{row.year}</td>
                        {row.monthlyData.map((m, i) => (
                          <td key={i} className={`px-2 py-3 text-center ${m.value === 0 ? 'text-slate-300' : 'text-slate-700 font-medium'}`}>
                            {m.value > 0 ? `${(m.value).toFixed(2)}%` : "-"}
                          </td>
                        ))}
                        <td className="px-4 py-3 text-center font-bold">
                          {(row.ytdAvg).toFixed(2)}%
                        </td>
                        <td className={`px-4 py-3 text-center font-bold ${colorClass}`}>
                          {vsTargetPercent > 0 ? '+' : ''}{(vsTargetPercent).toFixed(2)}%
                        </td>
                        <td className="px-4 py-3 text-center text-lg leading-none">
                          {statusEmoji}
                        </td>
                        <td className={`px-4 py-3 italic ${vsT >= 0 ? 'text-slate-300' : 'font-medium ' + colorClass}`}>
                          {actionText}
                        </td>
                      </tr>
                    );
                  })
                ) : (
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