import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">

            {/* 1. Header (Solid Green) */}
            <header className="bg-emerald-800 px-8 py-6 text-white sticky top-0 z-50 shadow-md">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-wide text-white" style={{ fontFamily: 'Playfair Display' }}>
                            RetiNet<span className="font-light opacity-80">Pro</span>
                        </h1>
                        <p className="text-[10px] uppercase tracking-[0.2em] opacity-80 font-bold">AI Diagnostic Suite</p>
                    </div>

                    <nav className="hidden md:flex gap-8 text-sm font-bold tracking-wide">
                        <a href="#" className="hover:text-emerald-200 transition">About</a>
                        <a href="#" className="hover:text-emerald-200 transition">Services</a>
                        <a href="#" className="hover:text-emerald-200 transition">Insurance</a>
                        <a href="#" className="hover:text-emerald-200 transition">Contact</a>
                    </nav>

                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 px-6 py-2 bg-white text-emerald-900 rounded-full hover:bg-emerald-100 transition-all text-sm font-bold uppercase tracking-wider shadow-sm"
                    >
                        Log In <ArrowRight size={14} />
                    </button>
                </div>
            </header>

            {/* 2. Hero Section (Clean White with Dark Green Text) */}
            <section className="relative w-full bg-white">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 h-[85vh] items-center">

                    {/* Text Side - HIGH CONTRAST */}
                    <div className="p-8 lg:p-16 z-10">
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider mb-6"
                        >
                            Reliable & Accessible to All
                        </motion.span>

                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl lg:text-7xl font-bold mb-6 leading-tight text-emerald-950"
                        >
                            Medical AI <br />
                            <span className="text-emerald-600">Services</span>
                        </motion.h1>

                        <p className="text-lg text-slate-600 mb-10 max-w-md leading-relaxed font-medium">
                            Professional retinal diagnostics powered by Computer Vision.
                            Instant analysis for <strong className="text-emerald-800">Diabetic Retinopathy</strong>, Glaucoma, and Systemic Health markers.
                        </p>

                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-8 py-4 bg-emerald-700 text-white text-sm font-bold uppercase tracking-widest hover:bg-emerald-800 transition-colors shadow-lg rounded-lg"
                        >
                            Launch Diagnostics
                        </button>
                    </div>

                    {/* Image Side (Right) */}
                    <div className="h-full w-full hidden lg:block relative p-10">
                        <div className="absolute inset-0 bg-emerald-50 rounded-l-[3rem]"></div>
                        {/* Placeholder for Medical Image */}
                        <div className="relative z-10 h-full w-full bg-[url('https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center rounded-[2rem] shadow-2xl opacity-90"></div>
                    </div>
                </div>
            </section>

            {/* 3. Features Section (Replaces Diagnostic Pipeline) */}
            <section className="bg-emerald-900 py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <h2 className="text-2xl lg:text-3xl text-white font-bold mb-6 leading-relaxed">
                            "This project moves medical testing from a lab into a simple, non-invasive photo."
                        </h2>
                        <div className="w-20 h-1 bg-emerald-400 mx-auto"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white p-8 rounded-xl hover:-translate-y-2 transition-transform duration-300 cursor-pointer shadow-lg border-b-4 border-emerald-500">
                            <h3 className="text-lg text-emerald-900 font-bold uppercase tracking-wide mb-4">Pain-Free Screening</h3>
                            <p className="text-slate-600 text-sm font-medium leading-relaxed">
                                Instead of a needle for a blood test or a treadmill for a heart test, the AI provides a "pre-check" just by looking at an image.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white p-8 rounded-xl hover:-translate-y-2 transition-transform duration-300 cursor-pointer shadow-lg border-b-4 border-emerald-500">
                            <h3 className="text-lg text-emerald-900 font-bold uppercase tracking-wide mb-4">Early Warning System</h3>
                            <p className="text-slate-600 text-sm font-medium leading-relaxed">
                                Diseases like diabetes and hypertension often show their first "scars" in the eye years before a patient feels sick. Early detection can reduce the risk of permanent vision loss by up to 98%.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white p-8 rounded-xl hover:-translate-y-2 transition-transform duration-300 cursor-pointer shadow-lg border-b-4 border-emerald-500">
                            <h3 className="text-lg text-emerald-900 font-bold uppercase tracking-wide mb-4">Scalability</h3>
                            <p className="text-slate-600 text-sm font-medium leading-relaxed">
                                This system can be deployed in rural areas or clinics that don't have expensive equipment, allowing millions of people to be screened quickly and cheaply.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Detailed Analysis Explanations */}
            <section className="bg-medical-light/30 py-24 px-6 relative overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    <div>
                        <h5 className="text-medical-teal font-bold uppercase tracking-widest text-xs mb-4">Advanced Diagnostics</h5>
                        <h2 className="text-4xl font-heading font-bold text-medical-dark mb-6 leading-tight">
                            Decoding the <br /><span className="text-emerald-600">Retinal Biomarkers.</span>
                        </h2>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">For Diabetic Retinopathy (DR)</h3>
                                <p className="text-slate-600 leading-relaxed font-medium">
                                    The AI scans for "red lesions" like micro-bleeds or leaky vessels. It compares these patterns against a massive database (like the 3,500+ cases mentioned in your UI) to see if they match known signs of disease.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">For Cardiovascular Risk</h3>
                                <p className="text-slate-600 leading-relaxed font-medium">
                                    It measures the Arteriolar-Venular Ratio (AVR)—the thickness of your arteries compared to your veins. If the arteries are too narrow compared to the veins, it's a strong mathematical signal of high blood pressure or heart risk.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">For Biological Age</h3>
                                <p className="text-slate-600 leading-relaxed font-medium">
                                    It calculates a "Retinal Age Gap". Your eye’s vessels age along with your heart, brain, and kidneys. If the AI sees that your eye vessels look 50 years old but you are actually 40, it identifies a "Gap," which means your body is aging faster than the calendar says.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="relative h-full min-h-[500px] rounded-2xl overflow-hidden shadow-2xl bg-slate-900">
                        {/* Abstract Visual Representation */}
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center opacity-60"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

                        <div className="relative z-10 p-10 flex flex-col justify-end h-full">
                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
                                <h4 className="text-white font-bold text-lg mb-2">Precision Medicine</h4>
                                <p className="text-slate-300 text-sm">
                                    Our models analyze pixel-level texture variations invisible to the human eye, providing a granular assessment of systemic health.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-medical-dark text-white/40 py-12 text-center text-xs tracking-widest uppercase">
                <p>&copy; 2025 RetiNet Pro Systems. All Rights Reserved.</p>
            </footer>
        </div>
    );
}
