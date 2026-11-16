// Blocking Board offline cache. Version 20261116050949
const V='bb-20261116050949';
const SHELL=["./", "index.html", "manifest.webmanifest", "vendor/firebase-app-compat.js", "vendor/firebase-auth-compat.js", "vendor/firebase-firestore-compat.js", "vendor/jspdf.umd.min.js", "vendor/pdf.min.js", "vendor/pdf.worker.min.js", "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==location.origin)return;
  if(r.mode==='navigate'){
    // Online: always the newest app. Offline or very slow: the saved copy.
    e.respondWith((async()=>{
      const c=await caches.open(V);
      const net=fetch(r,{cache:'no-store'}).then(res=>{if(res&&res.ok)c.put('./',res.clone());return res;});
      const timeout=new Promise(res=>setTimeout(res,4000));
      try{const res=await Promise.race([net,timeout]);if(res)return res;}catch(err){}
      return (await c.match('./'))||net;
    })());
    return;
  }
  e.respondWith(caches.open(V).then(async c=>{
    const hit=await c.match(r,{ignoreSearch:true});
    if(hit)return hit;
    const res=await fetch(r,{cache:'no-cache'});if(res&&res.ok)c.put(r,res.clone());return res;
  }));
});
