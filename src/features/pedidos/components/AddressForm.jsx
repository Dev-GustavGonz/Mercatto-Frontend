import React from 'react'
import Input from '@/components/common/Input'
import { MapPin } from 'lucide-react'

export const AddressForm = ({ direccion, onChange }) => {
  const handleChange = (field, value) => {
    onChange({ ...direccion, [field]: value })
  }

  return (
    <div className="space-y-4">
      {/* Banner informativo de cobertura exclusiva en Cartagena */}
      <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-violet-50/80 dark:bg-violet-950/40 border border-violet-200/80 dark:border-violet-800/60 text-xs text-violet-900 dark:text-violet-300 shadow-xs">
        <MapPin size={18} className="text-violet-600 dark:text-violet-400 shrink-0" />
        <div className="flex-1">
          <p className="font-extrabold text-violet-950 dark:text-violet-200">
            Cobertura local exclusiva en Cartagena de Indias, Bolívar
          </p>
          <p className="text-[11px] text-violet-700/90 dark:text-violet-400">
            Envíos locales rápidos y protegidos a todos los barrios de la ciudad.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Nombre y Apellidos de quien recibe"
          placeholder="Ej: Gustavo González"
          value={direccion.nombreCompleto || ''}
          onChange={(e) => handleChange('nombreCompleto', e.target.value)}
          required
        />
        <Input
          label="Teléfono de contacto (Colombia)"
          placeholder="Ej: 3167988335"
          value={direccion.telefono || ''}
          onChange={(e) => handleChange('telefono', e.target.value)}
          required
        />
      </div>

      <Input
        label="Dirección de Entrega (Calle, Carrera, Manzana, Lote, Apto / Casa)"
        placeholder="Ej: Los cerros m11 l9, Calle 30 # 18-40 Apto 201"
        value={direccion.direccion || ''}
        onChange={(e) => handleChange('direccion', e.target.value)}
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Ubicación del Barrio en Cartagena"
          placeholder="Ej: Los Cerros, Manga, Bocagrande, Crespo..."
          value={direccion.barrio || ''}
          onChange={(e) => handleChange('barrio', e.target.value)}
          required
        />
        <div className="flex flex-col justify-end">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
            Ciudad y Departamento
          </label>
          <div className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span>Cartagena de Indias, Bolívar</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold uppercase bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/60">
              Cobertura Activa
            </span>
          </div>
        </div>
      </div>

      <Input
        label="Instrucciones o referencias para la entrega (opcional)"
        placeholder="Ej: Frente a iglesia divino niño, portón blanco"
        value={direccion.notasEntrega || ''}
        onChange={(e) => handleChange('notasEntrega', e.target.value)}
      />
    </div>
  )
}

export default AddressForm
