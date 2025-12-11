// --- CONFIGURATION ---
const CACHE_NAME = "niwa-garden-v5"; // Changement de version pour forcer la mise à jour

const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  // Librairie d'icônes (FontAwesome)
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
];

// --- INSTALLATION ---
// Met en cache les fichiers statiques (App Shell)
self.addEventListener("install", (event) => {
  console.log('[Service Worker] Installation de la version :', CACHE_NAME);
  
  // Force l'activation immédiate sans attendre
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(ASSETS);
    })
  );
});

// --- ACTIVATION ---
// Supprime les anciens caches (v1, v2, v3, v4...) pour libérer de la place
self.addEventListener("activate", (event) => {
  console.log('[Service Worker] Activation et nettoyage');
  
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Suppression ancien cache :', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  // Prend le contrôle de la page immédiatement
  return self.clients.claim();
});

// --- INTERCEPTION RÉSEAU (FETCH) ---
// Sert les fichiers depuis le cache si disponibles, sinon télécharge
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
