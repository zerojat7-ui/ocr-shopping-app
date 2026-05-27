const CACHE_NAME = "ocr-shop-v2";

const urlsToCache = [

  "./",
  "./index.html",
  "./history.html",
  "./style.css",
  "./script.js",
  "./history.js",
  "./db.js",
  "./manifest.json"
];

self.addEventListener("install",e=>{

  e.waitUntil(

    caches.open(CACHE_NAME)
      .then(cache=>{

        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener("fetch",e=>{

  e.respondWith(

    caches.match(e.request)
      .then(response=>{

        return response || fetch(e.request);
      })
  );
});