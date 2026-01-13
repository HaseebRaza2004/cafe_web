export const metadata = {
  title: "Dashboard | Cafe Admin",
};

export default function Dashboard() {
  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-gray-400 text-sm mt-1">Welcome back, Admin</p>
        </div>
        <div className="text-right hidden md:block">
          <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-bold border border-green-500/20">
            SHOP OPEN
          </span>
        </div>
      </div>

      {/* Responsive Grid for Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value="Rs 0"
          change="+0%"
          color="text-[var(--color-gold)]"
        />
        <StatCard
          title="Total Orders"
          value="0"
          change="+0%"
          color="text-blue-400"
        />
        <StatCard
          title="Pending"
          value="0"
          change="Needs Action"
          color="text-orange-400"
        />
        <StatCard
          title="Items Active"
          value="0"
          change="In Menu"
          color="text-purple-400"
        />
      </div>

      {/* Placeholder for Charts/Tables */}
      <div className="w-full h-64 md:h-96 bg-[#111] border border-white/10 rounded-xl flex items-center justify-center text-gray-500 text-sm">
        Analytics Chart will appear here (Next Step)
      </div>
    </div>
  );
}

function StatCard({ title, value, change, color }) {
  return (
    <div className="p-5 md:p-6 rounded-xl bg-[#111] border border-white/5 hover:border-white/10 transition-all shadow-lg group">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
        {title}
      </h3>
      <div className="flex items-end justify-between">
        <p className={`text-2xl md:text-3xl font-bold ${color}`}>{value}</p>
        <span className="text-xs bg-white/5 px-2 py-1 rounded text-gray-400 group-hover:text-white transition-colors">
          {change}
        </span>
      </div>
    </div>
  );
}
