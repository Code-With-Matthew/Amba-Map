import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

type Family = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
};

const dataPath = path.join(process.cwd(), 'data', 'families.json');

async function readData(): Promise<Family[]> {
  try {
    const raw = await fs.readFile(dataPath, 'utf-8');
    return JSON.parse(raw) as Family[];
  } catch (e: unknown) {
    // jika file belum ada, kembalikan array kosong
    if (
      typeof e === 'object' &&
      e !== null &&
      'code' in e &&
      (e as { code?: string }).code === 'ENOENT'
    ) {
      return [];
    }
    throw e;
  }
}

async function writeData(data: Family[]) {
  await fs.mkdir(path.dirname(dataPath), { recursive: true });
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf-8');
}

// GET: daftar semua keluarga
export async function GET() {
  const items = await readData();
  return NextResponse.json(items);
}

// POST: buat family baru
export async function POST(request: Request) {
  const payload = await request.json() as Omit<Family, 'id'>;
  const items = await readData();
  const newItem: Family = {
    id: Date.now().toString(),
    ...payload
  };
  items.push(newItem);
  await writeData(items);
  return NextResponse.json(newItem, { status: 201 });
}

// PUT: update family
export async function PUT(request: Request) {
  const updated = await request.json() as Family;
  const items = await readData();
  const idx = items.findIndex(f => f.id === updated.id);
  if (idx === -1) {
    return NextResponse.json({ error: 'Family not found' }, { status: 404 });
  }
  items[idx] = updated;
  await writeData(items);
  return NextResponse.json(updated);
}

// DELETE: hapus family
export async function DELETE(request: Request) {
  const { id } = await request.json() as { id: string };
  let items = await readData();
  items = items.filter(f => f.id !== id);
  await writeData(items);
  return NextResponse.json({ success: true });
}