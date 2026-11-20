// JSON-LD (schema.org). Demostración: el sitio es noindex.
import { ORG } from '@/config';

export const orgId = (site: URL) => new URL('/#organization', site).href;

export function organization(site: URL, logo?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': orgId(site),
    name: ORG.name,
    alternateName: 'Castuo',
    url: site.href,
    logo,
    foundingDate: ORG.foundingDate,
    numberOfEmployees: undefined,
    email: ORG.email,
    telephone: ORG.phoneOffice.tel,
    address: address(),
    areaServed: ORG.municipalities.map((m) => ({ '@type': 'City', name: m })),
    award: [
      'Premios Extrema Selección 2025 · Medalla de Oro · Mejor aceite convencional',
      'Premios Extrema Selección 2025 · Mejor AOVE producido en una cooperativa',
      'Premios Extrema Selección 2025 · Maestro Almazara',
    ],
    hasCredential: [
      { '@type': 'EducationalOccupationalCredential', name: 'ISO 9001 · Gestión de la calidad', credentialCategory: 'certification' },
      { '@type': 'EducationalOccupationalCredential', name: 'ISO 14001 · Gestión ambiental', credentialCategory: 'certification' },
    ],
    contactPoint: [
      { '@type': 'ContactPoint', telephone: ORG.phoneOffice.tel, contactType: 'customer support', name: 'Oficinas', areaServed: 'ES', availableLanguage: 'es' },
      { '@type': 'ContactPoint', telephone: ORG.phoneCustomer.tel, contactType: 'sales', name: 'Atención al cliente (tienda online)', areaServed: 'ES', availableLanguage: 'es' },
    ],
  };
}

export function address() {
  return {
    '@type': 'PostalAddress',
    streetAddress: ORG.street,
    postalCode: ORG.postalCode,
    addressLocality: ORG.locality,
    addressRegion: ORG.region,
    addressCountry: ORG.country,
  };
}

export function localBusiness(site: URL, image?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'Store'],
    '@id': new URL('/#localbusiness', site).href,
    name: `${ORG.name} · Castuo`,
    parentOrganization: { '@id': orgId(site) },
    image,
    url: site.href,
    telephone: ORG.phoneOffice.tel,
    email: ORG.email,
    address: address(),
    geo: { '@type': 'GeoCoordinates', latitude: ORG.geo.lat, longitude: ORG.geo.lng },
    foundingDate: ORG.foundingDate,
    priceRange: '€',
    paymentAccepted: 'PayPal, transferencia bancaria',
    currenciesAccepted: 'EUR',
    hasMap: ORG.mapsUrl,
    // Horario pendiente de confirmar con la cooperativa: no se publica openingHoursSpecification.
  };
}
