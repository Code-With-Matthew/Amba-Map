import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data/markers.json');

type Marker = {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description: string;
  type: string;
};

// GET: Ambil semua markers
export async function GET() {
  try {
    const data = await fs.readFile(dataPath, 'utf-8');
    const markers = JSON.parse(data);
    return NextResponse.json(Array.isArray(markers) ? markers : []);
  } catch (error: unknown) {
    // Type guard: cek apakah error punya properti 'code'
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code?: unknown }).code === 'ENOENT'
    ) {
      // kalau file belum ada, treat as empty array
      return NextResponse.json([], { status: 200 });
    }
    console.error('GET Error:', error);
    return NextResponse.json([], { status: 500 });
  }
}



// POST: Tambah marker baru
export async function POST(request: Request) {
  try {
    const newMarker = await request.json();
    
    // Validasi data
    if (!newMarker.title || !newMarker.lat || !newMarker.lng) {
      return NextResponse.json(
        { error: 'Title and location are required' },
        { status: 400 }
      );
    }

    const dataPath = path.join(process.cwd(), 'data/markers.json');
    
    // Pastikan folder data exists
    await fs.mkdir(path.dirname(dataPath), { recursive: true });
    
    // Baca file/create jika belum ada
    let markers = [];
    try {
      const fileData = await fs.readFile(dataPath, 'utf-8');
      markers = JSON.parse(fileData);
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'code' in error && (error as { code?: string }).code === 'ENOENT') {
        await fs.writeFile(dataPath, '[]');
      } else {
        throw error;
      }
    }

    const markerWithId = { 
      ...newMarker, 
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    markers.push(markerWithId);
    await fs.writeFile(dataPath, JSON.stringify(markers, null, 2));
    
    return NextResponse.json(markerWithId, { status: 201 });

  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT: Update marker
export async function PUT(request: Request) {
  try {
    const updatedMarker: Marker = await request.json();
    const data = await fs.readFile(dataPath, 'utf-8');
    let markers = JSON.parse(data);
    
    markers = markers.map((marker: Marker) =>
      marker.id === updatedMarker.id ? updatedMarker : marker
    );
    
    await fs.writeFile(dataPath, JSON.stringify(markers, null, 2));
    return NextResponse.json(updatedMarker);
  } catch {
    return NextResponse.json(
      { error: 'Failed to update marker' },
      { status: 500 }
    );
  }
}

// DELETE: Hapus marker
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const data = await fs.readFile(dataPath, 'utf-8');
    let markers = JSON.parse(data);
    
    markers = markers.filter((marker: Marker) => marker.id !== id);
    await fs.writeFile(dataPath, JSON.stringify(markers, null, 2));
    
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete marker' },
      { status: 500 }
    );
  }
}