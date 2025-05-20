import { NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const geojsonPath = join(process.cwd(), 'public', 'data', 'families.geojson');

interface Family {
  id: string;
  nama_kepala_keluarga: string;
  nik: string;
  alamat: string;
  statusEkonomi: string;
  lat: number;
  lng: number;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Baca file, fallback ke empty collection
    const raw = await readFile(geojsonPath, 'utf-8').catch(() => '');
    const base = raw ? JSON.parse(raw) : { type: 'FeatureCollection', features: [] };

    let features;

    if (Array.isArray(body)) {
      features = body.map((f: Family) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [f.lng, f.lat] },
        properties: {
          id: f.id,
          nama_kepala_keluarga: f.nama_kepala_keluarga,
          nik: f.nik,
          alamat: f.alamat,
          statusEkonomi: f.statusEkonomi,
        },
      }));
    } else {
      const f = body as Family;
      features = [
        ...base.features,
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [f.lng, f.lat] },
          properties: {
            id: f.id,
            nama_kepala_keluarga: f.nama_kepala_keluarga,
            nik: f.nik,
            alamat: f.alamat,
            statusEkonomi: f.statusEkonomi,
          },
        },
      ];
    }

    const out = { type: 'FeatureCollection', features };
    await writeFile(geojsonPath, JSON.stringify(out, null, 2), 'utf-8');
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Save GeoJSON error:', err);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
