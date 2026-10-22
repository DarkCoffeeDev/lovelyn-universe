import {readFile,access} from 'node:fs/promises';
import vm from 'node:vm';
const context={window:{}};vm.runInNewContext(await readFile('chapters.js','utf8'),context);
const chapters=context.window.LOVELYN_CHAPTERS;
if(chapters.length!==22||new Set(chapters.map(c=>c.id)).size!==22)throw Error('Expected 22 unique couples');
for(const c of chapters){
 for(const f of [c.sceneDay,c.sceneNight].map(x=>`assets/scenes/${x}.webp`).concat(['','-2','-3'].map(n=>`assets/photos/${c.id}${n}.jpg`),[c.matching.you,c.matching.me]))await access(f);
 if(c.sceneDay===c.sceneNight||c.captions.length!==3||c.captions.some(x=>!x)||!c.noteDay||!c.noteNight)throw Error(`Incomplete ${c.id}`);
}
for(const f of ['app.js','index.html','chapters.js'])if(/Coffee|credits-button|final-letter/.test(await readFile(f,'utf8')))throw Error(`Stale content ${f}`);
console.log('PASS: 22 couples, 44 distinct day/night scene paths, 66 photos, 44 matching icons, captions and notes.');
