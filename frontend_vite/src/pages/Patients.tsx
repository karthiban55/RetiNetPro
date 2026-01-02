import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Search, Filter } from 'lucide-react';

export default function Patients() {
    const [patients, setPatients] = useState<any[]>([]);

    useEffect(() => {
        fetch('http://localhost:8000/patients')
            .then(res => res.json())
            .then(data => setPatients(data))
            .catch(err => console.error("Error fetching patients:", err));
    }, []);

    return (
        <div className="flex min-h-screen bg-medical-cream font-sans text-medical-dark">
            <Navbar />

            <div className="flex-1 pt-24 p-12 overflow-y-auto min-h-screen">
                <div className="max-w-6xl mx-auto">
                    <header className="flex justify-between items-center mb-10">
                        <div>
                            <h1 className="text-3xl font-heading font-bold text-medical-teal tracking-tight mb-2">Patient Directory</h1>
                            <p className="text-sm opacity-60">Manage patient records and diagnostic history.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search Patients..."
                                    className="pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-medical-teal text-sm w-64"
                                />
                            </div>
                        </div>
                    </header>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex gap-4">
                            <button className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-medical-teal transition px-3 py-1 rounded-lg hover:bg-gray-50">
                                <Filter size={14} /> All Patients
                            </button>
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-medical-light/30 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold uppercase text-medical-teal opacity-70">Patient</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase text-medical-teal opacity-70">Mobile</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase text-medical-teal opacity-70">Scan Count</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase text-medical-teal opacity-70">Last Activity</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase text-medical-teal opacity-70">Latest Status</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase text-medical-teal opacity-70">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {patients.map((p) => (
                                    <tr key={p.id} className="hover:bg-medical-light/10 transition group cursor-pointer">
                                        <td className="px-6 py-4 font-bold text-sm text-medical-dark">
                                            {p.name}
                                            <span className="block text-[10px] text-gray-400 font-normal">{p.id}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-mono text-gray-500">{p.mobile}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{p.scanCount} Scans</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{new Date(p.lastScan).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${(p.status && p.status.includes("Normal")) ? 'bg-emerald-100 text-emerald-700' :
                                                (p.status && p.status.includes("Severe")) ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                {p.status || "Pending"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="text-gray-400 hover:text-medical-teal text-xs font-bold uppercase">View History</button>
                                        </td>
                                    </tr>
                                ))}
                                {patients.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center opacity-50 text-sm">
                                            No patients found. Create a profile and upload a scan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
