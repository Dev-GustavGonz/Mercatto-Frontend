import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '@/hooks/useLanguage'
import { FileText, ArrowLeft } from 'lucide-react'

export const Terminos = () => {
  const { idioma, cambiarIdioma } = useLanguage()
  const isEn = idioma === 'EN'

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
      {/* Selector de idioma rápido */}
      <div className="flex justify-end">
        <div className="inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/70 dark:border-slate-700/70">
          <button
            type="button"
            onClick={() => cambiarIdioma('es')}
            className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
              !isEn
                ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            ES
          </button>
          <button
            type="button"
            onClick={() => cambiarIdioma('en')}
            className={`px-3 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
              isEn
                ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            EN
          </button>
        </div>
      </div>

      {/* Encabezado */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 text-xs font-black uppercase tracking-wider">
          <FileText size={14} />
          <span>{isEn ? 'Legal Framework & Terms' : 'Marco Legal y Condiciones'}</span>
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          {isEn ? 'Terms and Conditions of Use' : 'Términos y Condiciones de Uso'}
        </h1>
        <p className="text-xs text-slate-500">
          {isEn
            ? 'Last updated: October 2026 • In accordance with Law 1480 of 2011 (Colombian Consumer Statute)'
            : 'Última actualización: Octubre de 2026 • Conforme a la Ley 1480 de 2011 (Estatuto del Consumidor de Colombia)'}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-violet-600 font-bold">1.</span>{' '}
            {isEn ? 'Nature of the Service and Marketplace' : 'Naturaleza del Servicio y Marketplace'}
          </h2>
          <p>
            {isEn ? (
              <>
                <strong>Mercatto</strong> is a technological e-commerce intermediation platform (Marketplace) that connects buyers with verified independent stores and sellers in Colombia. Mercatto provides the technical infrastructure, secure payment processing, and logistics integration.
              </>
            ) : (
              <>
                <strong>Mercatto</strong> es una plataforma tecnológica de intermediación de comercio electrónico (Marketplace) que conecta a compradores con tiendas y vendedores independientes verificados en Colombia. Mercatto facilita la infraestructura técnica, procesamiento de pagos seguros e integración logística.
              </>
            )}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-violet-600 font-bold">2.</span>{' '}
            {isEn ? 'Account Registration and Responsibility' : 'Registro de Cuentas y Responsabilidad'}
          </h2>
          <p>
            {isEn
              ? 'Users may browse and purchase as guests or as registered users. All information provided during purchase or registration must be accurate and up to date. Sellers are required to register valid legal identification (National ID or Tax ID / NIT), valid payout bank account details, and fulfill listed inventory.'
              : 'Los usuarios pueden navegar y comprar como invitados o como usuarios registrados. Toda información suministrada en el proceso de compra o registro debe ser veraz y vigente. Los vendedores están obligados a registrar información legal válida (Cédula o NIT), cuenta bancaria vigente para liquidaciones y a cumplir con los inventarios ofertados.'}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-violet-600 font-bold">3.</span>{' '}
            {isEn ? 'Payment Gateways and Transactional Security' : 'Pasarelas de Pago y Seguridad Transaccional'}
          </h2>
          <p>
            {isEn ? (
              <>
                Electronic payments are processed through financial institutions supervised by the Financial Superintendency of Colombia (Wompi Bancolombia, PSE, and ACH Networks). Mercatto <strong>does not store</strong> credit card numbers or banking passwords on its servers; all transactions are performed under 256-bit SSL/TLS encryption.
              </>
            ) : (
              <>
                Los pagos electrónicos se procesan a través de entidades financieras vigiladas por la Superintendencia Financiera de Colombia (Wompi Bancolombia, PSE y Redes ACH). Mercatto <strong>no almacena</strong> números de tarjetas de crédito ni claves bancarias en sus servidores; todas las transacciones se realizan bajo cifrado SSL/TLS de 256 bits.
              </>
            )}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-violet-600 font-bold">4.</span>{' '}
            {isEn ? 'Right of Withdrawal (Consumer Statute)' : 'Derecho de Retracto (Estatuto del Consumidor)'}
          </h2>
          <p>
            {isEn ? (
              <>
                In compliance with Article 47 of Law 1480 of 2011, the buyer has the right to exercise withdrawal within <strong>five (5) business days</strong> following delivery of the product, provided that it retains its original tags, shows no signs of use, and is in its original packaging. Return shipping costs are borne by the user in accordance with applicable legal regulations.
              </>
            ) : (
              <>
                En cumplimiento del artículo 47 de la Ley 1480 de 2011, el comprador tiene derecho a ejercer el retracto dentro de los <strong>cinco (5) días hábiles</strong> siguientes a la entrega del producto, siempre y cuando este conserve sus etiquetas originales, no presente señales de uso y se encuentre en su empaque original. Los costos de flete por devolución corresponden al usuario según la normativa legal aplicable.
              </>
            )}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-violet-600 font-bold">5.</span>{' '}
            {isEn ? 'Shipping, Dispatch and Tracking Numbers' : 'Envíos, Despachos y Guías de Seguimiento'}
          </h2>
          <p>
            {isEn
              ? 'Delivery times range between 2 and 5 business days in major Colombian cities. Each order includes an official tracking number assigned by certified courier companies (Coordinadora, Servientrega, Envia, or TCC), visible in the buyer panel or via the public tracking module.'
              : 'Los tiempos de entrega oscilan entre 2 y 5 días hábiles en ciudades principales de Colombia. Cada pedido cuenta con número de guía oficial asignado por empresas de mensajería certificadas (Coordinadora, Servientrega, Envia o TCC) visible en el panel del comprador o mediante el módulo de rastreo público.'}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-violet-600 font-bold">6.</span>{' '}
            {isEn ? 'Customer Support and Dispute Resolution' : 'Atención al Cliente y Solución de Controversias'}
          </h2>
          <p>
            {isEn ? (
              <>
                For inquiries or claims, users can contact the support team at <strong>realmercatto@gmail.com</strong>, through the integrated AI support chat on the platform, or via our official WhatsApp line.
              </>
            ) : (
              <>
                Para consultas o reclamos, los usuarios pueden comunicarse con el equipo de soporte a través de <strong>realmercatto@gmail.com</strong>, el chat con inteligencia artificial integrado en la plataforma o mediante nuestra línea directa de WhatsApp oficial.
              </>
            )}
          </p>
        </section>
      </div>

      <div className="flex flex-wrap gap-4 justify-between items-center">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-violet-600 hover:text-violet-700 transition">
          <ArrowLeft size={16} />
          <span>{isEn ? 'Back to store' : 'Volver a la tienda'}</span>
        </Link>
        <Link to="/privacidad" className="text-xs font-bold text-slate-500 hover:text-violet-600 transition">
          {isEn ? 'View Privacy and Data Processing Policy →' : 'Ver Política de Privacidad y Tratamiento de Datos →'}
        </Link>
      </div>
    </div>
  )
}

export default Terminos