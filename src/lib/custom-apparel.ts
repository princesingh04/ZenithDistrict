import fs from 'fs';
import path from 'path';
import { ApparelProduct } from '@/data/types';

const STORAGE_PATH = path.join(process.cwd(), 'src', 'data', 'custom-apparel.json');

/**
 * Reads custom dynamically-added products from local storage.
 * Gracefully returns an empty list if file doesn't exist or is unreadable.
 */
export async function getCustomApparelProducts(): Promise<ApparelProduct[]> {
  try {
    if (!fs.existsSync(STORAGE_PATH)) {
      return [];
    }
    const raw = fs.readFileSync(STORAGE_PATH, 'utf-8');
    if (!raw.trim()) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as ApparelProduct[];
  } catch (err) {
    console.warn('[CustomApparel] Error reading custom-apparel.json:', err);
    return [];
  }
}

/**
 * Saves or updates a custom apparel product.
 */
export async function saveCustomApparelProduct(product: ApparelProduct): Promise<{ success: boolean; error?: string }> {
  try {
    const existing = await getCustomApparelProducts();
    const index = existing.findIndex((p) => p.slug === product.slug);

    if (index >= 0) {
      existing[index] = product;
    } else {
      existing.push(product);
    }

    fs.writeFileSync(STORAGE_PATH, JSON.stringify(existing, null, 2), 'utf-8');
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[CustomApparel] Error saving product:', err);
    return { success: false, error: msg };
  }
}

/**
 * Deletes a custom apparel product by slug.
 */
export async function deleteCustomApparelProduct(slug: string): Promise<{ success: boolean; error?: string }> {
  try {
    const existing = await getCustomApparelProducts();
    const filtered = existing.filter((p) => p.slug !== slug);
    fs.writeFileSync(STORAGE_PATH, JSON.stringify(filtered, null, 2), 'utf-8');
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[CustomApparel] Error deleting product:', err);
    return { success: false, error: msg };
  }
}
