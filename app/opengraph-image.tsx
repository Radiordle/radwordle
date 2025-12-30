import { ImageResponse } from 'next/og'

export const alt = 'Radiordle'
export const size = {
  width: 256,
  height: 256,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#1a237e',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: '120px' }}>🩻</span>
      </div>
    ),
    {
      ...size,
    }
  )
}
