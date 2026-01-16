
import React from 'react';

const AboutContact: React.FC = () => {
  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* About Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-brand-gray opacity-30"></div>
        <div className="relative z-10 text-center max-w-2xl px-4">
          <h1 className="text-white text-5xl font-bold font-serif mb-6">L'Univers Tatlight</h1>
          <p className="text-white/70 text-lg">
            Nous croyons que chaque créateur possède une lumière unique. Notre mission est de vous fournir les meilleurs outils digitaux pour la faire rayonner.
          </p>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-7xl mx-auto px-4 w-full">
         <h2 className="text-white text-3xl font-bold font-serif text-center mb-12">Rencontrez notre équipe</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { name: "Jean Dupont", role: "Fondateur & CEO", img: "https://picsum.photos/seed/jean/400/400" },
              { name: "Marie Curie", role: "Directrice Créative", img: "https://picsum.photos/seed/marie/400/400" },
              { name: "Pierre Martin", role: "Expert Digital", img: "https://picsum.photos/seed/pierre/400/400" },
            ].map((m, idx) => (
              <div key={idx} className="flex flex-col items-center gap-4">
                <img src={m.img} className="h-40 w-40 rounded-full border-2 border-primary grayscale hover:grayscale-0 transition-all cursor-pointer" alt="" />
                <div>
                  <h4 className="text-white font-bold">{m.name}</h4>
                  <p className="text-primary text-xs uppercase font-bold tracking-widest">{m.role}</p>
                </div>
              </div>
            ))}
         </div>
      </section>

      {/* Contact Form */}
      <section className="max-w-4xl mx-auto px-4 w-full">
        <div className="bg-white/5 border border-white/10 p-12 rounded-3xl">
           <h2 className="text-white text-3xl font-bold font-serif mb-8 text-center">Une question ? Un projet ?</h2>
           <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" placeholder="Nom" className="bg-brand-night border-none rounded-xl p-4 text-white focus:ring-1 focus:ring-primary" />
              <input type="email" placeholder="Email" className="bg-brand-night border-none rounded-xl p-4 text-white focus:ring-1 focus:ring-primary" />
              <div className="md:col-span-2">
                <textarea rows={5} placeholder="Votre message..." className="w-full bg-brand-night border-none rounded-xl p-4 text-white focus:ring-1 focus:ring-primary"></textarea>
              </div>
              <div className="md:col-span-2">
                 <button className="w-full bg-primary text-brand-dark py-4 rounded-xl font-bold hover:brightness-110 shadow-lg shadow-primary/10">
                   Envoyer le message
                 </button>
              </div>
           </form>
           <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-center gap-12 text-sm text-white/50">
             <div className="flex items-center gap-3">
               <span className="material-symbols-outlined text-primary">mail</span>
               contact@tatlight.com
             </div>
             <div className="flex items-center gap-3">
               <span className="material-symbols-outlined text-primary">call</span>
               +33 1 23 45 67 89
             </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default AboutContact;
