const DATA_URL = './data/cards.json';
const PROGRESS_KEY = 'english-flashcard.progress.v1';
const INTERVALS = [1, 2, 4, 7, 15, 30, 60];
let cards = [];
let progress = {};
let queue = [];
let currentIndex = 0;
let showingBack = false;
let deferredPrompt = null;
const $ = id => document.getElementById(id);
const today = () => new Date();
const dayStart = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const isoDate = d => d.toISOString().slice(0, 10);
const dueTodayOrEarlier = due => !due || due <= isoDate(dayStart(today()));
function loadProgress(){ try { progress = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}'); } catch { progress = {}; } }
function saveProgress(){ localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress)); }
function cardProgress(id){ return progress[id] || {stage:-1,due:null,known:0,missed:0,lastReviewed:null}; }
function isDue(c){ return dueTodayOrEarlier(cardProgress(c.id).due); }
function dueCards(){ return cards.filter(isDue); }
function knownCards(){ return cards.filter(c => cardProgress(c.id).known > 0 && cardProgress(c.id).missed === 0); }
function setDashboard(){ $('dueCount').textContent = dueCards().length; $('knownCount').textContent = knownCards().length; $('totalCount').textContent = cards.length; }
function sortQueue(list){ return [...list].sort((a,b)=>{ const pa=cardProgress(a.id),pb=cardProgress(b.id),da=pa.due||'0000-00-00',db=pb.due||'0000-00-00'; if(da!==db)return da.localeCompare(db); return (pb.missed-pb.known)-(pa.missed-pa.known); }); }
function buildQueue(){ queue = sortQueue(dueCards()); currentIndex=0; showingBack=false; }
function renderCard(){
  const c=queue[currentIndex], has=Boolean(c);
  $('card').classList.toggle('hidden', !has);
  $('gradeBar').classList.toggle('hidden', !has || !showingBack);
  $('emptyState').classList.toggle('hidden', has);
  if(!has){ $('reviewMeta').textContent='今日没有到期卡片。'; return; }
  const p=cardProgress(c.id);
  $('progressLabel').textContent=(currentIndex+1)+' / '+queue.length;
  $('dueLabel').textContent=p.due ? '到期：'+p.due : '首次复习';
  $('word').textContent=c.word;
  $('example').textContent=c.example;
  $('meaning').textContent=c.meaning;
  $('memory').textContent=c.memory || '';
  $('memoryWrap').classList.toggle('hidden', !c.memory);
  $('front').classList.toggle('hidden', showingBack);
  $('back').classList.toggle('hidden', !showingBack);
  $('flipBtn').textContent=showingBack?'查看单词':'点击翻卡';
  $('reviewMeta').textContent='还有 '+(queue.length-currentIndex)+' 张待复习';
}
function flip(){ if(!queue[currentIndex])return; showingBack=!showingBack; renderCard(); }
function grade(known){
  const c=queue[currentIndex]; if(!c || !showingBack)return;
  const p=cardProgress(c.id); p.lastReviewed=new Date().toISOString();
  if(known){ p.known++; p.stage=Math.min((p.stage??-1)+1,INTERVALS.length-1); p.due=isoDate(dayStart(addDays(today(),INTERVALS[Math.max(0,p.stage)]))); }
  else { p.missed++; p.stage=0; p.due=isoDate(dayStart(addDays(today(),1))); }
  progress[c.id]=p; saveProgress(); currentIndex++; showingBack=false; renderCard(); setDashboard();
}
function reviewToday(){ buildQueue(); $('reviewView').classList.remove('hidden'); $('libraryView').classList.add('hidden'); renderCard(); }
function showLibrary(){ $('reviewView').classList.add('hidden'); $('libraryView').classList.remove('hidden'); $('searchInput').focus(); renderLibrary(); }
function escapeHtml(s){ return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m])); }
function renderLibrary(){
  const q=$('searchInput').value.trim().toLowerCase();
  const list=cards.filter(c=>(c.word+' '+c.example+' '+c.meaning+' '+c.memory).toLowerCase().includes(q));
  $('libraryList').innerHTML=list.map(c=>'<article class="library-item"><div class="library-word">'+escapeHtml(c.word)+'</div><div class="library-example">'+escapeHtml(c.example)+'</div><div class="library-meaning">'+escapeHtml(c.meaning)+'</div>'+(c.memory?'<div class="memory-wrap"><div class="label">Memory</div><div class="memory">'+escapeHtml(c.memory)+'</div></div>':'')+'</article>').join('')||'<div class="empty">没有找到匹配的卡片。</div>';
}
function exportBackup(){
  const payload={app:'English FlashCard',version:1,exportedAt:new Date().toISOString(),cards:cards,progress:progress};
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download='english-flashcard-backup-'+isoDate(today())+'.json';a.click();URL.revokeObjectURL(url);
}
async function importBackup(file){
  const data=JSON.parse(await file.text());
  if(!data||!Array.isArray(data.cards))throw new Error('不是有效的英语闪卡备份。');
  cards=data.cards.map(c=>({id:c.id||slug(c.word||c.front||''),word:c.word||String(c.front||'').split('\n')[0],example:c.example||String(c.front||'').split('\n').slice(1).join(' ').trim(),meaning:c.meaning||c.back||'',memory:c.memory||''}));
  progress=data.progress&&typeof data.progress==='object'?data.progress:{};
  saveProgress();setDashboard();buildQueue();renderCard();
}
function slug(s){ return String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')+'-'+Date.now().toString(36); }
async function init(){
  loadProgress();
  try{
    const r=await fetch(DATA_URL,{cache:'no-cache'});
    if(!r.ok)throw new Error('HTTP '+r.status);
    const data=await r.json();
    cards=Array.isArray(data.cards)?data.cards:[];
  }catch(e){
    $('reviewMeta').textContent='卡片数据加载失败，请检查网络或重新加载。';
    console.error(e);cards=[];
  }
  setDashboard();buildQueue();renderCard();
  $('flipBtn').addEventListener('click',flip);
  $('card').addEventListener('click',e=>{if(e.target.id!=='flipBtn')flip();});
  $('knownBtn').addEventListener('click',()=>grade(true));
  $('missedBtn').addEventListener('click',()=>grade(false));
  $('reviewBtn').addEventListener('click',reviewToday);
  $('libraryBtn').addEventListener('click',showLibrary);
  $('backToReviewBtn').addEventListener('click',reviewToday);
  $('resetSessionBtn').addEventListener('click',reviewToday);
  $('searchInput').addEventListener('input',renderLibrary);
  $('exportBtn').addEventListener('click',exportBackup);
  $('importInput').addEventListener('change',e=>e.target.files[0]&&importBackup(e.target.files[0]).catch(err=>alert(err.message)));
  document.addEventListener('keydown',e=>{if(e.code==='Space'){e.preventDefault();flip();}if(e.key==='1')grade(false);if(e.key==='2')grade(true);});
  if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(console.warn);
}
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;$('installBtn').classList.remove('hidden');});
$('installBtn').addEventListener('click',async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$('installBtn').classList.add('hidden');});
init();