import fs from 'fs';
import path from 'path';
import { ProductVenture, LabExperiment } from '@/data/types';
import staticVenturesData from '@/data/custom-ventures.json';

interface CustomVenturesStorage {
  products: ProductVenture[];
  labs: LabExperiment[];
  deletedProducts?: string[];
  deletedLabs?: string[];
}

const STORAGE_PATH = path.join(process.cwd(), 'src', 'data', 'custom-ventures.json');

function isEdgeOrWorker(): boolean {
  return (
    typeof (globalThis as unknown as { WebSocketPair?: unknown }).WebSocketPair !== 'undefined' ||
    (typeof process !== 'undefined' && process.env.NEXT_RUNTIME === 'edge') ||
    typeof fs?.readFileSync !== 'function'
  );
}

function readStorage(): Required<CustomVenturesStorage> {
  if (isEdgeOrWorker()) {
    const rawData = staticVenturesData as unknown as CustomVenturesStorage;
    return {
      products: Array.isArray(rawData?.products) ? rawData.products : [],
      labs: Array.isArray(rawData?.labs) ? rawData.labs : [],
      deletedProducts: Array.isArray(rawData?.deletedProducts) ? rawData.deletedProducts : [],
      deletedLabs: Array.isArray(rawData?.deletedLabs) ? rawData.deletedLabs : [],
    };
  }

  try {
    if (!fs.existsSync(STORAGE_PATH)) {
      return { products: [], labs: [], deletedProducts: [], deletedLabs: [] };
    }
    const raw = fs.readFileSync(STORAGE_PATH, 'utf-8');
    if (!raw.trim()) return { products: [], labs: [], deletedProducts: [], deletedLabs: [] };
    const parsed = JSON.parse(raw);
    return {
      products: Array.isArray(parsed.products) ? parsed.products : [],
      labs: Array.isArray(parsed.labs) ? parsed.labs : [],
      deletedProducts: Array.isArray(parsed.deletedProducts) ? parsed.deletedProducts : [],
      deletedLabs: Array.isArray(parsed.deletedLabs) ? parsed.deletedLabs : [],
    };
  } catch (err) {
    console.warn('[CustomVentures] Error reading custom-ventures.json:', err);
    return { products: [], labs: [], deletedProducts: [], deletedLabs: [] };
  }
}

function writeStorage(data: Required<CustomVenturesStorage>) {
  if (isEdgeOrWorker()) {
    return;
  }
  fs.writeFileSync(STORAGE_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getCustomProducts(): Promise<ProductVenture[]> {
  return readStorage().products;
}

export async function getCustomLabs(): Promise<LabExperiment[]> {
  return readStorage().labs;
}

export async function getDeletedVentures(): Promise<{ products: string[]; labs: string[] }> {
  const s = readStorage();
  return { products: s.deletedProducts, labs: s.deletedLabs };
}

export async function saveCustomProduct(product: ProductVenture): Promise<{ success: boolean; error?: string }> {
  if (isEdgeOrWorker()) {
    return { success: false, error: 'Filesystem mutations are not supported on edge runtime.' };
  }
  try {
    const storage = readStorage();
    const index = storage.products.findIndex((p) => p.slug === product.slug);
    if (index >= 0) {
      storage.products[index] = product;
    } else {
      storage.products.push(product);
    }
    // Un-delete if previously deleted
    storage.deletedProducts = storage.deletedProducts.filter((s) => s !== product.slug);
    writeStorage(storage);
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}

export async function saveCustomLab(lab: LabExperiment): Promise<{ success: boolean; error?: string }> {
  if (isEdgeOrWorker()) {
    return { success: false, error: 'Filesystem mutations are not supported on edge runtime.' };
  }
  try {
    const storage = readStorage();
    const index = storage.labs.findIndex((l) => l.slug === lab.slug);
    if (index >= 0) {
      storage.labs[index] = lab;
    } else {
      storage.labs.push(lab);
    }
    // Un-delete if previously deleted
    storage.deletedLabs = storage.deletedLabs.filter((s) => s !== lab.slug);
    writeStorage(storage);
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}

export async function deleteCustomProduct(slug: string): Promise<{ success: boolean; error?: string }> {
  if (isEdgeOrWorker()) {
    return { success: false, error: 'Filesystem mutations are not supported on edge runtime.' };
  }
  try {
    const storage = readStorage();
    storage.products = storage.products.filter((p) => p.slug !== slug);
    if (!storage.deletedProducts.includes(slug)) {
      storage.deletedProducts.push(slug);
    }
    writeStorage(storage);
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}

export async function deleteCustomLab(slug: string): Promise<{ success: boolean; error?: string }> {
  if (isEdgeOrWorker()) {
    return { success: false, error: 'Filesystem mutations are not supported on edge runtime.' };
  }
  try {
    const storage = readStorage();
    storage.labs = storage.labs.filter((l) => l.slug !== slug);
    if (!storage.deletedLabs.includes(slug)) {
      storage.deletedLabs.push(slug);
    }
    writeStorage(storage);
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}
