// Configuración central del concepto.
// ▸ Cambia PORTFOLIO_AUTHOR por tu nombre: aparece en el aviso fijo y en el pie.
export const PORTFOLIO_AUTHOR = 'María Teresa Barrero';
export const OFFICIAL_URL = 'https://castuo.es';

export const ORG = {
  name: 'Cooperativa del Campo San Pedro',
  brand: 'Castuo',
  foundingDate: '1965',
  founders: 137,
  members: '1.100',
  street: 'Calle Don Benito, 13',
  postalCode: '06470',
  locality: 'Guareña',
  region: 'Badajoz',
  regionFull: 'Extremadura',
  country: 'ES',
  // Coordenadas aproximadas del centro de Guareña (Badajoz).
  geo: { lat: 38.8597, lng: -6.0886 },
  phoneOffice: { display: '924 350 278', tel: '+34924350278' },
  phoneCustomer: { display: '687 97 28 77', tel: '+34687972877' },
  email: 'info@castuo.es',
  municipalities: [
    'Guareña', 'Oliva de Mérida', 'Manchita', 'Cristina', 'Valdetorres', 'Villagonzalo',
    'Don Benito', 'Villanueva de la Serena', 'San Pedro de Mérida', 'Don Álvaro', 'La Garrovilla',
  ],
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Cooperativa+del+Campo+San+Pedro+Calle+Don+Benito+13+06470+Guare%C3%B1a',
};

export type NavId = 'inicio' | 'tienda' | 'cooperativa' | 'fincas' | 'calidad' | 'visitas' | 'blog' | 'contacto' | '';

export const NAV: { id: NavId; label: string; href: string }[] = [
  { id: 'tienda', label: 'Tienda', href: '/tienda/' },
  { id: 'cooperativa', label: 'Cooperativa', href: '/cooperativa/' },
  { id: 'fincas', label: 'Fincas', href: '/fincas/' },
  { id: 'calidad', label: 'Calidad y premios', href: '/calidad-y-premios/' },
  { id: 'visitas', label: 'Visitas', href: '/visitas-almazara-guarena/' },
  { id: 'blog', label: 'Blog', href: '/blog/' },
  { id: 'contacto', label: 'Contacto', href: '/contacto/' },
];

export const eur = (n: number) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n);
