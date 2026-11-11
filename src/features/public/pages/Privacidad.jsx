import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '@/hooks/useLanguage'
import { ShieldCheck, ArrowLeft } from 'lucide-react'

export const Privacidad = () => {
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
          <ShieldCheck size={14} />
          <span>{isEn ? 'Data Protection & Security' : 'Habeas Data & Seguridad'}</span>
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          {isEn ? 'Privacy Policy & Data Processing' : 'Política de Privacidad y Tratamiento de Datos'}
        </h1>
        <p className="text-xs text-slate-500">
          {isEn
            ? 'Last updated: October 2026 • In accordance with Colombian Law 1581 of 2012 and Decree 1377 of 2013'
            : 'Última actualización: Octubre de 2026 • Conforme a la Ley 1581 de 2012 y Decreto 1377 de 2013 de Colombia'}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        
        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-violet-600 font-bold">1.</span>{' '}
            {isEn ? 'Data Controller' : 'Responsable del Tratamiento'}
          </h2>
          <p>
            {isEn ? (
              <>
                <strong>Mercatto Marketplace</strong>, domiciled in Colombia, acts as the controller for the processing of personal data provided by users (buyers, suppliers, and sellers) across the web portal and associated applications.
              </>
            ) : (
              <>
                <strong>Mercatto Marketplace</strong>, con domicilio en Colombia, actúa como responsable del tratamiento de los datos personales suministrados por los titulares (clientes compradores, proveedores y vendedores) en el portal web y aplicaciones asociadas.
              </>
            )}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-violet-600 font-bold">2.</span>{' '}
            {isEn ? 'Data Collected and Purpose' : 'Datos que Recopilamos y Finalidad'}
          </h2>
          <p>
            {isEn
              ? 'We only collect data strictly necessary to process orders, seller payouts, and product deliveries:'
              : 'Recopilamos únicamente los datos indispensables para ejecutar las compras, liquidaciones a vendedores y despachos de productos:'}
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-xs">
            {isEn ? (
              <>
                <li><strong>Name, Phone, and Address:</strong> To coordinate physical delivery with courier companies.</li>
                <li><strong>Email Address:</strong> To issue payment receipts, electronic invoices, and tracking notifications.</li>
                <li><strong>Identification & Banking Data:</strong> Required for tax invoicing (DIAN), shipping labels, and secure payouts to registered sellers.</li>
              </>
            ) : (
              <>
                <li><strong>Nombre, Teléfono y Dirección:</strong> Para coordinar la entrega física con las empresas transportadoras.</li>
                <li><strong>Correo Electrónico:</strong> Para emitir comprobantes de pago, facturas electrónicas y notificaciones de rastreo.</li>
                <li><strong>Identificación y Datos Bancarios:</strong> Requerido por transportadoras, la DIAN para facturación y liquidación segura de ventas a vendedores.</li>
              </>
            )}
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-violet-600 font-bold">3.</span>{' '}
            {isEn ? 'Confidentiality and Non-Sale of Data' : 'Confidencialidad y No Venta de Datos'}
          </h2>
          <p>
            {isEn ? (
              <>
                Mercatto <strong>never sells, rents, or trades</strong> user databases with third parties unrelated to the commercial transaction. Data is shared exclusively with the certified payment gateway and the courier company assigned to each order.
              </>
            ) : (
              <>
                Mercatto <strong>jamás vende, alquila ni comercializa</strong> las bases de datos de sus usuarios con terceros ajenos a la transacción comercial. Los datos se comparten exclusivamente con la pasarela de pago bancaria certificada y la empresa transportadora asignada a cada pedido.
              </>
            )}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-violet-600 font-bold">4.</span>{' '}
            {isEn ? 'Data Subject Rights (Habeas Data)' : 'Derechos del Titular (Habeas Data)'}
          </h2>
          <p>
            {isEn ? (
              <>
                Every data subject has the right to know, update, rectify, and request deletion of their personal data from our records at any time by writing to <strong>privacidad@mercatto.com</strong>.
              </>
            ) : (
              <>
                Todo usuario titular de datos tiene derecho a conocer, actualizar, rectificar y solicitar la supresión de sus datos de nuestros registros en cualquier momento, enviando una comunicación al correo <strong>privacidad@mercatto.com</strong>.
              </>
            )}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-violet-600 font-bold">5.</span>{' '}
            {isEn ? 'Encryption and Security Measures' : 'Cifrado y Medidas de Seguridad'}
          </h2>
          <p>
            {isEn
              ? 'We implement industry-standard security protocols (HTTPS / TLS, BCrypt password hashing, encrypted JWT tokens, and HttpOnly cookies) to safeguard information integrity against unauthorized access.'
              : 'Implementamos protocolos de seguridad estándar de la industria (HTTPS / TLS, hashing BCrypt para contraseñas, tokens JWT cifrados y cookies HttpOnly) para salvaguardar la integridad de la información contra accesos no autorizados.'}
          </p>
        </section>
      </div>

      <div className="flex flex-wrap gap-4 justify-between items-center">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-violet-600 hover:text-violet-700 transition">
          <ArrowLeft size={16} />
          <span>{isEn ? 'Back to home' : 'Volver al inicio'}</span>
        </Link>
        <Link to="/terminos" className="text-xs font-bold text-slate-500 hover:text-violet-600 transition">
          {isEn ? 'View Terms and Conditions →' : 'Ver Términos y Condiciones →'}
        </Link>
      </div>
    </div>
  )
}

export default Privacidad