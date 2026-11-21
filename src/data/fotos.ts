// Asignación de cada hueco [FOTO] del diseño a una fotografía real de castuo.es (ver catalogo.json).
// `file: null` → no hay foto adecuada: se muestra un bloque --placeholder y se anota en PENDIENTE.md.
export interface Credit { author: string; title: string; source: string; license: string; licenseUrl: string }
export interface Slot { file: string | null; alt: string; label?: string; pos?: string; credit?: Credit }

export const FOTOS = {
  // Inicio
  heroInicio: { file: '2025-05-premios-extrema-seleccion-aove-2025-12.jpg', alt: 'Depósitos blancos de la almazara de la Cooperativa del Campo San Pedro en Guareña, con el equipo de la cooperativa delante', pos: '62% 50%' },
  catAceite: { file: '2025-05-premios-extrema-seleccion-aove-2025-4.jpg', alt: 'Garrafas y botellas de aceite de oliva virgen extra El Castúo junto a un olivo', pos: '50% 70%' },
  catVino: { file: '2022-12-vino-de-mesa-semi-dulce-el-castuo-categoria.jpg', alt: 'Botella de vino de mesa semidulce El Castúo sobre piedra clara', pos: '50% 50%' },
  catEstuches: { file: '2021-11-estuches-categoria.jpg', alt: 'Estuches regalo El Castúo de una, dos y tres botellas con aceite y vino', pos: '50% 50%' },
  historiaInicio: { file: '2015-07-cooperativa-de-san-pedro-115.jpg', alt: 'Socios y vecinos reunidos en el patio de la cooperativa durante la celebración de su 50 aniversario', pos: '50% 50%' },
  fincaOlivar: { file: '2021-03-olivar-tradicional.jpg', alt: 'Olivos tradicionales de varios pies sobre tierra roja en una finca de socios', pos: '50% 0%' },
  fincaVinedo: { file: '2021-02-fincas-en-espaldera-2.jpg', alt: 'Calle de viñedo en espaldera de una finca de socios', pos: '50% 50%' },
  fincaAlmendro: { file: '2021-03-almendro-superintensivo.jpg', alt: 'Hileras de almendros en flor en plantación superintensiva', pos: '50% 100%' },
  visitasInicio: { file: '2025-05-premios-extrema-seleccion-aove-2025-10.jpg', alt: 'Equipo de la almazara de la cooperativa frente a los depósitos de aceite', pos: '50% 50%' },
  heroMovil: { file: '2025-05-premios-extrema-seleccion-aove-2025-12.jpg', alt: 'Depósitos blancos de la almazara de la Cooperativa del Campo San Pedro', pos: '62% 50%' },

  // Cooperativa
  heroCooperativa: { file: '2014-11-foto-aerea.jpg', alt: 'Vista aérea de las instalaciones de la Cooperativa del Campo San Pedro en Guareña (Badajoz)', pos: '50% 55%' },
  galPremios: { file: '2025-05-premios-extrema-seleccion-aove-2025-1.jpg', alt: 'Trofeos de los Premios Extrema Selección 2025 sobre un muro de piedra', pos: '50% 60%' },
  galAniversario: { file: '2015-07-cooperativa-de-san-pedro-116.jpg', alt: 'Socios en el patio de la cooperativa durante el 50 aniversario, vista desde lo alto', pos: '50% 50%' },
  galInstalaciones: { file: '2015-05-sin-t-tulo-1.jpg', alt: 'Vista aérea de las naves y depósitos de la cooperativa', pos: '50% 50%' },
  galAerea: { file: '2015-07-cabecero-aereo-castuo2.jpg', alt: 'Vista aérea de Guareña con las naves y depósitos de la cooperativa en primer término', pos: '50% 50%' },

  // Fincas
  'olivar-tradicional': { file: '2021-03-olivar-tradicional.jpg', alt: 'Olivar tradicional: olivos de varios pies a marco amplio sobre tierra roja', pos: '50% 0%' },
  'olivar-intensivo': { file: '2021-03-olivar-intensivo.jpg', alt: 'Olivar intensivo: hileras de olivos de un solo pie con la tierra labrada', pos: '50% 100%' },
  'olivar-superintensivo': { file: '2021-03-olivar-superintensivo.jpg', alt: 'Olivar superintensivo: olivos jóvenes en seto con tutores', pos: '50% 0%' },
  'vina-vaso-tradicional': { file: '2021-03-vina-vaso-tradicional.jpg', alt: 'Viña en vaso tradicional: cepas viejas podadas, sin alambres', pos: '50% 100%' },
  'vina-en-espaldera': { file: '2021-02-fincas-en-espaldera-1.jpg', alt: 'Viña en espaldera con postes y alambres tras la poda de invierno', pos: '50% 50%' },
  'almendro-superintensivo': { file: '2021-03-almendro-superintensivo.jpg', alt: 'Almendro superintensivo: hileras de almendros en flor', pos: '50% 100%' },

  // Calidad
  premioCalidad: { file: '2025-05-premios-extrema-seleccion-aove-2025-1.jpg', alt: 'Los tres galardones de los Premios Extrema Selección 2025: Maestro Almazara, Medalla de Oro y Mejor AOVE producido en una cooperativa', pos: '50% 55%' },
  calidadEquipo: { file: '2025-05-premios-extrema-seleccion-aove-2025-11.jpg', alt: 'Equipo de la cooperativa con los diplomas de Extrema Selección 2025', pos: '50% 45%' },

  // Visitas
  heroVisitas: { file: '2025-05-premios-extrema-seleccion-aove-2025-5.jpg', alt: 'Depósitos de la almazara con el logo de la cooperativa y el trofeo Maestro Almazara en primer término', pos: '50% 40%' },
  visitaAlmazara: { file: '2025-05-premios-extrema-seleccion-aove-2025-9.jpg', alt: 'Grandes depósitos blancos de la almazara de Guareña', pos: '50% 30%' },
  visitaOlivar: { file: '2021-03-olivar-intensivo.jpg', alt: 'Hileras de olivos en una finca de socios', pos: '50% 100%' },
  visitaGrupos: { file: '2015-07-cooperativa-de-san-pedro-127.jpg', alt: 'Grupo de socios entre los depósitos de acero de la cooperativa', pos: '50% 50%' },

  // Blog: la foto de cada artículo está en su frontmatter (heroImage, heroAlt, heroCredit)
} satisfies Record<string, Slot>;

export type FotoKey = keyof typeof FOTOS;
