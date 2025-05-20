import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

type Member = {
  id: string;
  familyId: string;
  name: string;
  relation: 'ayah' | 'ibu' | 'anak' | 'lainnya';
  age: number;
};

const membersPath = path.join(process.cwd(), 'data', 'familyMembers.json');

async function readMembers(): Promise<Member[]> {
  try {
    const raw = await fs.readFile(membersPath, 'utf-8');
    return JSON.parse(raw) as Member[];
  } catch (e: unknown) {
    if (typeof e === 'object' && e !== null && 'code' in e && (e as { code?: string }).code === 'ENOENT') {
      return [];
    }
    throw e;
  }
}

async function writeMembers(data: Member[]) {
  await fs.mkdir(path.dirname(membersPath), { recursive: true });
  await fs.writeFile(membersPath, JSON.stringify(data, null, 2), 'utf-8');
}

// GET: list anggota, optional query ?familyId=
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const familyId = searchParams.get('familyId');
  let items = await readMembers();
  if (familyId) {
    items = items.filter(m => m.familyId === familyId);
  }
  return NextResponse.json(items);
}

// POST: tambah anggota
export async function POST(request: Request) {
  const payload = await request.json() as Omit<Member, 'id'>;
  const items = await readMembers();
  const newItem: Member = { id: Date.now().toString(), ...payload };
  items.push(newItem);
  await writeMembers(items);
  return NextResponse.json(newItem, { status: 201 });
}

// PUT: update anggota
export async function PUT(request: Request) {
  const updated = await request.json() as Member;
  const items = await readMembers();
  const idx = items.findIndex(m => m.id === updated.id);
  if (idx === -1) {
    return NextResponse.json({ error: 'Member not found' }, { status: 404 });
  }
  items[idx] = updated;
  await writeMembers(items);
  return NextResponse.json(updated);
}

// DELETE: hapus anggota
export async function DELETE(request: Request) {
  const { id } = await request.json() as { id: string };
  let items = await readMembers();
  items = items.filter(m => m.id !== id);
  await writeMembers(items);
  return NextResponse.json({ success: true });
}
