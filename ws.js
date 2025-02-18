var CACHE_NAME = 'v3Helados';
var cacheFiles = [
    './',
    './index.html',
    './style.css',
    './manifest.json',
    './contacto.html',
    './productos.html',
    './ubicacion.html',
    './nosotros.html',
    './img/Carrusel1.jpg',
    './img/Carrusel2.jpg',
    './img/Carrusel3.jpg',
    './img/Carrusel4.jpeg',
    './img/CubetasHelados.jpeg',
    './img/Desktop_Captura.png',
    './img/EdoMexMapa.jpeg',
    './img/ESTi.jpg',
    './img/fondo.jpg',
    './img/HeladosSabores.jpg',
    './img/Huasca.jpg',
    './img/icono1.png',
    './img/icono2.png',
    './img/MexicoBandera.png',
    './img/Mobile_Captura.png',
    './img/PachucaMapa.png',
    './img/PaletasHielo.jpg',
    './img/Perfil.png',
    './img/Temascalapa.jpeg',
    './img/TizayucaMapa.png',
    './img/VillasTezontepecMapa.png',
    './img/mision.png',
    './img/vision.jpg',
    './img/objetivos.jpg',
]

self.addEventListener('install', function(e) {
    console.log('Service Worker: Instalado');
    e.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            console.log('Service Worker: Cache abierto');
            return cache.addAll(cacheFiles);
        })
    );

    // Notificación al momento de la instalación
    self.registration.showNotification("¡Bienvenido a los Helados Garza!", {
        body: "Gracias por visitarnos, disfruta de nuestros sabores deliciosos.",
        icon: "img/icono1.png",
        badge: "img/icono1.png",
    });
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
    const cacheWhitelist = ['v3Helados'];
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

    // Notificación cuando el Service Worker está activado
    self.registration.showNotification("¡Estás listo para estar disfrutando de nuestros helados deliciosos!", {
        body: "¡Recibirás nuestras últimas actualizaciones aquí!",
        icon: "img/icono1.png",
        badge: "img/icono1.png",
    });
});

//fetch
self.addEventListener('fetch', (event) => {
    console.log('Service Worker: Fetch solicitado para', event.request.url);
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
            .catch((error) => console.error('Error en la solicitud fetch', error))
    );
});


// Evento push para recibir notificaciones
self.addEventListener('push', function(event) {
    console.log('Push recibido', event);

    var options = {
        body: event.data ? event.data.text() : '¡Tienes una nueva notificación!',
        icon: 'img/icono1.png',
        badge: 'img/icono1.png'
    };

    event.waitUntil(
        self.registration.showNotification('¡Notificación Push!', options)
    );
});

// Acción al hacer clic en una notificación
self.addEventListener('notificationclick', function(event) {
    console.log('Notificación clickeada', event.notification);
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/index.html') // Cambia esta URL por la que desees abrir
    );
});
