import { brandsData } from '@/data/brands';
import { labsData } from '@/data/labs';
import { divisions } from '@/data/divisions';
import {
  BrandVenture,
  LabExperiment,
  AnyVenture,
  Division,
  DivisionSlug,
  VentureStatus,
} from '@/data/types';

export async function getBrands(): Promise<BrandVenture[]> {
  return [...brandsData];
}

export async function getBrandBySlug(slug: string): Promise<BrandVenture | null> {
  const brand = brandsData.find((b) => b.slug === slug);
  return brand ?? null;
}

import { getProducts, getProductBySlug } from '@/data/products';
export { getProducts, getProductBySlug };

export async function getLabs(): Promise<LabExperiment[]> {
  return [...labsData];
}

export async function getLabBySlug(slug: string): Promise<LabExperiment | null> {
  const lab = labsData.find((l) => l.slug === slug);
  return lab ?? null;
}

export async function getAllVentures(): Promise<AnyVenture[]> {
  const [brands, products, labs] = await Promise.all([
    getBrands(),
    getProducts(),
    getLabs(),
  ]);
  return [...brands, ...products, ...labs];
}

export async function getFeaturedVentures(): Promise<AnyVenture[]> {
  const all = await getAllVentures();
  return all
    .filter((v) => v.featured)
    .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99));
}

export async function getVenturesByDivision(divisionSlug: DivisionSlug): Promise<AnyVenture[]> {
  switch (divisionSlug) {
    case 'brands':
      return getBrands();
    case 'products':
      return getProducts();
    case 'labs':
      return getLabs();
    case 'studio':
      return []; // Studio does client work, works via studioServices
    default:
      return [];
  }
}

export async function getVenturesByStatus(status: VentureStatus): Promise<AnyVenture[]> {
  const all = await getAllVentures();
  return all.filter((v) => v.status === status);
}

export async function getDivisionBySlug(slug: string): Promise<Division | null> {
  const div = divisions.find((d) => d.slug === slug);
  return div ?? null;
}

export async function getAllDivisions(): Promise<Division[]> {
  return [...divisions];
}

export async function getVentureCountByDivision(divisionSlug: DivisionSlug): Promise<number> {
  const items = await getVenturesByDivision(divisionSlug);
  return items.length;
}
