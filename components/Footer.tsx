import React from 'react';
import { Hexagon } from 'lucide-react';

// Simple SVG Social Icons
const SocialIcon = ({ path }: { path: string }) => (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
        <path d={path} />
    </svg>
);

const facebookPath = "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z";
const telegramPath = "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 11.944 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z";
const youtubePath = "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .5 6.186C0 8.07 0 12 0 12s0 3.93.5 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.5-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z";

export const Footer: React.FC = () => {
    const handleContactClick = (e: React.MouseEvent) => {
        e.preventDefault();
        const isHomePage = window.location.hash === '' || window.location.hash === '#/';

        if (isHomePage) {
            const element = document.querySelector('#contact');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            window.location.hash = '';
            setTimeout(() => {
                const element = document.querySelector('#contact');
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 300);
        }
    };

    const productLinks = [
        { name: 'Graphic Design', href: '#/services/graphic-design' },
        { name: 'Video Editing', href: '#/services/video-editing' },
        { name: 'Web Development', href: '#/services/web-dev' },
        { name: 'Motion Graphics', href: '#/services/motion' },
    ];

    const companyLinks = [
        { name: 'About Me', href: '#/about' },
        { name: 'Portfolio', href: '#/work' },
        { name: 'Pricing', href: '#/pricing' },
        { name: 'Contact', href: '#contact' },
    ];

    const legalLinks = [
        { name: 'Privacy Policy', href: '#' },
        { name: 'Terms of Service', href: '#' },
    ];

    return (
        <footer id="contact" className="bg-black border-t border-white/10 pt-12 md:pt-16 pb-6 md:pb-8 overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8 mb-10 md:mb-12">

                    {/* Brand Column - full width on mobile, 2 cols on lg+ */}
                    <div className="sm:col-span-2 lg:col-span-2">
                        <a href="#" className="flex items-center gap-3 group mb-4">
                            <img
                                src="https://jqszlmcwearhovsjknat.supabase.co/storage/v1/object/public/avatars/freepik__a-white-abstract-cube-logo-is-centered-on-a-black-__84990.png"
                                alt="LYHOENG-DESIGN Logo"
                                className="w-9 h-9 md:w-10 md:h-10 object-contain rounded-md flex-shrink-0"
                                loading="lazy"
                                decoding="async"
                            />
                            <span className="text-lg md:text-xl font-bold tracking-wider font-mono text-white break-words">
                                LYHOENG-DESIGN
                            </span>
                        </a>
                        <h2 className="sr-only">LYHOENG-DESIGN</h2>
                        <p className="text-gray-400 text-sm md:text-base max-w-xs mb-4 md:mb-6 leading-relaxed">
                            Crafting interfaces that are not only visually stunning but also intuitive and accessible.
                        </p>
                        {/* Social Icons */}
                        <div className="flex gap-4">
                            <a href="https://web.facebook.com/lyhoeng.hean" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#1877F2] transition-colors"><SocialIcon path={facebookPath} /></a>
                            <a href="https://t.me/Hean_Lyhoeng" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#0088cc] transition-colors"><SocialIcon path={telegramPath} /></a>
                            <a href="https://www.youtube.com/@T3MovieUniverse" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#FF0000] transition-colors"><SocialIcon path={youtubePath} /></a>
                            <a href="https://github.com/HeanLyhoeng?tab=repositories" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Product Column */}
                    <div>
                        <h3 className="text-white font-semibold text-sm md:text-base mb-3 md:mb-4">Services</h3>
                        <ul className="space-y-2 md:space-y-3">
                            {productLinks.map((item) => (
                                <li key={item.name}>
                                    <a href={item.href} className="text-zinc-400 hover:text-white text-sm md:text-base transition-colors block py-1">
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h3 className="text-white font-semibold text-sm md:text-base mb-3 md:mb-4">Company</h3>
                        <ul className="space-y-2 md:space-y-3">
                            {companyLinks.map((item) => (
                                <li key={item.name}>
                                    <a
                                        href={item.href}
                                        onClick={item.name === 'Contact' ? handleContactClick : undefined}
                                        className="text-zinc-400 hover:text-white text-sm md:text-base transition-colors block py-1.5"
                                    >
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Column */}
                    <div>
                        <h3 className="text-white font-semibold text-sm md:text-base mb-3 md:mb-4">Legal</h3>
                        <ul className="space-y-2 md:space-y-3">
                            {legalLinks.map((item) => (
                                <li key={item.name}>
                                    <a href={item.href} className="text-zinc-400 hover:text-white text-sm md:text-base transition-colors block py-1">
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 text-center md:text-left">
                    <p className="text-gray-500 text-xs md:text-sm break-words">© 2026 LYHOENG-DESIGN. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};