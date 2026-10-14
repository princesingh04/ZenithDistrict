import fs from 'fs';
import path from 'path';
import { ApparelProduct } from '@/data/types';
import staticApparelData from '@/data/custom-apparel.json';

const STORAGE_PATH = path.join(process.cwd(), 'src', 'data', 'custom-apparel.json');
const DELETED_PATH = path.join(process.cwd(), 'src', 'data', 'deleted-apparel.json');

function isEdgeOrWorker(): boolean {
  return (
    typeof (globalThis as unknown as { WebSocketPair?: unknown }).WebSocketPair !== 'undefined' ||
    (typeof process !== 'undefined' && process.env.NEXT_RUNTIME === 'edge') ||
    typeof fs?.readFileSync !== 'function'
  );
}

/**
 * Reads custom dynamically-added products from local storage.
 */
export async function getCustomApparelProducts(): Promise<ApparelProduct[]> {
  if (isEdgeOrWorker()) {
    return Array.isArray(staticApparelData) ? (staticApparelData as ApparelProduct[]) : [];
  }
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
 * Reads list of deleted product slugs.
 */
export async function getDeletedApparelSlugs(): Promise<string[]> {
  if (isEdgeOrWorker()) {
    return [];
  }
  try {
    if (!fs.existsSync(DELETED_PATH)) {
      return [];
    }
    const raw = fs.readFileSync(DELETED_PATH, 'utf-8');
    if (!raw.trim()) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Saves or updates an apparel product.
 */
export async function saveCustomApparelProduct(product: ApparelProduct): Promise<{ success: boolean; error?: string }> {
  if (isEdgeOrWorker()) {
    return { success: false, error: 'Filesystem modifications are not supported on edge runtimes.' };
  }
  try {
    const existing = await getCustomApparelProducts();
    const index = existing.findIndex((p) => p.slug === product.slug);

    if (index >= 0) {
      existing[index] = product;
    } else {
      existing.push(product);
    }

    fs.writeFileSync(STORAGE_PATH, JSON.stringify(existing, null, 2), 'utf-8');

    // Un-delete if it was previously marked as deleted
    const deleted = await getDeletedApparelSlugs();
    if (deleted.includes(product.slug)) {
      const remaining = deleted.filter((s) => s !== product.slug);
      fs.writeFileSync(DELETED_PATH, JSON.stringify(remaining, null, 2), 'utf-8');
    }

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[CustomApparel] Error saving product:', err);
    return { success: false, error: msg };
  }
}

/**
 * Deletes any apparel product by slug (removes from custom storage and marks baseline as deleted).
 */
export async function deleteApparelProduct(slug: string): Promise<{ success: boolean; error?: string }> {
  if (isEdgeOrWorker()) {
    return { success: false, error: 'Filesystem modifications are not supported on edge runtimes.' };
  }
  try {
    // 1. Remove from custom-apparel.json
    const existing = await getCustomApparelProducts();
    const filtered = existing.filter((p) => p.slug !== slug);
    fs.writeFileSync(STORAGE_PATH, JSON.stringify(filtered, null, 2), 'utf-8');

    // 2. Add to deleted-apparel.json to hide baseline products
    const deleted = await getDeletedApparelSlugs();
    if (!deleted.includes(slug)) {
      deleted.push(slug);
      fs.writeFileSync(DELETED_PATH, JSON.stringify(deleted, null, 2), 'utf-8');
    }

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[CustomApparel] Error deleting product:', err);
    return { success: false, error: msg };
  }
}

export const deleteCustomApparelProduct = deleteApparelProduct;
