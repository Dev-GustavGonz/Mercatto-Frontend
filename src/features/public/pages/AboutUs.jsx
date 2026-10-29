import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  ShieldCheck, 
  Eye, 
  MapPin, 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  Compass, 
  Award,
  CheckCircle2,
  Lock,
  Building2
} from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

export const AboutUs = () => {
  const { idioma } = useLanguage()
  const isEn = idioma === 'EN'
  const [activeTab, setActiveTab] = useState('mision')

  const tabs = [
    { id: 'mision', label: isEn ? 'Our Purpose & Mission' : 'Misión & Propósito' },
    { id: 'vision', label: isEn ? 'Vision 2027' : 'Visión Colombia 2027' },
    { id: 'historia', label: isEn ? 'Our Story' : 'Cómo Iniciamos' },
  ]

  return (
    <div className="max-w-5xl mx-auto py-10 sm:py-14 px-4 sm:px-6 space-y-14 font-sans">
      
      {/* ============================================================== */}
      {/* 1. HERO HEADER                                                 */}
      {/* ============================================================== */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-100 dark:bg-violet-950/70 border border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300 text-xs font-black tracking-wide uppercase">
          <MapPin size={14} className="text-violet-600 dark:text-violet-400" />
          <span>{isEn ? 'Cartagena de Indias • Expanding Across Colombia 2027' : 'Cartagena de Indias • Expansión Nacional 2027'}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          {isEn ? 'From the neighborhood to your screen' : 'Del barrio a tu pantalla'}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          {isEn
            ? 'We empower businesses with unmatched digital visibility while providing buyers with 100% secure, transparent, and verified commerce.'
            : 'Potenciamos la visibilidad y el crecimiento de las empresas y negocios locales, brindando al mismo tiempo la máxima seguridad, confianza y respaldo a cada comprador.'}
        </p>
      </div>

      {/* ============================================================== */}
      {/* 2. STATS / IMPACT SUMMARY CARDS                                */}
      {/* ============================================================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-xs">
          <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-violet-50 dark:bg-violet-950/50 flex items-center justify-center text-violet-600 dark:text-violet-400">
            <Eye size={20} />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Alta Visibilidad</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{isEn ? 'For local stores' : 'Para tiendas y marcas'}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-xs">
          <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <ShieldCheck size={20} />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">100% Seguro</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{isEn ? 'Wompi escrow protection' : 'Pagos y compras blindadas'}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-xs">
          <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <MapPin size={20} />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Cartagena</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{isEn ? 'Current active hub' : 'Sede y foco actual'}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-xs">
          <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <TrendingUp size={20} />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">2027</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{isEn ? 'Nationwide Colombia rollout' : 'Expansión a toda Colombia'}</p>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. INTERACTIVE SECTION (MISIÓN / VISIÓN / HISTORIA)            */}
      {/* ============================================================== */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Pestañas */}
        <div className="flex flex-col sm:flex-row border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-4 px-6 text-center font-extrabold text-sm transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 border-b-2 sm:border-b-2 sm:border-violet-600 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="p-6 sm:p-10 md:p-12 flex flex-col md:flex-row gap-8 md:gap-12 items-center">
          <div className="md:w-1/2 space-y-5">
            
            {/* Título de la sección activa */}
            <div className="space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-violet-600 dark:text-violet-400">
                {activeTab === 'mision' && (isEn ? 'Why Mercatto Exists' : 'Nuestro Propósito Central')}
                {activeTab === 'vision' && (isEn ? 'Strategic Roadmap' : 'Hoja de Ruta 2027')}
                {activeTab === 'historia' && (isEn ? 'Roots in Cartagena' : 'Orígenes en la Heroica')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {activeTab === 'mision' && (isEn ? 'Empower Businesses, Protect Buyers' : 'Más Visibilidad para las Empresas, Total Seguridad para los Usuarios')}
                {activeTab === 'vision' && (isEn ? 'From Cartagena to Every Corner of Colombia' : 'De Cartagena de Indias a Todo el País en 2027')}
                {activeTab === 'historia' && (isEn ? 'How Mercatto Began' : 'Nuestra Historia')}
              </h2>
            </div>
            
            {/* CONTENIDO: MISIÓN */}
            {activeTab === 'mision' && (
              <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                {isEn ? (
                  <p>
                    As our motto states, <strong className="font-black text-slate-900 dark:text-white">"From the neighborhood to your screen"</strong>, our purpose is to bring local businesses, brands, and entrepreneurs directly onto everyone's screen to give them maximum visibility, while providing buyers with total security, trust, and complete peace of mind in every purchase.
                  </p>
                ) : (
                  <p>
                    Como lo dice nuestro eslogan, <strong className="font-black text-slate-900 dark:text-white">"Del barrio a tu pantalla"</strong>, nuestro propósito es llevar a las empresas, marcas y emprendedores a la pantalla de cada persona para brindarles mayor visibilidad, garantizando a la vez total seguridad y confianza a los usuarios en cada compra.
                  </p>
                )}
                <div className="space-y-2 pt-1">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={18} className="text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm">
                      {isEn 
                        ? 'High-impact digital showcases with minimal sales commission so businesses truly prosper.' 
                        : 'Vitrinas digitales de alto impacto con las comisiones más competitivas del mercado para que los negocios realmente prosperen.'}
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm">
                      {isEn 
                        ? 'Fraud-free shopping with verified merchants, real stock, and Wompi Bancolombia escrow protection.' 
                        : 'Compras protegidas con comercios verificados, stock real y custodia de pago por Wompi Bancolombia.'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* CONTENIDO: VISIÓN */}
            {activeTab === 'vision' && (
              <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                {isEn ? (
                  <p>
                    Today, Mercatto operates with localized exclusivity in <strong className="font-black text-slate-900 dark:text-white">Cartagena de Indias</strong>, proving our model with verified local stores, direct deliveries, and trusted local relationships.
                  </p>
                ) : (
                  <p>
                    Hoy en día, Mercatto opera con cobertura y enfoque exclusivo en la ciudad de <strong className="font-black text-slate-900 dark:text-white">Cartagena de Indias</strong>, consolidando un ecosistema sólido de tiendas oficiales, entregas oportunas y confianza mutua entre vecinos y comercios.
                  </p>
                )}

                <div className="p-4 rounded-2xl bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800/60 space-y-2">
                  <div className="flex items-center gap-2 text-violet-700 dark:text-violet-300 font-black text-sm">
                    <Compass size={16} />
                    <span>{isEn ? 'Vision 2027: Nationwide Colombia' : 'Objetivo 2027: Toda Colombia'}</span>
                  </div>
                  {isEn ? (
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                      In <strong className="font-black text-slate-900 dark:text-white">2027</strong>, Mercatto will expand across <strong className="font-black text-slate-900 dark:text-white">all of Colombia</strong>, connecting manufacturers, regional brands, and buyers under our signature model of zero fraud and verified stores.
                    </p>
                  ) : (
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                      Nuestra visión es que para el año <strong className="font-black text-slate-900 dark:text-white">2027</strong> Mercatto extienda sus alas a <strong className="font-black text-slate-900 dark:text-white">todo el territorio nacional</strong>, convirtiéndose en el marketplace oficial multitienda preferido por los colombianos para comprar y vender con respaldo auténtico.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* CONTENIDO: HISTORIA */}
            {activeTab === 'historia' && (
              <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                {isEn ? (
                  <p>
                    Mercatto was born in the bustling streets and commerce of <strong className="font-black text-slate-900 dark:text-white">Cartagena de Indias</strong>. We observed a recurring paradox: hundreds of businesses, hardware stores, tech shops, home appliances and fashion boutiques had extraordinary products, but lacked their own digital showcase that gave them real visibility without abusive middlemen absorbing their margins.
                  </p>
                ) : (
                  <p>
                    Mercatto nació en las calles y comercios de <strong className="font-black text-slate-900 dark:text-white">Cartagena de Indias</strong>. Observamos una paradoja recurrente: cientos de empresas, ferreterías, tiendas de tecnología, electrodomésticos y moda contaban con productos extraordinarios, pero carecían de una vitrina digital propia que les diera visibilidad real sin que intermediarios abusivos absorbieran sus márgenes.
                  </p>
                )}

                {isEn ? (
                  <p>
                    Simultaneously, buyers felt distrust when shopping online. That is how our motto <strong className="font-black text-slate-900 dark:text-white">"From the neighborhood to your screen"</strong> was born: we engineered a robust marketplace that gives dignified digital visibility to local companies and safeguards buyer funds through verified bank escrow.
                  </p>
                ) : (
                  <p>
                    Al mismo tiempo, los compradores locales sentían incertidumbre comprando en línea. Así nació nuestro lema <strong className="font-black text-slate-900 dark:text-white">"Del barrio a tu pantalla"</strong>: creamos una infraestructura tecnológica robusta que le da vitrina digna a las empresas de la ciudad y blinda el dinero de los usuarios mediante pagos bancarios protegidos.
                  </p>
                )}
              </div>
            )}

            <div className="pt-2 flex flex-wrap gap-3">
              <Link 
                to="/registro?rol=VENDEDOR" 
                className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-xs uppercase tracking-wider py-3 px-6 rounded-full transition shadow-md shadow-violet-600/30 hover:scale-105"
              >
                <span>{isEn ? 'Register My Store' : 'Publicar mi Tienda'}</span>
                <ArrowRight size={14} />
              </Link>

              <Link 
                to="/catalogo" 
                className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-full transition"
              >
                <span>{isEn ? 'Explore Verified Catalog' : 'Ver Catálogo'}</span>
              </Link>
            </div>
          </div>
          
          {/* Card del Logo Oficial Mercatto */}
          <div className="md:w-1/2 relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden shadow-xl border border-violet-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-6 sm:p-8 text-center select-none group">
            {/* Glows decorativos */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center space-y-4 max-w-xs">
              <div className="w-full flex items-center justify-center p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 shadow-md group-hover:scale-105 transition-transform duration-300">
                <img 
                  src="/logo.png" 
                  alt="Mercatto - Del barrio a tu pantalla" 
                  className="max-h-28 sm:max-h-36 w-auto object-contain filter drop-shadow-xs"
                />
              </div>

              <div className="space-y-1 text-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-950/70 border border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300 text-[10px] font-black uppercase tracking-widest shadow-2xs">
                  <Sparkles size={11} className="text-violet-600 dark:text-violet-400" />
                  <span>Mercatto Marketplace</span>
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  Cartagena de Indias • Expansión Colombia 2027
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. PILARES DE VALOR                                            */}
      {/* ============================================================== */}
      <div className="space-y-6">
        <div className="text-center space-y-1.5">
          <span className="text-xs font-black uppercase tracking-widest text-violet-600 dark:text-violet-400">
            {isEn ? 'Foundations' : 'Nuestros Principios'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {isEn ? 'The Pillars That Guide Mercatto' : 'Los Pilares que nos Definen'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          
          {/* Pilar 1: Visibilidad Empresarial */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl flex gap-4 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="bg-violet-50 dark:bg-violet-950/60 p-3 rounded-2xl h-fit text-violet-600 dark:text-violet-400 shrink-0">
              <Eye size={22} />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-black text-base text-slate-900 dark:text-white">
                {isEn ? 'Maximum Business Visibility' : 'Máxima Visibilidad Empresarial'}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                {isEn
                  ? 'We place physical businesses, distributors, and creators in front of thousands of digital consumers with customized official store profiles.'
                  : 'Convertimos a las empresas, marcas y distribuidores en protagonistas. Les ofrecemos un canal digital moderno para exhibir su catálogo oficial ante miles de compradores.'}
              </p>
            </div>
          </div>

          {/* Pilar 2: Seguridad y Protección Wompi */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl flex gap-4 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="bg-emerald-50 dark:bg-emerald-950/60 p-3 rounded-2xl h-fit text-emerald-600 dark:text-emerald-400 shrink-0">
              <Lock size={22} />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-black text-base text-slate-900 dark:text-white">
                {isEn ? '100% Secure Shopping' : 'Seguridad y Protección Total'}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                {isEn
                  ? 'Buyer funds are safeguarded through verified banking gateways (Wompi Bancolombia, PSE, Nequi). Zero fraud, guaranteed delivery.'
                  : 'Tu dinero nunca corre riesgo. Integramos pasarelas certificadas con Wompi Bancolombia, Nequi y PSE. El pago se custodia con rigor hasta la confirmación de entrega.'}
              </p>
            </div>
          </div>

          {/* Pilar 3: De Cartagena para Colombia */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl flex gap-4 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="bg-amber-50 dark:bg-amber-950/60 p-3 rounded-2xl h-fit text-amber-600 dark:text-amber-400 shrink-0">
              <Compass size={22} />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-black text-base text-slate-900 dark:text-white">
                {isEn ? 'From Cartagena to Colombia 2027' : 'De Cartagena a Colombia 2027'}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                {isEn
                  ? 'Grounded locally in Cartagena de Indias with strict quality standards, ready to expand nationwide across Colombia in 2027.'
                  : 'Arrancamos en Cartagena de Indias perfeccionando la logística, la atención y el catálogo local, construyendo los cimientos para llegar a todo el territorio nacional en 2027.'}
              </p>
            </div>
          </div>

          {/* Pilar 4: Comercio Transparente */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl flex gap-4 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="bg-indigo-50 dark:bg-indigo-950/60 p-3 rounded-2xl h-fit text-indigo-600 dark:text-indigo-400 shrink-0">
              <Building2 size={22} />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-black text-base text-slate-900 dark:text-white">
                {isEn ? 'Fair & Transparent Growth' : 'Comercio Justo y Sin Fricciones'}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                {isEn
                  ? 'Low commissions, clear payouts, and direct communication between buyers and vendors with zero hidden fees.'
                  : 'Eliminamos las comisiones abusivas. Fomentamos un ecosistema donde las empresas conservan sus ganancias y los clientes compran a precios reales.'}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ============================================================== */}
      {/* 5. CTA INVITACIÓN A EMPRESAS Y TIENDAS                         */}
      {/* ============================================================== */}
      <div className="relative rounded-3xl overflow-hidden p-8 sm:p-10 text-white bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-950 border border-violet-800/50 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-300/30 text-[10px] font-extrabold uppercase tracking-widest">
            <Award size={12} />
            <span>{isEn ? 'Official Merchant Partner' : 'Únete como Tienda Oficial'}</span>
          </span>
          <h3 className="text-2xl sm:text-3xl font-black">
            {isEn ? 'Take your business from the neighborhood to everyone\'s screen' : 'Lleva tu negocio del barrio a la pantalla de todos'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            {isEn
              ? 'Join Mercatto in Cartagena today and scale with us as we expand across Colombia in 2027.'
              : 'Empieza a vender hoy en Mercatto Cartagena y prepárate para crecer con nosotros en nuestra expansión a toda Colombia en 2027.'}
          </p>
        </div>

        <Link
          to="/registro?rol=VENDEDOR"
          className="z-10 inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg transition-all hover:scale-105 shrink-0"
        >
          <span>{isEn ? 'Open My Store Free' : 'Crear mi Tienda Gratis'}</span>
          <ArrowRight size={14} />
        </Link>
      </div>

    </div>
  )
}

export default AboutUs
