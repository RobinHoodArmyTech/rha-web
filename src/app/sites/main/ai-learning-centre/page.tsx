import React from 'react';
import Head from 'next/head';

// Design Constants (Extracted from RHA Brand Guidelines)
const COLORS = {
  bg: '#F9F6F0',
  darkGreen: '#006430',
  orange: '#E8622D',
  textGray: '#4A4A4A',
};

const AILearningCentre = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.bg }}>
      <Head>
        <title>Bharat Learns AI Playbook | Robin Hood Army</title>
      </Head>

      {/* --- HERO SECTION --- */}
      <section className="px-6 pt-20 pb-12 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.orange }}></span>
          <p className="text-xs font-bold tracking-widest uppercase" style={{ color: COLORS.orange }}>
            An Open-Source Initiative
          </p>
        </div>

        <h1 className="text-6xl md:text-8xl font-bold leading-tight mb-8">
          <span style={{ color: COLORS.darkGreen }}>The Bharat Learns AI</span> <br />
          <span style={{ color: COLORS.orange }}>Playbook</span>
        </h1>

        <p className="text-xl md:text-2xl max-w-3xl leading-relaxed mb-12" style={{ color: COLORS.textGray }}><b>
          A blueprint for organisations to build AI Learning Centres - a step towards nation-building in the age of AI.
        </b></p>

        <a
          href="/documents/guides/Bharat_Learns_AI_Playbook.pdf"
          download
          className="inline-flex items-center gap-3 px-8 py-4 rounded text-white font-bold transition-transform hover:scale-105"
          style={{ backgroundColor: COLORS.darkGreen }}
        >
          Download the playbook
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 13l5 5 5-5M12 6v12"/>
          </svg>
        </a>
      </section>

      {/* --- WHY SECTION --- */}
      <section className="border-t border-gray-200 px-6 py-12 max-w-6xl mx-auto grid md:grid-cols-12 gap-12">
        {/* Left Title */}
        <div className="md:col-span-4">
          <h2 className="text-4xl font-bold leading-tight">
            <span style={{ color: COLORS.darkGreen }}>Why we are</span> <br />
            <span style={{ color: COLORS.orange }}>sharing this</span>
          </h2>
        </div>

        {/* Right Content */}
        <div className="md:col-span-8 space-y-16">
          <NumberedRow 
            num="01" 
            text="Over the past months, the Robin Hood Army has been experimenting: helping older children in the Robin Hood Academy learn schoolwork and English using free AI tools. The learning outcomes — and the speed of this — has been disproportionate to anything we have seen in twelve years of teaching." 
          />
          <NumberedRow 
            num="02" 
            text={<>For 12 years now, the Robin Hood Army has earned something far more valuable than scale.<strong> Trust.</strong><br/><br/> This has allowed us to serve millions of families with basic essentials, help thousands of children into school, and build deep relationships with needy communities across the breadth of the India. The zero-funds, citizen-led model is now a Harvard case study.</>} 
          />
          <NumberedRow 
            num="03" 
            text="Today, AI presents perhaps the greatest opportunity yet to help these same children — and eventually their communities — become more self-reliant." 
          />
          <NumberedRow 
            num="04" 
            text={<>On Independence Day 2026, the Robin Hood Army has launched <strong>250 AI Learning Centres</strong> for the underserved children we teach across the country, in partnership with media houses, corporates and educational institutions.</>} 
          />
          <NumberedRow 
            num="05" 
            text="Now, we are making the AI Learning Centre model open. We are sharing the playbook so that organisations with far greater resources and experience than ours can build hundreds—hopefully thousands—more AI Learning Centres across India." 
          />
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-12 text-center border-t border-gray-200">
        <h3 className="text-3xl font-bold mb-8" style={{ color: COLORS.darkGreen }}>Success is a centre the RHA does not start</h3>
        <a
          href="/documents/guides/Bharat_Learns_AI_Playbook.pdf"
          download
          className="mx-auto inline-flex items-center gap-3 px-8 py-3 rounded text-white font-bold"
          style={{ backgroundColor: COLORS.darkGreen }}
        >
          Download the playbook
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M7 13l5 5 5-5M12 6v12"/></svg>
        </a>
      </section>
    </div>
  );
};

const NumberedRow = ({ num, title, text }: { num: string; title?: string; text: React.ReactNode }) => (
  <div className="flex gap-8 border-t border-gray-200 pt-8">
    <span className="text-xs font-bold pt-1" style={{ color: COLORS.orange }}>{num}</span>
    <div className="flex-1">
      {title && <h4 className="text-lg font-black mb-2" style={{ color: COLORS.darkGreen }}>{title}</h4>}
      <p className="text-lg leading-relaxed text-gray-700">{text}</p>
    </div>
  </div>
);

export default AILearningCentre;