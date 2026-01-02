import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Download, Search } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// export default function History() {
//    const navigate = useNavigate();
export default function History() {
    const [scans, setScans] = useState<any[]>([]);

    useEffect(() => {
        fetch('http://localhost:8000/history')
            .then(res => res.json())
            .then(data => setScans(data))
            .catch(err => console.error("History fetch error:", err));
    }, []);

    return (
        <div className="flex min-h-screen bg-medical-cream font-sans text-medical-dark">
            <Navbar />

            <div className="flex-1 pt-24 p-12 overflow-y-auto min-h-screen">
                <div className="max-w-6xl mx-auto">
                    <header className="flex justify-between items-center mb-10">
                        <div>
                            <h1 className="text-3xl font-heading font-bold text-medical-teal tracking-tight mb-2">Patient Records</h1>
                            <p className="text-sm opacity-60">Archive of all retinal analyses performed.</p>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search Patient ID..."
                                className="pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-medical-teal text-sm w-64"
                            />
                        </div>
                    </header>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-medical-light/30 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold uppercase text-medical-teal opacity-70">Scan Ref</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase text-medical-teal opacity-70">Date</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase text-medical-teal opacity-70">Patient</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase text-medical-teal opacity-70">Diagnosis</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase text-medical-teal opacity-70">Confidence</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase text-medical-teal opacity-70">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {scans.map((scan) => (
                                    <tr key={scan._id} className="hover:bg-medical-light/10 transition group">
                                        <td className="px-6 py-4">
                                            <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                                                <img src={scan.file_url} className="w-full h-full object-cover" alt="Retina" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium">
                                            {new Date(scan.timestamp).toLocaleDateString()}
                                            <span className="block text-xs opacity-40">{new Date(scan.timestamp).toLocaleTimeString()}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold">{scan.patient_id}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${scan.dr_grade === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                                }`}>
                                                {scan.diagnosis}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-mono">
                                            {(scan.confidence * 100).toFixed(1)}%
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => window.open(`http://localhost:8000/report/${scan._id}`, '_blank')}
                                                className="text-medical-teal hover:underline text-xs font-bold flex items-center gap-1"
                                            >
                                                <Download size={14} /> Report
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {scans.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center opacity-50 text-sm">
                                            No records found in database. Upload a scan to begin.
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
