import path from 'path';

import { list, put } from '@vercel/blob';

import seedData from '@/content/symbols.json';

import type { SonnikArticle } from './article-types';

const BLOB_PATH = 'sonnik/articles.json';

type FileShape = { articles: SonnikArticle[] };

function normalize(data: unknown): SonnikArticle[] {
  if (!data || typeof data !== 'object') return [];
  const a = (data as FileShape).articles;
  return Array.isArray(a) ? a : [];
}

/** Латиница, цифры, дефис; не пустой */
export function isValidSlug(s: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s) && s.length <= 80;
}

async function readLocalFile(): Promise<SonnikArticle[]> {
  const filePath = path.join(process.cwd(), 'content', 'symbols.json');
  const fs = await import('fs/promises');
  const raw = await fs.readFile(filePath, 'utf-8');
  return normalize(JSON.parse(raw));
}

async function readFromBlob(): Promise<SonnikArticle[] | null> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return null;
  try {
    const { blobs } = await list({
      prefix: 'sonnik/',
      token,
      limit: 50,
    });
    const exact = blobs.find((b) => b.pathname === BLOB_PATH);
    if (!exact) return null;
    const res = await fetch(exact.url, { next: { revalidate: 0 } });
    if (!res.ok) return null;
    return normalize(await res.json());
  } catch {
    return null;
  }
}

async function writeLocalFile(data: FileShape): Promise<void> {
  const filePath = path.join(process.cwd(), 'content', 'symbols.json');
  const fs = await import('fs/promises');
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf-8');
}

async function writeBlob(data: FileShape): Promise<void> {
  const token = process.env.BLOB_READ_WRITE_TOKEN!;
  const body = JSON.stringify(data);
  await put(BLOB_PATH, body, {
    access: 'public',
    token,
    addRandomSuffix: false,
    contentType: 'application/json',
  });
}

/** Текущее хранилище статей: Blob (прод) или локальный JSON. */
export async function loadArticles(): Promise<SonnikArticle[]> {
  const fromBlob = await readFromBlob();
  if (fromBlob && fromBlob.length > 0) return fromBlob;

  try {
    const local = await readLocalFile();
    if (local.length > 0) return local;
  } catch {
    /* нет файла */
  }

  return normalize(seedData as FileShape);
}

export async function saveArticles(articles: SonnikArticle[]): Promise<void> {
  const data: FileShape = { articles };

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    await writeBlob(data);
    return;
  }

  if (process.env.VERCEL === '1') {
    throw new Error(
      'На Vercel нужен BLOB_READ_WRITE_TOKEN — файловая система проекта только для чтения.',
    );
  }

  await writeLocalFile(data);
}

export async function getArticleBySlugAsync(
  slug: string,
): Promise<SonnikArticle | undefined> {
  const listA = await loadArticles();
  return listA.find((a) => a.slug === slug);
}

export async function getAllSlugsAsync(): Promise<string[]> {
  const listA = await loadArticles();
  return listA.map((a) => a.slug);
}
