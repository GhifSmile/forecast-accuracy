import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, Target, Activity } from "lucide-react";
import GaugeChart from "@/components/dashboard/GaugeChart"; // Pastikan pathnya sesuai

export default function DashboardPage() {
  return (
    // Background utama abu-abu muda (slate-50)
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Forecast Analytics
          </h1>
          <p className="text-sm text-slate-500">
            Real-time accuracy monitoring dashboard.
          </p>
        </div>

        {/* TOP SECTION: 3 Card Putih Bersih */}
        {/* <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-white border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-600">Total Records</CardTitle>
              <LayoutDashboard className="h-4 w-4 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">2,540</div>
              <p className="text-xs text-slate-500 mt-1">Updated just now</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-600">Average Precision</CardTitle>
              <Target className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">82.4%</div>
              <p className="text-xs text-emerald-600 font-medium mt-1">Above target</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-600">Active Models</CardTitle>
              <Activity className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">08</div>
              <p className="text-xs text-slate-500 mt-1">Running smoothly</p>
            </CardContent>
          </Card>
        </div> */}

        {/* MIDDLE SECTION: Gauge Charts */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GaugeChart title="Accuracy Level" value={85} />
          <GaugeChart title="Model Score" value={70} />
          <GaugeChart title="Data Quality" value={92} />
        </div>

        {/* Anda bisa menambah section tabel di sini nanti */}
        
      </div>
    </main>
  );
}