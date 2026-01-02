
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface MetricProps {
    title: string;
    value: string;
    description: string;
    icon: LucideIcon;
    trend?: string;
    color?: string; // tailwind class for text color e.g. "text-blue-500"
    delay?: number;
}

export default function MetricCard({ title, value, description, icon: Icon, trend, color = 'text-primary', delay = 0 }: MetricProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            whileHover={{ y: -5 }}
            className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group cursor-default"
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${color} bg-opacity-10 bg-current`}>
                    <Icon className={color} size={24} />
                </div>
                {trend && (
                    <span className="text-xs font-bold px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                        {trend}
                    </span>
                )}
            </div>

            <h3 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">{value}</h3>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1 mb-2">{title}</p>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">{description}</p>

            {/* Decorative background glow */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 ${color} opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity pointer-events-none`} />
        </motion.div>
    )
}
