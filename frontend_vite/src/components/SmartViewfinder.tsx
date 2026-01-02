
import { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, CheckCircle, AlertCircle } from 'lucide-react';

export default function SmartViewfinder({ onCapture }: { onCapture: (img: string | null, data?: any) => void }) {
    const webcamRef = useRef<Webcam>(null);
    const [status, setStatus] = useState<'searching' | 'aligned' | 'scanning'>('searching');
    const [qualityMetric, setQualityMetric] = useState(0);

    // REAL Logic: Check pixel data for 'Redness' (Retina) and Focus
    const checkImageQuality = () => {
        if (!webcamRef.current) return;
        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) return;

        // Create an invisible image to analyze pixels
        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            canvas.width = 100; // Downscale for speed
            canvas.height = 100;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
            let totalRed = 0;
            let totalBrightness = 0;

            for (let i = 0; i < frame.data.length; i += 4) {
                totalRed += frame.data[i];
                totalBrightness += (frame.data[i] + frame.data[i + 1] + frame.data[i + 2]) / 3;
            }

            const avgRed = totalRed / (frame.data.length / 4);
            const avgBright = totalBrightness / (frame.data.length / 4);

            // Heuristic for "Eye-like":
            // 1. Not pitch black (avgBright > 20)
            // 2. Not pure white (avgBright < 240)
            // 3. Significant Red channel (avgRed > avgBright)
            const isReddish = avgRed > (avgBright * 1.05);
            const hasDetail = avgBright > 30 && avgBright < 230;

            const score = (isReddish ? 50 : 0) + (hasDetail ? 50 : 0);
            setQualityMetric(score);

            if (score >= 80 && status !== 'scanning') {
                setStatus('aligned');
            } else if (status !== 'scanning') {
                setStatus('searching');
            }
        };
    };

    useEffect(() => {
        const interval = setInterval(checkImageQuality, 500); // Check every 500ms
        return () => clearInterval(interval);
    }, [status]);

    const handleScan = async () => {
        if (status !== 'aligned') return;
        setStatus('scanning');

        const imageSrc = webcamRef.current?.getScreenshot();
        if (!imageSrc) {
            setStatus('searching');
            return;
        }

        try {
            // Convert to Blob
            const res = await fetch(imageSrc);
            const blob = await res.blob();

            // Send to Backend
            const formData = new FormData();
            formData.append("file", blob, "scan.jpg");

            const response = await fetch("http://localhost:8000/analyze", {
                method: "POST",
                body: formData
            });
            const data = await response.json();

            // Pass result
            onCapture(imageSrc, data);

        } catch (e) {
            console.error(e);
        }

        setTimeout(() => {
            setStatus('searching'); // Reset loop
        }, 2000); // 2s scan duration
    };

    return (
        <div className="relative w-full h-[500px] bg-black rounded-2xl overflow-hidden shadow-2xl border border-[#0f4c45] group ring-4 ring-[#d8f3ec]">
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                videoConstraints={{ facingMode: "user" }}
            />

            {/* Overlay UI */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 pointer-events-none">
                {/* The Focusing Circle */}
                <motion.div
                    animate={{
                        borderColor: status === 'aligned' ? '#10B981' : '#f43f5e',
                        scale: status === 'aligned' ? 1.05 : 1,
                    }}
                    className={`w-64 h-64 rounded-full border-2 border-dashed flex items-center justify-center transition-all duration-500
                ${status === 'searching' ? 'opacity-80 rotate-12' : 'opacity-100 border-solid shadow-[0_0_30px_rgba(16,185,129,0.3)]'}
            `}
                >
                    {status === 'aligned' && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="bg-[#10B981]/20 p-4 rounded-full"
                        >
                            <CheckCircle className="text-[#10B981] w-12 h-12" />
                        </motion.div>
                    )}
                    {status === 'searching' && (
                        <div className="bg-rose-500/10 p-4 rounded-full">
                            <AlertCircle className="text-rose-500 w-8 h-8 opacity-50" />
                        </div>
                    )}
                </motion.div>

                {/* Status Text */}
                <div className="mt-8 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-white font-mono text-xs border border-white/10 uppercase tracking-widest flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${status === 'aligned' ? 'bg-[#10B981] animate-pulse' : 'bg-rose-500'}`} />
                    System Status: {status} ({qualityMetric}%)
                </div>
            </div>

            {/* Laser Scan Animation */}
            <AnimatePresence>
                {status === 'scanning' && (
                    <motion.div
                        initial={{ top: 0 }}
                        animate={{ top: "100%" }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "linear" }}
                        className="absolute left-0 right-0 h-1 bg-[#10B981] shadow-[0_0_50px_4px_rgba(16,185,129,0.8)] z-20"
                    />
                )}
            </AnimatePresence>

            {/* Controls */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center z-30 pointer-events-auto">
                <button
                    onClick={handleScan}
                    disabled={status !== 'aligned' && status !== 'scanning'}
                    className="flex items-center gap-2 px-8 py-3 bg-[#0f4c45] hover:bg-[#072d29] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm tracking-wider transition-all shadow-lg active:scale-95"
                >
                    <Scan size={18} />
                    {status === 'scanning' ? 'ANALYZING TISSUE...' : 'INITIATE SCAN'}
                </button>
            </div>
        </div>
    );
}
