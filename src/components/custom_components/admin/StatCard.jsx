export default function StatCard({ title, value, icon: Icon, color, bg }) {
    return (
        <div className="bg-black/40 border border-white/10 p-6 rounded-xl backdrop-blur-md flex items-center justify-between hover:border-gold/30 transition-all">
            <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                    {title}
                </p>
                <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
            </div>
            <div className={`p-3 rounded-lg ${bg} ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
    );
}