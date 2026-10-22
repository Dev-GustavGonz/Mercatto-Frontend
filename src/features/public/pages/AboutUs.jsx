import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, Users, TrendingUp, Heart } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

export const AboutUs = () => {
  const { idioma, t } = useLanguage()
  const isEn = idioma === 'EN'
  const [activeTab, setActiveTab] = useState('mision')

  const tabs = [
    { id: 'mision', label: isEn ? 'Mission' : 'Misión' },
    { id: 'vision', label: isEn ? 'Vision' : 'Visión' },
    { id: 'historia', label: isEn ? 'Our Story' : 'Nuestra Historia' },
  ]

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-16 font-sans">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">
          {isEn ? 'About Mercatto' : 'Sobre Mercatto'}
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          {isEn
            ? 'Building the direct bridge between manufacturers, suppliers, and buyers for fair, transparent commerce in Colombia.'
            : 'Construyendo el puente directo entre fabricantes, proveedores y compradores para un comercio más justo y transparente.'}
        </p>
      </div>

      {/* Interactive Story Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="flex flex-col md:flex-row border-b border-slate-100 dark:border-slate-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-4 text-center font-bold text-sm transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center transition-all duration-500">
          <div className="md:w-1/2 space-y-6">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">
              {activeTab === 'mision' && (isEn ? 'Our Mission' : 'Nuestra Misión')}
              {activeTab === 'vision' && (isEn ? 'Where We Are Headed' : 'Hacia Dónde Vamos')}
              {activeTab === 'historia' && (isEn ? 'How We Started' : 'Cómo Empezamos')}
            </h2>
            
            {activeTab === 'mision' && (
              <div className="space-y-4 animate-fade-in text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  {isEn
                    ? 'We were born with a clear premise: eliminate unnecessary middlemen. At Mercatto, we empower companies and entrepreneurs to sell directly to consumers with complete security and autonomy.'
                    : 'Nacimos con una idea simple: eliminar a los intermediarios innecesarios. En Mercatto, le damos el poder a las empresas y emprendedores de vender directamente a sus clientes finales con total seguridad y autonomía.'}
                </p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {isEn
                    ? 'We believe that direct trade means fair trade for everyone.'
                    : 'Creemos que un comercio más directo es un comercio más justo para todos.'}
                </p>
              </div>
            )}

            {activeTab === 'vision' && (
              <div className="space-y-4 animate-fade-in text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  {isEn
                    ? 'By 2030, we aim to be the leading technology platform in Latin America empowering small and medium enterprises.'
                    : 'Para el 2030, queremos ser la plataforma tecnológica número uno de Latinoamérica en empoderamiento de pequeñas y medianas empresas.'}
                </p>
                <p>
                  {isEn
                    ? 'We envision a world where anyone can access verified suppliers with a single click, with zero technical or financial barriers.'
                    : 'Imaginamos un mundo donde cualquier persona, desde su casa, pueda acceder a proveedores globales con un solo clic, sin barreras tecnológicas ni financieras.'}
                </p>
              </div>
            )}

            {activeTab === 'historia' && (
              <div className="space-y-4 animate-fade-in text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  {isEn
                    ? 'It all started in 2026. We were a team frustrated by the high commissions charged by traditional marketplaces.'
                    : 'Todo comenzó en un pequeño garaje en 2026. Éramos un grupo de desarrolladores frustrados por las altas comisiones que cobraban otras plataformas.'}
                </p>
                <p>
                  {isEn
                    ? 'We built Mercatto from scratch with modern technology and a transparent flat 4% commission model that supports verified local brands.'
                    : 'Decidimos armar nuestra propia solución. Lo que empezó como un pequeño proyecto de fin de semana, hoy es un ecosistema vibrante que conecta a miles de personas diariamente con tarifa fija del 4%.'}
                </p>
              </div>
            )}

            <div className="pt-4">
              <Link to="/registro?rol=VENDEDOR" className="inline-block bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-8 rounded-full transition-shadow hover:shadow-lg hover:shadow-indigo-500/30">
                {isEn ? 'Join the Movement' : 'Únete a la Revolución'}
              </Link>
            </div>
          </div>
          
          <div className="md:w-1/2 relative h-64 md:h-80 w-full rounded-2xl overflow-hidden shadow-lg bg-slate-100 dark:bg-slate-800">
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80"
              alt="Mercatto Team" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="space-y-8">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white text-center">
          {isEn ? 'Our Core Pillars' : 'Nuestros Pilares'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl flex gap-4 border border-slate-100 dark:border-slate-800">
            <div className="bg-white dark:bg-slate-800 p-3 rounded-full h-fit text-emerald-600 shadow-sm">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{t('compra_protegida_titulo')}</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                {isEn ? 'Your money is safe on every purchase with Wompi Bancolombia escrow protection.' : 'Tu dinero está protegido en cada transacción. Integramos pasarelas de pago de clase mundial.'}
              </p>
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl flex gap-4 border border-slate-100 dark:border-slate-800">
            <div className="bg-white dark:bg-slate-800 p-3 rounded-full h-fit text-violet-600 shadow-sm">
              <Users size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{isEn ? 'Direct Community' : 'Comunidad Directa'}</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                {isEn ? 'Talk directly with sellers and verified official stores with no intermediate barriers.' : 'Habla con los proveedores, negocia volúmenes y construye relaciones comerciales a largo plazo.'}
              </p>
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl flex gap-4 border border-slate-100 dark:border-slate-800">
            <div className="bg-white dark:bg-slate-800 p-3 rounded-full h-fit text-indigo-600 shadow-sm">
              <TrendingUp size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{isEn ? 'Entrepreneur Growth' : 'Crecimiento de Negocios'}</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                {isEn ? 'Advanced seller portals, analytics, and fast payouts for sustainable scaling.' : 'Proporcionamos herramientas avanzadas y paneles de control para que escales tus ventas rápidamente.'}
              </p>
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl flex gap-4 border border-slate-100 dark:border-slate-800">
            <div className="bg-white dark:bg-slate-800 p-3 rounded-full h-fit text-rose-500 shadow-sm">
              <Heart size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{isEn ? 'Crafted with Passion' : 'Hecho con Pasión'}</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                {isEn ? 'Engineered in Colombia with world-class user experience, security and speed.' : 'Nuestro equipo trabaja todos los días para ofrecerte la mejor experiencia de compra y venta.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutUs
