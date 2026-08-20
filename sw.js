const CACHE_NAME = "orsetto-v13";
const ASSETS = [
  "./index.html",
  "./admin.html",
  "./manifest.json",
  "./foto-lavanderia.jpg",
  "./logo-orsetto.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});

// Quando arriva una notifica push vera (mandata dal server), la mostra
self.addEventListener("push", (event) => {
  let dati = { titolo: "L'Orsetto Lavatore", testo: "Hai un nuovo avviso." };
  try {
    dati = event.data.json();
  } catch {
    if (event.data) dati.testo = event.data.text();
  }
  event.waitUntil(
    self.registration.showNotification(dati.titolo || "L'Orsetto Lavatore", {
      body: dati.testo,
      icon: "./icons/icon-192.png",
      badge: "./icons/icon-192.png"
    })
  );
});

// Se il cliente tocca la notifica, apre il sito
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("./index.html")
  );
});
