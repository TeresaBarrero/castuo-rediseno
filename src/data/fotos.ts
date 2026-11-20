// Asignación de cada hueco [FOTO] del diseño a una fotografía real de castuo.es (ver catalogo.json).
// `file: null` → no hay foto adecuada: se muestra un bloque --placeholder y se anota en PENDIENTE.md.
export interface Slot { file: string | null; alt: string; label?: string; pos?: string }

export const FOTOS = {
  // Inicio
  heroInicio: { file: '2025-05-premios-extrema-seleccion-aove-2025-12.jpg', alt: 'Depósitos blancos de la almazara de la Cooperativa del Campo San Pedro en Guareña, con el equipo de la cooperativa delante', pos: '62% 50%' },
  catAceite: { file: '2025-05-premios-extrema-seleccion-aove-2025-4.jpg', alt: 'Garrafas y botellas de aceite de oliva virgen extra El Castúo junto a un olivo', pos: '50% 70%' },
  catVino: { file: '2022-12-vino-de-mesa-semi-dulce-el-castuo-categoria.jpg', alt: 'Botella de vino de mesa semidulce El Castúo sobre piedra clara', pos: '50% 50%' },
  catEstuches: { file: '2021-11-estuches-categoria.jpg', alt: 'Estuches regalo El Castúo de una, dos y tres botellas con aceite y vino', pos: '50% 50%' },
  historiaInicio: { file: '2015-07-cooperativa-de-san-pedro-115.jpg', alt: 'Socios y vecinos reunidos en el patio de la cooperativa durante la celebración de su 50 aniversario', pos: '50% 50%' },
  fincaOlivar: { file: null, alt: 'Olivar de los socios de la cooperativa', label: 'Olivar · foto pendiente' },
  fincaVinedo: { file: '2021-02-fincas-en-espaldera-2.jpg', alt: 'Calle de viñedo en espaldera de una finca de socios', pos: '50% 50%' },
  fincaAlmendro: { file: null, alt: 'Almendros en plantación superintensiva', label: 'Almendro · foto pendiente' },
  visitasInicio: { file: '2025-05-premios-extrema-seleccion-aove-2025-10.jpg', alt: 'Equipo de la almazara de la cooperativa frente a los depósitos de aceite', pos: '50% 50%' },
  heroMovil: { file: '2025-05-premios-extrema-seleccion-aove-2025-12.jpg', alt: 'Depósitos blancos de la almazara de la Cooperativa del Campo San Pedro', pos: '62% 50%' },

  // Cooperativa
  heroCooperativa: { file: '2014-11-foto-aerea.jpg', alt: 'Vista aérea de las instalaciones de la Cooperativa del Campo San Pedro en Guareña (Badajoz)', pos: '50% 55%' },
  galPremios: { file: '2025-05-premios-extrema-seleccion-aove-2025-1.jpg', alt: 'Trofeos de los Premios Extrema Selección 2025 sobre un muro de piedra', pos: '50% 60%' },
  galAniversario: { file: '2015-07-cooperativa-de-san-pedro-116.jpg', alt: 'Socios en el patio de la cooperativa durante el 50 aniversario, vista desde lo alto', pos: '50% 50%' },
  galInstalaciones: { file: '2015-05-sin-t-tulo-1.jpg', alt: 'Vista aérea de las naves y depósitos de la cooperativa', pos: '50% 50%' },
  galOficinas: { file: null, alt: 'Oficinas de la cooperativa', label: 'Oficinas · foto pendiente' },

  // Fincas
  'olivar-tradicional': { file: null, alt: 'Olivar tradicional', label: 'Olivar tradicional · foto pendiente' },
  'olivar-intensivo': { file: null, alt: 'Olivar intensivo', label: 'Olivar intensivo · foto pendiente' },
  'olivar-superintensivo': { file: null, alt: 'Olivar superintensivo', label: 'Olivar superintensivo · foto pendiente' },
  'vina-vaso-tradicional': { file: null, alt: 'Viña en vaso tradicional', label: 'Viña en vaso · foto pendiente' },
  'vina-en-espaldera': { file: '2021-02-fincas-en-espaldera-1.jpg', alt: 'Viña en espaldera con postes y alambres tras la poda de invierno', pos: '50% 50%' },
  'almendro-superintensivo': { file: null, alt: 'Almendro superintensivo', label: 'Almendro · foto pendiente' },

  // Calidad
  premioCalidad: { file: '2025-05-premios-extrema-seleccion-aove-2025-1.jpg', alt: 'Los tres galardones de los Premios Extrema Selección 2025: Maestro Almazara, Medalla de Oro y Mejor AOVE producido en una cooperativa', pos: '50% 55%' },
  calidadEquipo: { file: '2025-05-premios-extrema-seleccion-aove-2025-11.jpg', alt: 'Equipo de la cooperativa con los diplomas de Extrema Selección 2025', pos: '50% 45%' },

  // Visitas
  heroVisitas: { file: '2025-05-premios-extrema-seleccion-aove-2025-5.jpg', alt: 'Depósitos de la almazara con el logo de la cooperativa y el trofeo Maestro Almazara en primer término', pos: '50% 40%' },
  visitaAlmazara: { file: '2025-05-premios-extrema-seleccion-aove-2025-9.jpg', alt: 'Grandes depósitos blancos de la almazara de Guareña', pos: '50% 30%' },
  visitaOlivar: { file: null, alt: 'Ruta por el olivar', label: 'Ruta por el olivar · foto pendiente' },
  visitaGrupos: { file: '2015-07-cooperativa-de-san-pedro-127.jpg', alt: 'Grupo de socios entre los depósitos de acero de la cooperativa', pos: '50% 50%' },

  // Blog
  'como-elegir-aceite-de-oliva-virgen-extra': { file: '2025-04-5-imagen-de-whatsapp-2025-04-04-a-las-11.36.25_5211cb80.jpg', alt: 'Garrafas y botellas de AOVE El Castúo en una estantería bajo los trofeos Extrema Selección', pos: '50% 85%' },
  'como-conservar-el-aceite-en-casa': { file: '2021-02-aceite-el-castuo-0.75-l-1.jpg', alt: 'Botella de cristal oscuro de AOVE El Castúo de 750 ml', pos: '50% 50%' },
  'cosecha-temprana-que-es': { file: '2025-05-premios-extrema-seleccion-aove-2025-7.jpg', alt: 'Medalla de Oro Extrema Selección 2025 junto a una botella de AOVE ante los depósitos', pos: '50% 50%' },
  'migas-extremenas-con-aceite': { file: null, alt: 'Migas extremeñas', label: 'Migas extremeñas · foto pendiente' },
  'tostadas-con-aove': { file: null, alt: 'Tostadas con aceite de oliva virgen extra', label: 'Tostadas · foto pendiente' },
  'vino-semidulce-cuando-servirlo': { file: '2022-12-img_0331.jpg', alt: 'Botella de vino semidulce El Castúo apoyada en su estuche', pos: '50% 50%' },
  'jornada-de-campana-en-la-almazara': { file: '2014-11-foto-aerea.jpg', alt: 'Vista aérea de las instalaciones de la almazara en Guareña', pos: '50% 50%' },
} satisfies Record<string, Slot>;

export type FotoKey = keyof typeof FOTOS;
