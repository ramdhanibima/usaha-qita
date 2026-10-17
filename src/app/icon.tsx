import { ImageResponse } from 'next/og';

// Ukuran favicon browser standar
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

/**
 * Generator Favicon Dinamis Usaha Qita (Public Demo Ready)
 * Menghasilkan ikon monogram 'UQ' berlatar Navy (#0B2A4A) tanpa aset gambar eksternal.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 18,
          background: '#0B2A4A',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 800,
          borderRadius: 8,
        }}
      >
        UQ
      </div>
    ),
    {
      ...size,
    }
  );
}
