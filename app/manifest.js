export default function manifest() {
  return {
    name: 'Escudo RGV',
    short_name: 'Escudo RGV',
    description: 'Bilingual scam checker for the Rio Grande Valley. Share a suspicious message to find out if it is a scam.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#050b14',
    theme_color: '#050b14',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    // Makes the installed app appear in the phone's Share menu (Android / Chrome).
    share_target: {
      action: '/',
      method: 'GET',
      params: { title: 'title', text: 'text', url: 'url' },
    },
  }
}
