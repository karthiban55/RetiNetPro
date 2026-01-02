import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, History, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { label: 'Patients', icon: Users, path: '/patients' },
        { label: 'History', icon: History, path: '/history' },
    ];

    return (
        <div className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-100 shadow-sm z-50 flex items-center justify-between px-6">
            {/* Brand */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                <div className="w-8 h-8 rounded-lg bg-medical-teal flex items-center justify-center text-white shadow-md">
                    <Activity size={18} strokeWidth={3} />
                </div>
                <div>
                    <h1 className="font-heading font-bold text-lg text-medical-dark leading-tight tracking-tight">RetiNet<span className="text-medical-teal opacity-80">Pro</span></h1>
                </div>
            </div>

            {/* Nav Items (Right Side) */}
            <nav className="flex items-center gap-1">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <div
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`relative flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-all duration-300 ${isActive
                                ? 'bg-medical-light text-medical-teal'
                                : 'text-gray-400 hover:text-medical-teal hover:bg-gray-50'
                                }`}
                        >
                            <item.icon size={16} />
                            <span className="font-bold text-xs uppercase tracking-wider">{item.label}</span>
                            {isActive && (
                                <motion.div
                                    layoutId="activeTabBot"
                                    className="absolute bottom-0 left-4 right-4 h-0.5 bg-medical-teal rounded-full"
                                />
                            )}
                        </div>
                    );
                })}

                {/* User Profile Mini (Far Right) */}
                <div className="h-8 w-[1px] bg-gray-200 mx-4" />

                <div className="flex items-center gap-3 pl-2">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-bold text-medical-dark">Karthi's AI Doctor</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Ophthalmology</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-medical-light border border-white shadow-sm flex items-center justify-center font-bold text-medical-teal text-xs">
                        DR
                    </div>
                </div>
            </nav>
        </div>
    );
}
