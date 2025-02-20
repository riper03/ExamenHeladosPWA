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
    './app.js',
    './ws.js',
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
self.addEventListener('fetch', function(e) {
    console.log('Service Worker: Fetching', e.request.url);
    
    e.respondWith(
        caches.match(e.request).then(function(response) {
            if(response) {
                console.log('Cache encontrada', e.request.url);
                return response;
            }
            var requestClone = e.request.clone();
            fetch(requestClone).then(function(response) {
                if(!response){
                    console.log('No se encontro respuesta');
                    return response;
                }
                var responseClone = response.clone();
                
                caches.open(CACHE_NAME).then(function(cache) {
                    cache.put(e.request, responseClone);
                    return response;
                });
            })
            .catch(function(err){
                console.log('Error al hacer fetch', err);
            })
        })
    )
})
// Acción al hacer clic en una notificación
self.addEventListener('notificationclick', function(event) {
    console.log('Notificación clickeada', event.notification);
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/index.html') 
    );
});
