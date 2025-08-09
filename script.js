// === Config rápida ===
// cuántas fotos tenés en cada sección y extensión real
const TOTAL_BANNER  = 10;     // collage de arriba
const TOTAL_GALLERY = 10;     // carrusel (podés usar las mismas)
const EXT = 'jpeg';           // tus archivos son .jpeg

// ==== Countdown a la fiesta: 2025-10-04 17:00 ====
(function(){
  const target = new Date('2025-10-04T17:00:00-03:00').getTime();
  const el = document.getElementById('countdown');
  const tick = () => {
    const diff = target - Date.now();
    if(diff <= 0){ el.textContent = '¡Es hoy!'; return; }
    const d = Math.floor(diff/86400000);
    const h = Math.floor((diff%86400000)/3600000);
    const m = Math.floor((diff%3600000)/60000);
    const s = Math.floor((diff%60000)/1000);
    el.textContent = `${d} días ${h}h ${m}m ${s}s`;
  };
  setInterval(tick,1000); tick();
})();

// === Play September ===
(function(){
  const audio = document.getElementById('song');
  const btn = document.getElementById('playBtn');
  fetch(audio.src,{method:'HEAD'}).then(r=>{ if(!r.ok) btn.style.display='none'; })
  .catch(()=>btn.style.display='none');
  btn?.addEventListener('click', ()=>{ audio.play().catch(()=>{}); });
})();

// === Calendar links & ICS ===
function buildGoogleUrl({title, start, end, location, details}){
  const clean = d => d.replace(/[-:]/g,'').replace('.000','');
  const url = new URL('https://calendar.google.com/calendar/render');
  url.searchParams.set('action','TEMPLATE');
  url.searchParams.set('text', title);
  url.searchParams.set('dates', `${clean(start)}/${clean(end)}`);
  url.searchParams.set('details', details);
  url.searchParams.set('location', location);
  url.searchParams.set('ctz','America/Argentina/Buenos_Aires');
  return url.toString();
}
function downloadIcs({title, start, end, location, details}){
  const ics = [
    'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Hay Casorio//AR',
    'BEGIN:VEVENT',
    'SUMMARY:'+title,
    'DTSTART;TZID=America/Argentina/Buenos_Aires:'+start.replace(/[-:]/g,'').replace('.000',''),
    'DTEND;TZID=America/Argentina/Buenos_Aires:'+end.replace(/[-:]/g,'').replace('.000',''),
    'LOCATION:'+location,'DESCRIPTION:'+details,'END:VEVENT','END:VCALENDAR'
  ].join('\r\n');
  const blob = new Blob([ics], {type:'text/calendar'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = 'evento.ics'; a.click();
}
(function(){
  const civil = {
    title:'Civil Angie & Nehuen',
    start:'2025-10-03T12:30:00', end:'2025-10-03T13:30:00',
    location:'https://maps.app.goo.gl/MQfM7CYFUUpHeJm56',
    details:'¡Te esperamos! Dress code: delirio extravagante. Subí tus fotos: https://drive.google.com/drive/folders/1RjsTeB9V9wI019YS0kOMqD1Pw3P8YU7M?usp=drive_link'
  };
  const party = {
    title:'Fiesta Angie & Nehuen',
    start:'2025-10-04T17:00:00', end:'2025-10-04T23:00:00',
    location:'https://maps.app.goo.gl/CMFsLsjDp4NCaCxi7', details:civil.details
  };
  document.getElementById('civilGcal').href = buildGoogleUrl(civil);
  document.getElementById('partyGcal').href = buildGoogleUrl(party);
  document.getElementById('civilIcs').addEventListener('click', e=>{e.preventDefault(); downloadIcs(civil);});
  document.getElementById('partyIcs').addEventListener('click', e=>{e.preventDefault(); downloadIcs(party);});
})();

// === Carrusel (reemplaza la galería) ===
(function(){
  const slide = document.getElementById('slide');
  const dotsWrap = document.getElementById('dots');
  const prev = document.querySelector('.prev');
  const next = document.querySelector('.next');
  if(!slide || !dotsWrap) return;

  const src = i => `/assets/gallery/banner${i}.${EXT}`;

  // puntitos
  for(let i=1;i<=TOTAL_GALLERY;i++){
    const b=document.createElement('button');
    b.addEventListener('click',()=>go(i));
    dotsWrap.appendChild(b);
  }
  const dots = [...dotsWrap.children];

  let i=1, timer;
  function render(){ 
    slide.src = src(i);
    dots.forEach((d,idx)=>d.classList.toggle('active', idx===i-1));
  }
  function go(n){ i=n; render(); restart(); }
  function step(dir){ i+=dir; if(i>TOTAL_GALLERY) i=1; if(i<1) i=TOTAL_GALLERY; render(); restart(); }
  function restart(){ clearInterval(timer); timer=setInterval(()=>step(1), 4000); }

  prev.addEventListener('click', ()=>step(-1));
  next.addEventListener('click', ()=>step(1));

  render(); restart();
})();
