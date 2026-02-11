import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Plus, Minus, Download, Zap, FolderOpen, MessageCircle, Code2, Info } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface PlanFeature {
    value: string;
    feature: {
        name: string;
        category: string;
    };
}

interface Plan {
    id: number;
    name: string;
    price: number;
    description: string;
    plan_features: PlanFeature[];
}

interface PricingCardProps {
    title: string;
    price: string | React.ReactNode;
    features: string[];
    isPopular?: boolean;
    buttonText: string;
    perText?: string;
    description?: string;
    bestValue?: string;
    onClick?: () => void;
}

const PricingCard: React.FC<PricingCardProps> = ({
    title, price, features, isPopular, buttonText, perText, description, bestValue, onClick
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`relative p-8 rounded-2xl border flex flex-col h-full min-h-[520px] transition-all duration-300 group shadow-lg
            ${isPopular
                ? 'border-blue-500/50 bg-gradient-to-b from-gray-900 via-blue-950/30 to-blue-900/60 hover:to-blue-900/80 shadow-[0_0_30px_rgba(59,130,246,0.15)] transform scale-[1.02] hover:scale-[1.03]'
                : title === 'Enterprise'
                    ? 'border-cyan-400/50 bg-gradient-to-br from-indigo-950 via-purple-900 to-cyan-900 hover:border-cyan-300/60 shadow-[0_0_25px_rgba(34,211,238,0.2)]'
                    : 'border-white/10 bg-black hover:border-zinc-700'
            }`}
    >
        {(isPopular || title === 'Enterprise') && (
            <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 text-xs font-bold rounded-full uppercase tracking-wider whitespace-nowrap shadow-lg
                ${isPopular
                    ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]'
                    : 'bg-cyan-900 text-cyan-300 border border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.5)]'
                }`}>
                {isPopular ? 'Most Popular' : 'Full Stack & Video Graphics'}
            </div>
        )}
        <h3 className={`text-lg font-medium mb-2 ${isPopular ? 'text-blue-400' : title === 'Enterprise' ? 'text-cyan-300' : 'text-zinc-400'}`}>{title}</h3>
        <div className="mb-6">
            <div className="flex items-baseline">
                {typeof price === 'string' ? <span className="text-4xl font-bold text-white">{price}</span> : price}
                {perText && <span className="text-zinc-500 text-sm ml-2">{perText}</span>}
            </div>
            {description && <div className="text-zinc-500 text-xs mt-2">{description}</div>}
            {bestValue && !isPopular && title !== 'Enterprise' && (
                <div className="mt-2 inline-block px-2 py-1 bg-blue-600/20 text-blue-400 text-xs font-semibold rounded-md border border-blue-500/30">
                    {bestValue}
                </div>
            )}
        </div>
        <ul className="space-y-4 mb-8 flex-grow">
            {features.map((feature, idx) => (
                <li key={idx} className="flex items-start text-sm text-zinc-300">
                    <Check className={`w-5 h-5 mr-3 flex-shrink-0 ${isPopular ? 'text-blue-400' : 'text-white'}`} />
                    <span>{feature}</span>
                </li>
            ))}
        </ul>
        <button
            onClick={onClick}
            className={`w-full py-3 rounded-full text-sm font-bold transition-all duration-300 
            ${isPopular
                    ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20 transform hover:scale-[1.02]'
                    : title === 'Enterprise'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-900/20 transform hover:scale-[1.02]'
                        : 'bg-zinc-800 text-white hover:bg-zinc-700 hover:text-white border border-zinc-700'
                }`}>
            {buttonText}
        </button>
    </motion.div>
);

const FaqItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-zinc-800">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
            >
                <span className="text-lg font-medium text-zinc-200 group-hover:text-white transition-colors">{question}</span>
                {isOpen ? <Minus className="w-5 h-5 text-zinc-400" /> : <Plus className="w-5 h-5 text-zinc-400" />}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-6 text-zinc-400 leading-relaxed text-sm sm:text-base">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const Pricing: React.FC = () => {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const { data, error } = await supabase
                    .from('plans')
                    .select(`
                        id, name, price, description,
                        plan_features (
                            value,
                            feature:features ( name, category )
                        )
                    `)
                    .order('price', { ascending: true });

                if (error) throw error;
                if (data) setPlans(data);
            } catch (error) {
                console.error('Error fetching plans:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);

    // Helper to get feature value for a specific plan
    const getFeatureValue = (plan: Plan, featureName: string) => {
        const feature = plan.plan_features.find(pf => pf.feature.name === featureName);
        return feature ? feature.value : '—';
    };

    // Helper to extract key bullets for the card based on description/features
    const getCardFeatures = (plan: Plan) => {
        if (plan.name === 'Starter') {
            return [
                "Pay per poster",
                "Basic Templates & Stock Access",
                "Email support"
            ];
        } else if (plan.name === 'Creator') {
            return [
                "Monthly posters included",
                "Advanced Templates & Stock Access",
                "Priority Email Support"
            ];
        } else { // Pro
            return [
                "Unlimited usage",
                "Priority AI Suggestions + Dedicated Support"
            ];
        }
    };

    // Dynamic Table Data Generator
    const generateTableData = () => {
        const allFeatures = new Map<string, string>(); // name -> category

        plans.forEach(plan => {
            plan.plan_features.forEach(pf => {
                if (pf.feature && pf.feature.name && pf.feature.category) {
                    allFeatures.set(pf.feature.name, pf.feature.category);
                }
            });
        });

        const featuresArray = Array.from(allFeatures.entries()).map(([name, category]) => ({ name, category }));

        const groupedFeatures: Record<string, string[]> = {};
        featuresArray.forEach(f => {
            if (!groupedFeatures[f.category]) {
                groupedFeatures[f.category] = [];
            }
            groupedFeatures[f.category].push(f.name);
        });

        return Object.entries(groupedFeatures).map(([category, rows]) => ({ category, rows }));
    };

    const tableData = generateTableData();

    if (loading) {
        return <div className="min-h-screen bg-black text-white pt-32 flex justify-center"><p>Loading plans...</p></div>;
    }

    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-20 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">

                {/* Block A: Title */}
                <div className="text-center mb-20">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6"
                    >
                        Pricing Plans
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto"
                    >
                        From pay-as-you-go to full-scale production.
                    </motion.p>
                </div>

                {/* Block B: Pricing Cards - Updated Grid for 4 items with gap-4 */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8 max-w-7xl mx-auto">
                    {plans.map((plan) => {
                        let price: string | React.ReactNode = `$${plan.price}`;
                        let perText = "/mo";
                        let buttonText = "Get Started →";
                        let description = "";
                        let bestValue = "";
                        let isPopular = false;
                        const onClick = () => { window.open('https://t.me/Hean_Lyhoeng', '_blank'); };

                        if (plan.name === 'Starter') {
                            price = "$9";
                            perText = "/poster";
                            buttonText = "Buy 1 Poster";
                            description = "";
                        } else if (plan.name === 'Creator') {
                            perText = "/mo";
                            buttonText = "Start Creator";
                            description = "or $990/year (Save 17%)";
                            isPopular = true;
                            bestValue = "Most Popular";
                        } else if (plan.name === 'Pro') {
                            perText = "/mo";
                            buttonText = "Get Pro";
                            description = "or $1,990/year (Save 17%)";
                        } else if (plan.name === 'Enterprise') {
                            price = (
                                <div className="flex items-baseline">
                                    <span className="text-3xl font-bold text-white">Custom Quote</span>
                                </div>
                            );
                            perText = "";
                            buttonText = "Book Tech Call";
                            description = "Tailored for high-end web & motion projects";
                        } else {
                            perText = "/mo";
                            buttonText = "Get Started";
                        }

                        return (
                            <PricingCard
                                key={plan.id}
                                title={plan.name}
                                price={price}
                                perText={perText}
                                description={description}
                                bestValue={bestValue}
                                features={getCardFeatures(plan)}
                                isPopular={isPopular}
                                buttonText={buttonText}
                                onClick={onClick}
                            />
                        );
                    })}
                </div>

                {/* --- COMPACT RISK-FREE BANNER --- */}
                <div className="mx-auto max-w-6xl mb-4">
                    <div className="col-span-1 md:col-span-3 w-full py-6 px-6 md:px-10 rounded-2xl border border-white/10 bg-gradient-to-r from-gray-900 via-gray-800 to-black relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg group">

                        {/* Glow Effect */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

                        {/* Text Content */}
                        <div className="relative z-10 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                                <span className="px-2 py-0.5 text-[10px] font-bold text-blue-300 bg-blue-900/30 rounded-full border border-blue-500/30 uppercase tracking-wide">New Clients Only</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white tracking-tight">
                                First Design on Us.
                            </h3>
                            <p className="text-gray-400 text-sm md:text-base mt-1 max-w-xl">
                                Not ready to commit? Get your first poster <span className="text-white font-medium">100% FREE</span>.
                            </p>
                        </div>

                        {/* Button Action */}
                        <div className="relative z-10 shrink-0">
                            <button
                                onClick={() => window.open('https://t.me/Hean_Lyhoeng', '_blank')}
                                className="bg-white text-black text-sm md:text-base font-bold px-6 py-3 rounded-full hover:bg-gray-200 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                            >
                                Claim Free Trial
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                            </button>
                        </div>

                    </div>
                </div>

                {/* --- OVERAGE TEXT --- */}
                <p className="text-center text-gray-500 text-xs md:text-sm mt-4 mb-16 max-w-2xl mx-auto">
                    Overage: Poster +$3–$4, Video +$7–$10. Up to 67% savings vs freelance rates in Cambodia.
                </p>

                {/* Block C: Detailed Comparison Table (Dynamic) */}
                <div className="mb-24">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Compare Plans</h2>
                        <p className="text-zinc-500">Full breakdown of features and limits.</p>
                    </div>

                    <div className="overflow-x-auto relative">
                        <div className="min-w-[900px] border border-zinc-800 rounded-2xl bg-black overflow-hidden">
                            {/* Table Header - Sticky */}
                            <div className="grid bg-black border-b border-zinc-800 sticky top-0 z-10 shadow-lg" style={{ gridTemplateColumns: `250px repeat(${plans.length}, minmax(0, 1fr))` }}>
                                <div className="p-6 text-left font-semibold text-zinc-300 bg-black">Feature</div>
                                {plans.map(plan => {
                                    let priceDisplay: React.ReactNode = `$${plan.price}/mo`;
                                    if (plan.name === 'Starter') priceDisplay = '$9/poster';
                                    if (plan.name === 'Enterprise') priceDisplay = (
                                        <span>
                                            Custom Quote
                                        </span>
                                    );

                                    return (
                                        <div key={plan.id} className="p-6 text-center font-bold text-lg text-white bg-black">
                                            {plan.name}<br />
                                            <span className="text-sm font-normal text-zinc-500">{priceDisplay}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Define categories and rows to render DYNAMICALLY */}
                            <div className="divide-y divide-zinc-800/50">
                                {tableData.length > 0 ? (
                                    tableData.map((section, idx) => (
                                        <React.Fragment key={idx}>
                                            <div className="bg-black px-6 py-4 text-sm font-bold text-white border-b border-zinc-800/50 sticky left-0">{section.category}</div>
                                            {section.rows.map((rowName, rIdx) => (
                                                <div key={rIdx} className="grid hover:bg-white/5 transition-colors odd:bg-transparent even:bg-white/[0.02]" style={{ gridTemplateColumns: `250px repeat(${plans.length}, minmax(0, 1fr))` }}>
                                                    <div className="p-4 px-6 text-sm text-zinc-300 flex items-center border-r border-zinc-800/30">{rowName}</div>
                                                    {plans.map(plan => {
                                                        const featureValue = getFeatureValue(plan, rowName);
                                                        const isCheck = featureValue.startsWith('✓') || featureValue.toLowerCase() === 'included' || featureValue.toLowerCase() === 'yes';
                                                        const isDash = featureValue === '—' || featureValue === '-' || featureValue === '';

                                                        return (
                                                            <div key={plan.id} className="p-4 text-center text-sm text-zinc-400 flex items-center justify-center border-r border-zinc-800/30 last:border-r-0">
                                                                {isCheck && (featureValue.length === 1 || featureValue.toLowerCase() === 'yes') ? <Check className="w-5 h-5 text-green-400" /> :
                                                                    isCheck ? <span className="text-white font-medium">{featureValue}</span> :
                                                                        isDash ? <span className="text-zinc-700">—</span> :
                                                                            <span className="text-zinc-300">{featureValue}</span>}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ))}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-zinc-500">No comparison data available yet.</div>
                                )}
                            </div>

                            {/* Bottom Buttons */}
                            <div className="grid bg-black p-6 border-t border-zinc-800" style={{ gridTemplateColumns: `250px repeat(${plans.length}, minmax(0, 1fr))` }}>
                                <div></div>
                                {plans.map(plan => (
                                    <div key={plan.id} className="px-2">
                                        <button
                                            onClick={() => window.open('https://t.me/Hean_Lyhoeng', '_blank')}
                                            className={`w-full py-2 rounded-lg text-sm transition-colors font-medium
                                            ${plan.name === 'Creator'
                                                    ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20'
                                                    : plan.name === 'Enterprise'
                                                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500'
                                                        : plan.name === 'Pro'
                                                            ? 'bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700'
                                                            : 'bg-black border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                                                }`}>
                                            {plan.name === 'Starter' ? 'Buy 1 Poster' : plan.name === 'Enterprise' ? 'Book Tech Call' : `Get ${plan.name}`}
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Footer Notes */}
                            <div className="p-6 text-center border-t border-zinc-800 bg-black">
                                <p className="text-xs text-zinc-500 mb-1">Pro Experts get free editor access on any client project.</p>
                                <p className="text-xs text-zinc-500">All prices are monthly and billed according to the selected cycle. Applicable taxes added at checkout.</p>
                            </div>

                        </div>
                    </div>
                </div>

                {/* --- FINE PRINT SECTION --- */}
                <div className="mt-8 p-6 rounded-2xl bg-white/[0.02] border border-white/5 max-w-3xl mx-auto">
                    <div className="flex items-start justify-center gap-3">
                        <Info className="w-4 h-4 text-zinc-500 mt-0.5 flex-shrink-0" />
                        <div className="text-zinc-500 text-xs md:text-sm text-center leading-relaxed">
                            <p className="mb-2">Pro Experts get free editor access on any client project.</p>
                            <p>All prices are monthly and billed according to the selected cycle. Applicable taxes added at checkout.</p>
                        </div>
                    </div>
                </div>

                {/* --- WHY CHOOSE US BENEFITS GRID --- */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-6xl mx-auto">
                    <div className="text-center p-4">
                        <div className="w-12 h-12 mx-auto bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                            <Zap className="w-6 h-6 text-blue-400" />
                        </div>
                        <h3 className="text-white font-bold mb-1">Super Fast</h3>
                        <p className="text-zinc-500 text-sm">24-48h turnaround for most designs.</p>
                    </div>
                    <div className="text-center p-4">
                        <div className="w-12 h-12 mx-auto bg-purple-500/10 rounded-full flex items-center justify-center mb-4">
                            <FolderOpen className="w-6 h-6 text-purple-400" />
                        </div>
                        <h3 className="text-white font-bold mb-1">Source Files</h3>
                        <p className="text-zinc-500 text-sm">Full ownership of AI, PSD, & Figma files.</p>
                    </div>
                    <div className="text-center p-4">
                        <div className="w-12 h-12 mx-auto bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                            <MessageCircle className="w-6 h-6 text-green-400" />
                        </div>
                        <h3 className="text-white font-bold mb-1">Direct Support</h3>
                        <p className="text-zinc-500 text-sm">Chat directly with your designer via Telegram.</p>
                    </div>
                    <div className="text-center p-4">
                        <div className="w-12 h-12 mx-auto bg-orange-500/10 rounded-full flex items-center justify-center mb-4">
                            <Code2 className="w-6 h-6 text-orange-400" />
                        </div>
                        <h3 className="text-white font-bold mb-1">Tech Enabled</h3>
                        <p className="text-zinc-500 text-sm">Full Stack Web Dev (React/Next.js) capabilities.</p>
                    </div>
                </div>



                {/* Block D: FAQ Section */}
                <div className="mb-32 max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
                    <div className="space-y-2">
                        <FaqItem
                            question="What is your design process?"
                            answer="My process is structured into four clear phases: Strategy (discovery, research, and goal-setting), UX Design (user flows, wireframes, and prototyping), UI Design (visual direction, branding, and high-fidelity mockups), and Delivery (handoff, launch, and post-launch support). This approach ensures every project is purposeful, user-centered, and visually refined from start to finish."
                        />
                        <FaqItem
                            question="How long does a typical project take?"
                            answer="Timelines are tailored to your needs and project scope. For most high-end websites, you can expect a 4–8 week turnaround. More complex platforms or AI-driven products may require additional time to ensure every detail meets the highest standards."
                        />
                        <FaqItem
                            question="Do you work with startups?"
                            answer="Absolutely. I love partnering with startups and fast-growing teams. My process is flexible—whether you need a lean MVP or a scalable design system, I adapt to your pace and help you grow with confidence."
                        />
                        <FaqItem
                            question="Can you design for AI-powered products?"
                            answer="Yes. I specialize in crafting intuitive interfaces for AI-driven tools—dashboards, chatbots, and data visualizations included. My focus is on making advanced technology accessible and engaging for real users, blending clarity with innovation."
                        />
                        <FaqItem
                            question="Do you provide ongoing support after launch?"
                            answer="Yes. After launch, I offer seamless handoff, documentation, and optional maintenance packages. Whether you need quick tweaks, new features, or design audits, I'm here to ensure your product continues to perform beautifully."
                        />
                        <FaqItem
                            question="Who owns the design copyrights once the project is finished?"
                            answer="You do. Upon project completion and final payment, you receive 100% ownership of all final design assets—no strings attached."
                        />
                    </div>
                </div>

                {/* Block E: Support & Success */}
                <div className="mb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Your success, supported</h2>
                        <p className="text-zinc-400 max-w-2xl mx-auto">Quick responses, thoughtful revisions, and flexible post-launch care built for modern teams.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800"
                        >
                            <Zap className="w-8 h-8 text-white mb-6" />
                            <h3 className="text-xl font-bold mb-3">24/7 Priority Response</h3>
                            <p className="text-zinc-400 text-sm">Urgent updates handled fast (priority requests completed within 24h).</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800"
                        >
                            <Download className="w-8 h-8 text-white mb-6" />
                            <h3 className="text-xl font-bold mb-3">Download Your Brand Kit</h3>
                            <p className="text-zinc-400 text-sm mb-6">Access all design assets in one click (fonts, color codes, social templates & more).</p>
                            <button className="text-sm font-semibold text-white border-b border-white pb-1 hover:opacity-80 transition-opacity">
                                Download Toolkit →
                            </button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800"
                        >
                            <Check className="w-8 h-8 text-white mb-6" />
                            <h3 className="text-xl font-bold mb-3">Post-Launch Tweaks</h3>
                            <ul className="space-y-2 mb-4">
                                {[
                                    "Adjust font sizes for mobile",
                                    "Swap hero visuals or video",
                                    "Align content spacing & margins",
                                    "Replace or update images",
                                    "Optimize for SEO basics"
                                ].map((item, i) => (
                                    <li key={i} className="text-xs text-zinc-400 flex items-center">
                                        <span className="w-1 h-1 bg-zinc-500 rounded-full mr-2"></span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <p className="text-xs text-zinc-500 italic">"We've got you covered with subtle updates & ongoing site maintenance."</p>
                        </motion.div>
                    </div>
                </div>

                {/* Block F: Final CTA */}
                <div className="text-center py-20 border-t border-zinc-900">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl sm:text-5xl font-bold mb-6">Get started with us.</h2>
                        <h3 className="text-2xl sm:text-3xl text-zinc-500 mb-4">Have a vision? Let's build it.</h3>
                        <p className="text-lg text-zinc-400 mb-10">Ready to transform your product? Let's work together.</p>
                        <button className="px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-zinc-200 transition-colors">
                            Get Started
                        </button>
                    </motion.div>
                </div>

            </div>
        </div >
    );
};
