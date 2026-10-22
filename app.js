'use strict';
(() => {
  const chapters = window.LOVELYN_CHAPTERS;
  const $ = s => document.querySelector(s);
  const escapeHTML = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const story = $('#story');
  story.innerHTML = chapters.map((c,i) => `<section class="chapter ${c.theme} ${c.layout} transition-${c.transition}" id="${c.id}" aria-labelledby="title-${c.id}"><div class="stage"><img class="scene-art night-art" data-day="assets/scenes/${c.sceneDay}.webp" data-night="assets/scenes/${c.sceneNight}.webp" src="assets/scenes/${c.sceneNight}.webp" alt="${escapeHTML(c.names)} en su escena" ${i===0?'fetchpriority="high"':'loading="lazy"'} width="1536" height="864"><img class="scene-art day-art" src="assets/scenes/${c.sceneDay}.webp" alt="${escapeHTML(c.names)} · escena de día" loading="lazy" decoding="async" width="1536" height="864"><div class="scene-veil"></div><div class="ambient-halo" aria-hidden="true"></div><div class="scene-arrival" aria-hidden="true"></div>${(c.layout==='center'?['left','right']:[c.layout==='left'?'right':'left']).map(side=>`<button class="character-touch touch-${side}" data-matching="${i}" aria-label="Abrir sorpresa de matching icons de ${escapeHTML(c.names)}"><span aria-hidden="true">♡</span></button>`).join('')}<div class="scene-text reveal"><div class="scene-count"><i></i><span>${String(i+1).padStart(2,'0')} / ${escapeHTML(c.names)}</span><i></i></div><h2 id="title-${c.id}">${escapeHTML(c.title)}<em>${escapeHTML(c.accent)}</em></h2><p class="scene-copy">${escapeHTML(c.text)}</p>${c.poem?`<blockquote class="poem">${escapeHTML(c.poem)}</blockquote><p class="poem-credit">Tite Kubo · Bleach, tomo 60</p>`:''}<button class="letter-button" data-letter="${i}">Una notita para ti <span>♡</span></button></div><div class="photo-trio reveal">${[0,1,2].map(n=>`<button class="polaroid" data-photo="${i}:${n}" aria-label="Ver foto ${n+1} de ${escapeHTML(c.names)}"><img src="assets/photos/${c.id}${n?'-'+(n+1):''}.jpg" alt="${escapeHTML(c.names)} · recuerdo ${n+1}" loading="lazy" width="400" height="300"><span>${escapeHTML(c.captions[n])}</span></button>`).join('')}</div><aside class="sticky-note note-one reveal">${escapeHTML(c.noteNight)}</aside><aside class="sticky-note note-two reveal">${c.quote?'“'+escapeHTML(c.quote)+'”<small>'+escapeHTML(c.quoteBy)+'</small>':escapeHTML(c.note2)}</aside>${i===chapters.length-1?'<span class="last-signature">Te amo mucho. — Eddy ♡</span>':`<a class="next-scene" href="#${chapters[i+1].id}">${i===0?'Desliza, mi amor':'Otro poquito de nosotros'}<span aria-hidden="true">↓</span></a>`}</div></section>`).join('');
  $('#chapter-rail').innerHTML = chapters.map((c,i)=>`<a href="#${c.id}" aria-label="${i+1}. ${escapeHTML(c.names)}" title="${escapeHTML(c.names)}"></a>`).join('');
  $('#chapter-list').innerHTML = chapters.map((c,i)=>`<a href="#${c.id}"><span><small>${String(i+1).padStart(2,'0')}</small>${escapeHTML(c.names)}</span><span>↗</span></a>`).join('');
  const sections = [...document.querySelectorAll('.chapter')];
  sections.forEach((s,i)=>s.style.setProperty('--next-bg',i+1<sections.length?getComputedStyle(sections[i+1]).getPropertyValue('--bg'):'#111225'));
  document.documentElement.classList.add('js-ready');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let motionPaused = reduceMotion.matches, entered = false, active = 0;
  let lastSavedChapter='';
  const storage = {get(k){try{return localStorage.getItem(k)}catch{return null}},set(k,v){try{localStorage.setItem(k,v)}catch{}}};
  function setMotion(value){motionPaused=value;document.documentElement.classList.toggle('motion-paused',value);$('#motion-toggle').setAttribute('aria-pressed',String(value));$('#motion-toggle').setAttribute('aria-label',value?'Activar animaciones':'Pausar animaciones');if(value)ctx.clearRect(0,0,canvas.width,canvas.height);$('#motion-toggle').innerHTML=value?'✧ <span>Efectos</span>':'✦ <span>Efectos</span>';}
  function enter(){if(entered)return;entered=true;$('#enter').disabled=true;$('#experience').inert=false;$('#intro').classList.add('open');document.body.style.overflow='';sections[0].classList.add('seen');setTimeout(()=>{$('#intro').hidden=true;$('#intro').setAttribute('aria-hidden','true');$('.wordmark').focus({preventScroll:true});},motionPaused?30:1850);}
  document.body.style.overflow='hidden';$('#enter').addEventListener('click',enter);$('#enter').focus({preventScroll:true});
  const remembered=storage.get('lovelyn-chapter');
  const resumeChapter=chapters.find(c=>c.id===remembered);
  if(resumeChapter&&resumeChapter.id!==chapters[0].id){const b=$('#resume-story');b.hidden=false;b.textContent='Seguir con '+resumeChapter.names;b.addEventListener('click',()=>{enter();document.getElementById(resumeChapter.id).scrollIntoView({behavior:'instant'});document.getElementById(resumeChapter.id).classList.add('seen');});}
  const observer = new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('seen')}),{threshold:.12});sections.forEach(s=>observer.observe(s));
  function openDialog(dialog){dialog.showModal();dialog.scrollTop=0;document.body.style.overflow='hidden'}
  function closeDialog(dialog){dialog.close();document.body.style.overflow=''}
  document.querySelectorAll('dialog').forEach(d=>{d.querySelector('[data-close]').addEventListener('click',()=>closeDialog(d));d.addEventListener('close',()=>{document.body.style.overflow=''});d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog(d)}})});
  $('#chapters-toggle').addEventListener('click',()=>openDialog($('#chapter-dialog')));
  $('#chapter-list').addEventListener('click',e=>{if(e.target.closest('a'))closeDialog($('#chapter-dialog'))});
  document.addEventListener('click',e=>{const b=e.target.closest('[data-letter]');if(!b)return;const c=chapters[Number(b.dataset.letter)];$('#letter-content').innerHTML=`<img class="letter-photo" src="assets/photos/${c.id}.jpg" alt="${escapeHTML(c.names)}"><span class="eyebrow">${escapeHTML(c.names)} · UN POQUITO DE NOSOTROS</span><h2>${escapeHTML(c.note)}</h2><p>${escapeHTML(c.letter)}</p><p class="letter-closing">${escapeHTML(c.closing)}</p><span class="signature">Con amor, Eddy.</span>`;openDialog($('#letter-dialog'))});
  document.addEventListener('click',e=>{const b=e.target.closest('[data-photo]');if(!b)return;const [i,n]=b.dataset.photo.split(':').map(Number),c=chapters[i];$('#letter-content').innerHTML=`<img class="lightbox-photo" src="assets/photos/${c.id}${n?'-'+(n+1):''}.jpg" alt="${escapeHTML(c.names)}"><p class="photo-caption">${escapeHTML(c.captions[n])}</p><button class="photo-turn" aria-expanded="false">Detrás te dejé algo ♡</button><p class="photo-back" hidden>${escapeHTML(c.photoNotes[n])}</p>`;openDialog($('#letter-dialog'))});
  document.addEventListener('click',e=>{const b=e.target.closest('.photo-turn');if(!b)return;const back=$('.photo-back');back.hidden=!back.hidden;b.setAttribute('aria-expanded',String(!back.hidden));b.textContent=back.hidden?'Detrás te dejé algo ♡':'Guardar la notita ♡';});
  document.addEventListener('click',e=>{
    const trigger=e.target.closest('[data-matching]');if(!trigger)return;
    const c=chapters[Number(trigger.dataset.matching)];
    $('#matching-title').textContent='Uno para ti, otro para mí.';
    $('#matching-couple').textContent=c.names;
    $('#matching-cards').innerHTML=[['you','Para ti',c.matching.you],['me','Para mí',c.matching.me]].map(([key,label,src])=>`<figure class="matching-card"><div class="matching-picture"><img src="${escapeHTML(src)}" alt="Matching icon ${label.toLowerCase()} · ${escapeHTML(c.names)}" width="400" height="400"></div><figcaption>${label} <span aria-hidden="true">♡</span></figcaption><a class="matching-download" href="${escapeHTML(src)}" download="${c.id}-${key==='you'?'para-ti':'para-mi'}.jpg">Guardar mi fotito <span aria-hidden="true">↓</span></a></figure>`).join('');
    if(!$('#matching-dialog').open)openDialog($('#matching-dialog'));
  });
  let themeChanging=false;
  async function changeAmbient(mode){
    if(themeChanging)return;
    themeChanging=true;const toggle=$('#theme-toggle');toggle.disabled=true;
    const day=mode==='day', target=sections[active].querySelector(day?'.day-art':'.night-art');
    try{
      if(target.decode){let timer;try{await Promise.race([target.decode(),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('timeout')),15000);})]);}finally{clearTimeout(timer);}}
      document.body.dataset.ambient=mode;
      toggle.innerHTML=day?'☾ <span>Noche</span>':'☀ <span>Día</span>';
      toggle.setAttribute('aria-pressed',String(day));toggle.setAttribute('aria-label',day?'Cambiar a ambiente de noche':'Cambiar a ambiente de día');
      sections.forEach((section,i)=>{section.style.setProperty('--next-bg',i+1<sections.length?getComputedStyle(sections[i+1]).getPropertyValue('--bg'):day?'#f0e9ee':'#111225');});
      storage.set('lovelyn-ambient',mode);$('#ambient-status').textContent=day?'Ahora es de día en nuestros ships.':'Ya cayó la noche en nuestros ships.';
    }catch{$('#ambient-status').textContent='La escena no terminó de cargar. Puedes intentarlo otra vez.';}
    finally{themeChanging=false;toggle.disabled=false;setTimeout(()=>{$('#ambient-status').textContent='';},5000);}
  }
  $('#theme-toggle').addEventListener('click',()=>changeAmbient(document.body.dataset.ambient==='day'?'night':'day'));
  if(storage.get('lovelyn-ambient')==='day')changeAmbient('day');
  const defaultPlaylist='7dATvjOuzNflApJJsvj67F';
  function playlistId(value){try{const u=new URL(value);if(u.protocol!=='https:'||u.hostname!=='open.spotify.com')return null;return u.pathname.match(/^\/(?:intl-[a-z]{2}\/)?playlist\/([A-Za-z0-9]{22})\/?$/)?.[1]||null}catch{return null}}
  const savedId=storage.get('lovelyn-playlist');let currentPlaylist=/^[A-Za-z0-9]{22}$/.test(savedId||'')?savedId:defaultPlaylist,playerLoaded=false;
  let musicMode=storage.get('lovelyn-music-mode')==='playlist'?'playlist':'chapter',mountedTrack='',musicTimer;
  function updateMusicMode(){const b=$('#chapter-song-toggle');b.setAttribute('aria-pressed',String(musicMode==='chapter'));b.textContent=musicMode==='chapter'?'Por pareja · cambiar a playlist seguida':'Playlist seguida · cambiar por pareja';storage.set('lovelyn-music-mode',musicMode);}
  updateMusicMode();
  function chapterTrack(){try{const u=new URL(chapters[active].songUrl);return u.protocol==='https:'&&u.hostname==='open.spotify.com'?u.pathname.match(/^\/(?:intl-[a-z]{2}\/)?track\/([A-Za-z0-9]{22})\/?$/)?.[1]:null}catch{return null}}
  function syncChapterMusic(){
    const id=chapterTrack(),button=$('#chapter-song-toggle');button.hidden=!id;
    if(musicMode!=='chapter'||!playerLoaded)return;
    if(!id){musicMode='playlist';button.setAttribute('aria-pressed','false');mountSpotify();return;}
    if(mountedTrack===id)return;
    const frame=document.createElement('iframe');frame.title='Canción de '+chapters[active].names;frame.src=`https://open.spotify.com/embed/track/${id}?theme=0`;frame.allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';$('#spotify-container').replaceChildren(frame);$('#spotify-link').href=`https://open.spotify.com/track/${id}`;$('#music-meta').textContent=chapters[active].names+' · '+chapters[active].songName;mountedTrack=id;
  }
  $('#chapter-song-toggle').addEventListener('click',()=>{musicMode=musicMode==='chapter'?'playlist':'chapter';updateMusicMode();if(musicMode==='chapter')syncChapterMusic();else mountSpotify();});
  function mountSpotify(){mountedTrack='';const iframe=document.createElement('iframe');iframe.title='Playlist de Spotify';iframe.src=`https://open.spotify.com/embed/playlist/${currentPlaylist}?utm_source=generator&theme=0`;iframe.allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';iframe.allowFullscreen=true;$('#spotify-container').replaceChildren(iframe);$('#spotify-link').href=`https://open.spotify.com/playlist/${currentPlaylist}`;$('#music-meta').textContent=currentPlaylist===defaultPlaylist?'La playlist que hice para ti 💗':'Tu playlist elegida';playerLoaded=true}
  function toggleMusic(open){$('#music-panel').hidden=!open;$('#music-toggle').setAttribute('aria-expanded',String(open));if(open&&!playerLoaded){if(musicMode==='chapter')playerLoaded=true;else mountSpotify();}if(open)syncChapterMusic();if(open)$('#music-close').focus();else $('#music-toggle').focus()}
  $('#music-toggle').addEventListener('click',()=>toggleMusic($('#music-panel').hidden));$('#music-close').addEventListener('click',()=>toggleMusic(false));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#music-panel').hidden)toggleMusic(false)});
  $('#playlist-form').addEventListener('submit',e=>{e.preventDefault();const id=playlistId($('#playlist-url').value.trim());if(!id){$('#playlist-message').textContent='Pega el enlace completo de una playlist de open.spotify.com.';return}musicMode='playlist';updateMusicMode();currentPlaylist=id;storage.set('lovelyn-playlist',id);mountSpotify();$('#playlist-message').textContent='Lista para escuchar. Guardada en este navegador.'});
  const canvas=$('#petals'),ctx=canvas.getContext('2d');let w=innerWidth,h=innerHeight,last=0,raf=0,clock=0;
  const motes=Array.from({length:innerWidth<850?30:44},(_,i)=>({x:Math.random(),y:Math.random(),r:2+Math.random()*4,phase:Math.random()*Math.PI*2,speed:.018+Math.random()*.023,index:i}));
  const railLinks=[...document.querySelectorAll('#chapter-rail a')];
  const colors={petals:'#f5aecb',dust:'#ffd7a0',confetti:'#e9afe3',lights:'#ffd07a',leaves:'#b4d59a',embers:'#dba4f5',hearts:'#eeb5a8',orbits:'#b4cafa',fireflies:'#eaff9a',mist:'#c8e0ed',lanterns:'#ffd398',sea:'#a0e8f5',stars:'#fff1be',snow:'#e8f3ff',bubbles:'#b5ead5',notes:'#ebc3f5',rain:'#b6d9ed',clouds:'#fff4db'};
  function resize(){w=innerWidth;h=innerHeight;const d=Math.min(devicePixelRatio||1,2);canvas.width=w*d;canvas.height=h*d;ctx.setTransform(d,0,0,d,0,0)}resize();window.addEventListener('resize',resize,{passive:true});
  $('#motion-toggle').addEventListener('click',()=>setMotion(!motionPaused));reduceMotion.addEventListener('change',e=>setMotion(e.matches));setMotion(motionPaused);
  function glow(radius,color){const g=ctx.createRadialGradient(0,0,0,0,0,radius);g.addColorStop(0,color);g.addColorStop(.16,color+'bb');g.addColorStop(1,color+'00');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,radius,0,Math.PI*2);ctx.fill();}
  function drawMote(p,e,day,dt,quiet){
    const floaty=['dust','lights','embers','fireflies','lanterns','mist','orbits','bubbles','notes','clouds'].includes(e);
    p.y+=dt*p.speed*(floaty?-.42:.62);p.x+=Math.sin(clock*.55+p.phase)*dt*.012;
    if(p.y>1.06)p.y=-.06;if(p.y<-.06)p.y=1.06;if(p.x>1.06)p.x=-.06;if(p.x<-.06)p.x=1.06;
    const x=p.x*w+Math.sin(clock*.8+p.phase)*10,y=p.y*h+Math.cos(clock*.6+p.phase)*12;
    // Keep the reading area quiet, with brighter effects over the illustration and margins.
    const overText=quiet&&x>quiet.left-8&&x<quiet.right+8&&y>quiet.top-8&&y<quiet.bottom+8;
    const pulse=.35+.65*(.5+.5*Math.sin(clock*(e==='fireflies'?1.4:.7)+p.phase))**2;
    ctx.save();ctx.translate(x,y);ctx.globalAlpha=(overText?.1:1)*(day?.7:1);ctx.fillStyle=colors[e]||colors.dust;ctx.strokeStyle=ctx.fillStyle;
    if(e==='bubbles'){
      ctx.globalAlpha*=.45;ctx.lineWidth=.8;ctx.beginPath();ctx.arc(0,0,p.r*2,0,Math.PI*2);ctx.stroke();ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(-p.r*.65,-p.r*.65,1,0,Math.PI*2);ctx.fill();
    }else if(e==='notes'){
      ctx.globalAlpha*=pulse*.45;ctx.rotate(Math.sin(clock*.4+p.phase)*.15);ctx.font=`${p.r*4}px Georgia`;ctx.fillText(p.index%2?'♪':'♫',0,0);
    }else if(e==='rain'){
      ctx.globalAlpha*=.24;ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-3,p.r*4);ctx.stroke();
    }else if(e==='clouds'){
      ctx.globalAlpha*=.07;glow(p.r*10,colors[e]);
    }else if(e==='fireflies'||e==='lights'||e==='embers'){
      ctx.globalAlpha*=pulse;glow(p.r*(e==='fireflies'?4.5:3),colors[e]);ctx.fillStyle='#fffbdc';ctx.beginPath();ctx.arc(0,0,e==='fireflies'?1.6:1.1,0,Math.PI*2);ctx.fill();
    }else if(e==='lanterns'){
      ctx.globalAlpha*=.65;glow(p.r*5,colors[e]);ctx.rotate(Math.sin(clock*.7+p.phase)*.12);ctx.fillStyle='#ffdc9b';ctx.fillRect(-p.r*.65,-p.r,p.r*1.3,p.r*1.7);ctx.strokeStyle='#b67c54';ctx.lineWidth=.6;ctx.strokeRect(-p.r*.65,-p.r,p.r*1.3,p.r*1.7);ctx.fillStyle='#fff4d0';ctx.fillRect(-p.r*.35,p.r*.8,p.r*.7,1);
    }else if(e==='stars'||e==='sea'){
      ctx.globalAlpha*=pulse*.7;ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(-p.r,0);ctx.lineTo(p.r,0);ctx.moveTo(0,-p.r*.65);ctx.lineTo(0,p.r*.65);ctx.stroke();
      if(e==='sea'){ctx.globalAlpha*=.5;ctx.beginPath();ctx.ellipse(0,p.r*2,p.r*5,1,0,0,Math.PI*2);ctx.stroke();}
    }else if(e==='snow'){
      ctx.globalAlpha*=.45+pulse*.4;ctx.beginPath();ctx.arc(0,0,p.r*.6,0,Math.PI*2);ctx.fill();
    }else if(e==='mist'){
      ctx.globalAlpha*=.09;glow(p.r*16,colors[e]);
    }else if(e==='petals'||e==='leaves'){
      ctx.rotate(clock*.5+p.phase);ctx.globalAlpha*=.6;ctx.beginPath();ctx.ellipse(0,0,p.r*1.6,p.r*.65,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle=e==='petals'?'#ffecf3':'#e3efcf';ctx.lineWidth=.5;ctx.beginPath();ctx.moveTo(-p.r,0);ctx.lineTo(p.r,0);ctx.stroke();
    }else if(e==='orbits'){
      ctx.globalAlpha*=pulse*.6;ctx.rotate(clock*.3+p.phase);ctx.beginPath();ctx.ellipse(0,0,p.r*2,p.r*.7,0,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(0,0,1.5,0,Math.PI*2);ctx.fill();
    }else if(e==='hearts'){
      ctx.globalAlpha*=.35;ctx.font=`${p.r*3}px Georgia`;ctx.fillText('♡',0,0);
    }else if(e==='confetti'){
      ctx.rotate(clock*.6+p.phase);ctx.globalAlpha*=.5;ctx.fillRect(-p.r/2,-p.r/2,p.r,p.r*1.6);
    }else{ctx.globalAlpha*=pulse*.5;glow(p.r*2,colors.dust);}
    ctx.restore();
  }
  function tick(now){const dt=Math.min((now-last)/1000,.05);last=now;clock+=dt;const vh=innerHeight;let nearest=Infinity;
    sections.forEach((section,i)=>{const r=section.getBoundingClientRect();if(r.top<vh&&r.bottom>0){const probe=vh*.32;const dist=r.top<=probe&&r.bottom>probe?0:Math.min(Math.abs(r.top-probe),Math.abs(r.bottom-probe));if(dist<nearest){nearest=dist;active=i;}section.style.setProperty('--arrival',motionPaused?'0':String(Math.max(0,Math.min(1,r.top/(vh*.85)))));if(!motionPaused&&w>850)section.style.setProperty('--parallax',`${Math.max(-18,Math.min(18,-r.top*.035))}px`);}});
    const total=document.documentElement.scrollHeight-vh;$('#reading-fill').style.width=`${total>0?Math.min(100,Math.max(0,scrollY/total*100)):0}%`;
    if(entered&&lastSavedChapter!==chapters[active].id){lastSavedChapter=chapters[active].id;clearTimeout(musicTimer);musicTimer=setTimeout(syncChapterMusic,850);storage.set('lovelyn-chapter',lastSavedChapter);railLinks.forEach((a,i)=>a.setAttribute('aria-current',String(active===i)));}
    ctx.clearRect(0,0,w,h);
    if(entered&&!motionPaused){const day=document.body.dataset.ambient==='day',effect=day?chapters[active].effectDay:chapters[active].effectNight;canvas.dataset.effect=effect;const quiet=sections[active].querySelector('.scene-text').getBoundingClientRect();motes.forEach(p=>drawMote(p,effect,day,dt,quiet));}
    raf=requestAnimationFrame(tick);
  }
  document.addEventListener('visibilitychange',()=>{cancelAnimationFrame(raf);if(!document.hidden){last=performance.now();raf=requestAnimationFrame(tick)}});raf=requestAnimationFrame(tick);
})();
