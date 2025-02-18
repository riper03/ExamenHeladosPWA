var CACHE_NAME = 'v2Helados';
var cacheFiles = [
    '/',
    'index.html',
    'style.css',
    'manifest.json',
    'contacto.html',
    'productos.html',
    'ubicacion.html',
    'img/Carrusel1.jpg',
    'img/Carrusel2.jpg',
    'img/Carrusel3.jpg',
    'img/Carrusel4.jpeg',
    'img/CubetasHelados.jpeg',
    'img/Desktop_Captura.png',
    'img/EdoMexMapa.jpeg',
    'img/ESTi.jpg',
    'img/fondo.jpg',
    'img/HeladosSabores.jpg',
    'img/Huasca.jpg',
    'img/icono1.png',
    'img/icono2.png',
    'img/MexicoBandera.png',
    'img/Mobile_Captura.png',
    'img/PachucaMapa.png',
    'img/PaletasHielo.jpg',
    'img/Perfil.png',
    'img/Temascalapa.jpeg',
    'img/TizayucaMapa.png',
    'img/VillasTezontepecMapa.png'
];

self.addEventListener('install', function(e) {
    console.log('Service Worker: Instalado');
    e.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            console.log('Service Worker: Cache abierto');
            return cache.addAll(cacheFiles);
        })
    );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
    const cacheWhitelist = ['v2Helados'];
    console.log('Service Worker: Activado');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch
self.addEventListener('fetch', (event) => {
    console.log('Service Worker: Fetch solicitado para', event.request.url);
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Devuelve el recurso desde el caché si está disponible
                if (response) {
                    return response;
                }
                // Si no está en caché, realiza una solicitud de red
                return fetch(event.request);
            })
            .catch((error) => console.error('Error en la solicitud fetch', error))
    );
});

// Manejo de notificación push
self.addEventListener('push', function(event) {
    console.log('Push recibido', event);

    // Datos del mensaje de la notificación push
    var options = {
        body: event.data ? event.data.text() : '¡Tienes una nueva notificación!',
        icon: 'img/icono1.png', // Puedes cambiar el ícono de la notificación
        badge: 'img/icono1.png' // Puedes cambiar el ícono de la notificación en la barra
    };

    event.waitUntil(
        self.registration.showNotification('¡Notificación Push!', options)
    );
});

// Manejo de clic en la notificación
self.addEventListener('notificationclick', function(event) {
    console.log('Notificación clickeada', event.notification);
    event.notification.close();
    // Puedes abrir una URL cuando se hace clic en la notificación
    event.waitUntil('index.html') // Cambia esto a la URL que quieras abrir
    ;
});
