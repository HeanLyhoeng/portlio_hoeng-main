import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from './ui/SectionHeading';
import { Figma, Code, PenTool, Users, Layout, Smartphone, Search, Globe, Palette, Video } from 'lucide-react';

const skills = [
  { id: 1, name: "Figma & Prototyping", level: "60%", icon: <Figma className="text-[#0066cc]" />, rank: "01" },
  { id: 2, name: "User Research", level: "60%", icon: <Search className="text-[#0066cc]" />, rank: "02" },
  { id: 3, name: "UI Design Systems", level: "65%", icon: <Layout className="text-[#0066cc]" />, rank: "03" },
  { id: 4, name: "Frontend (React)", level: "40%", icon: <Code className="text-[#0066cc]" />, rank: "04" },
  { id: 5, name: "Mobile App Design", level: "75%", icon: <Smartphone className="text-[#0066cc]" />, rank: "05" },
  { id: 6, name: "Interaction Design", level: "20%", icon: <PenTool className="text-[#0066cc]" />, rank: "06" },
  { id: 7, name: "UX Writing", level: "50%", icon: <Globe className="text-[#0066cc]" />, rank: "07" },
  { id: 8, name: "Workshop Facilitation", level: "70%", icon: <Users className="text-[#0066cc]" />, rank: "08" },
  { id: 9, name: "Graphic Design", level: "80%", icon: <Palette className="text-[#0066cc]" />, rank: "09" },
  { id: 10, name: "Video Editing", level: "70%", icon: <Video className="text-[#0066cc]" />, rank: "10" },
];

export const Skills: React.FC = () => {
  return (
    <section id="services" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-black relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-neon-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 sm:w-64 h-48 sm:h-64 bg-neon-primary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <SectionHeading title="What I Bring to the Table" subtitle="Expertise & Skills" subtitleColor="white" titleColor="white" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-dark-card border border-white/5 hover:border-blue-500/30 hover:bg-white/5 transition-all group cursor-default"
            >
              <span className="text-xl font-bold text-[#3B82F6] font-mono italic transition-colors">
                {skill.rank}
              </span>

              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center border border-white/10 group-hover:border-white/30 transition-colors">
                  {skill.icon}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-dark-card" title="Verified Skill" />
              </div>

              <div className="flex-1">
                <h4 className="text-[#3B82F6] font-medium text-sm transition-colors">
                  {skill.name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: skill.level }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-white"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};