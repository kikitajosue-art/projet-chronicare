// Seule l'interface publique est mise en cache. Aucune API, identité ou donnée de santé.
const VERSION='chronicare-shell-v4';
const scope=self.registration.scope;
const ASSETS=['index.html','manifest.webmanifest','icons/icon-180.png','icons/icon-192.png','icons/icon-512.png'].map(path=>new URL(path,scope).href);
self.addEventListener('install',event=>{event.waitUntil(caches.open(VERSION).then(cache=>cache.addAll(ASSETS)));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('chronicare-shell-')&&key!==VERSION).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url);
 if(request.method!=='GET'||url.origin!==self.location.origin||url.pathname.includes('/api/'))return;
 if(request.mode==='navigate'&&url.href.startsWith(scope)){
  event.respondWith(fetch(request).then(response=>{
   if(response.ok&&url.pathname===new URL('index.html',scope).pathname){const clone=response.clone();event.waitUntil(caches.open(VERSION).then(cache=>cache.put(ASSETS[0],clone)));}
   return response;
  }).catch(()=>caches.match(ASSETS[0])));return;
 }
 if(ASSETS.includes(url.href)){event.respondWith(caches.match(request).then(cached=>cached||fetch(request)));}
});
