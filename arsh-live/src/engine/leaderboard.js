// ====== محرك القوائم: كل قائمة لها سلة بيانات مستقلة، ونقاط الإعجاب لا تختلط بنقاط الهدايا ======
export function emptyData(){return{likes:{},gifts:{},comments:{},interact:{},giftBy:{},giftTot:{},recentGifts:[],recentFollows:[],
 tot:{likes:0,gifts:0,giftCount:0,comments:0,follows:0,subs:0},feed:[],startedAt:Date.now(),running:true}}

export function applyEvent(D,H,ev){
 if(!D.interact){D.interact={};D.recentGifts=[];D.recentFollows=[];D.tot.follows=D.tot.follows||0;D.tot.subs=D.tot.subs||0}
 const u=ev.user||{}; const k=u.id||u.name;
 const base=k?{k,name:u.name||k,av:u.avatar||""}:null;
 const inter=n=>{ if(!base) return; const r=D.interact[k]||(D.interact[k]={...base,v:0}); r.v+=n; if(base.av) r.av=base.av };
 if(ev.type==="like"){ if(!base) return; const n=Math.max(0,+ev.count||0); const r=D.likes[k]||(D.likes[k]={...base,v:0}); r.v+=n; r.av=base.av||r.av; D.tot.likes+=n; inter(1) }
 else if(ev.type==="gift"){ if(!base) return; const val=Math.max(0,+ev.value||0), cnt=Math.max(1,+ev.count||1); const r=D.gifts[k]||(D.gifts[k]={...base,v:0,c:0}); r.v+=val; r.c+=cnt; D.tot.gifts+=val; D.tot.giftCount+=cnt;
   if(ev.giftId!=null||ev.gift){ const gk=String(ev.giftId??ev.gift); D.giftBy=D.giftBy||{}; D.giftTot=D.giftTot||{}; const gb=D.giftBy[gk]||(D.giftBy[gk]={}); const gr=gb[k]||(gb[k]={...base,v:0}); gr.v+=cnt; D.giftTot[gk]=(D.giftTot[gk]||0)+cnt; (D.giftNames=D.giftNames||{})[gk]=ev.gift||gk }
   D.recentGifts.unshift({k:k+"#"+(ev.id||ev.t||Date.now()),name:base.name,av:base.av,v:val,t:ev.t||Date.now()}); D.recentGifts.length=Math.min(D.recentGifts.length,30); inter(cnt);
   if(H){H.push({k,name:base.name,av:base.av,v:val,c:cnt,t:ev.t||Date.now()}); if(H.length>20000) H.splice(0,H.length-20000)} }
 else if(ev.type==="comment"){ if(!base) return; const r=D.comments[k]||(D.comments[k]={...base,v:0}); r.v+=1; D.tot.comments++; D.feed.unshift({name:base.name,text:String(ev.text||"").slice(0,200),t:Date.now()}); D.feed.length=Math.min(D.feed.length,60); inter(1) }
 else if(ev.type==="follow"){ if(!base) return; D.tot.follows++; D.recentFollows=D.recentFollows.filter(x=>x.k!==k); D.recentFollows.unshift({...base,v:0,t:ev.t||Date.now()}); D.recentFollows.length=Math.min(D.recentFollows.length,30) }
 else if(ev.type==="subscribe"){ D.tot.subs++ }
 else if(ev.type==="share"){ D.tot.shares=(D.tot.shares||0)+1 }
 else if(ev.type==="reset"){ const s=ev.scope||"all";
   if(s==="likes"||s==="all"){D.likes={};D.tot.likes=0}
   if(s==="gifts"||s==="all"){D.gifts={};D.tot.gifts=0;D.tot.giftCount=0;D.recentGifts=[];D.giftBy={};D.giftTot={}}
   if(s==="comments"||s==="all"){D.comments={};D.tot.comments=0;D.feed=[]}
   if(s==="interact"||s==="all"){D.interact={}}
   if(s==="follows"||s==="all"){D.recentFollows=[];D.tot.follows=0} }
 else if(ev.type==="shuffle"){ const b=D[ev.scope]; if(!b||Array.isArray(b)) return; const arr=Object.values(b).sort((a,b)=>b.v-a.v); if(arr.length<2) return; const pick=arr[1+Math.floor(Math.random()*(arr.length-1))]; const add=arr[0].v-pick.v+1+Math.floor(Math.random()*20); pick.v+=add; if(ev.scope==="likes")D.tot.likes+=add; if(ev.scope==="gifts")D.tot.gifts+=add; }
}
/** أي القوائم تتأثر بحدث reset/shuffle */
export const SCOPE_OF={likes:["likes","interact"],gifts:["gifts","recentGifts","interact"],comments:["comments","interact"],interact:["interact"],follows:["recentFollows"]};

export function entries(w,D,H){
 let list;
 const vals=o=>Object.values(o||{}).map(r=>({k:r.k,name:r.name,av:r.av,v:r.v}));
 if(w.type==="likes") list=vals(D.likes);
 else if(w.type==="comments") list=vals(D.comments);
 else if(w.type==="interact") list=vals(D.interact);
 else if(w.type==="recentGifts") return (D.recentGifts||[]).slice(0,w.topN).map(r=>({...r}));
 else if(w.type==="recentFollows") return (D.recentFollows||[]).slice(0,w.topN).map(r=>({...r}));
 else if(w.type==="gifts"){
  const by=w.sortBy||"value";
  if(by==="value"||by==="session") list=Object.values(D.gifts).map(r=>({k:r.k,name:r.name,av:r.av,v:r.v,c:r.c}));
  else if(by==="count") list=Object.values(D.gifts).map(r=>({k:r.k,name:r.name,av:r.av,v:r.c,c:r.v}));
  else { const now=new Date(); let since;
   if(by==="day"){since=new Date(now.getFullYear(),now.getMonth(),now.getDate()).getTime()}
   else if(by==="week"){since=Date.now()-7*864e5} else since=Date.now()-30*864e5;
   const m={}; for(const e of (H||[])) if(e.t>=since){const r=m[e.k]||(m[e.k]={k:e.k,name:e.name,av:e.av,v:0,c:0}); r.v+=e.v; r.c+=e.c}
   list=Object.values(m);
  }
 } else list=[];
 return list.sort((a,b)=>b.v-a.v||a.name.localeCompare(b.name)).slice(0,w.topN);
}
