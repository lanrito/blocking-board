// Blocking Board offline cache. Version 20261116042743
const V='bb-20261116042743';
const SHELL=["./", "index.html", "manifest.webmanifest", "vendor/firebase-app-compat.js", "vendor/firebase-auth-compat.js", "vendor/firebase-firestore-compat.js", "vendor/jspdf.umd.min.js", "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==location.origin)return;
  e.respondWith(caches.open(V).then(async c=>{
    const key=r.mode==='navigate'?'./':r;
    const hit=await c.match(key,{ignoreSearch:true});
    const net=fetch(r).then(res=>{if(res&&res.ok)c.put(key,res.clone());return res;}).catch(()=>hit);
    return hit||net;
  }));
});
