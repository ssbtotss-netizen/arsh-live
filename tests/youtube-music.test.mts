// بحث YouTube لبوت الأغاني: ردود API بنفس شكل YouTube Data API v3 (الشبكة مغلقة في بيئة الاختبار)
import { ytVideoIdFromText, ytDur, ytMeta, ytPlayable, ytCacheKey } from "/home/claude/najd/arsh-live/src/engine/youtube.js";
import { createYouTube } from "/home/claude/najd/arsh-live/src/server/youtube.ts";
let f=0; const ok=(c:any,m:string)=>{ console.log((c?"PASS ":"FAIL ")+m); if(!c) f++ };
ok(ytVideoIdFromText("https://youtu.be/dQw4w9WgXcQ?si=x")==="dQw4w9WgXcQ"&&ytVideoIdFromText("https://www.youtube.com/watch?v=4NRXx6U8ABQ&t=3")==="4NRXx6U8ABQ"&&ytVideoIdFromText("youtube.com/shorts/abcdefghijk")==="abcdefghijk"&&ytVideoIdFromText("فوق هام السحب")===null,"YouTube link / id parsing (watch, youtu.be, shorts); plain text is not a link");
ok(ytDur("PT4M13S")===253&&ytDur("PT1H2M")===3720&&ytDur("PT45S")===45&&ytDur("")===0,"ISO-8601 duration");
const m1=ytMeta({title:"محمد عبده - فوق هام السحب (Official Music Video)",channelTitle:"Mohammed Abdu"}), m2=ytMeta({title:"Blinding Lights",channelTitle:"The Weeknd - Topic"}), m3=ytMeta({title:"Rock &amp; Roll &quot;Live&quot;",channelTitle:"X VEVO"});
ok(m1.artist==="محمد عبده"&&m1.title==="فوق هام السحب"&&m2.artist==="The Weeknd"&&m3.title==='Rock & Roll "Live"',"title/artist cleanup (Artist - Title, «- Topic», HTML entities, «Official Video»)");
ok(ytCacheKey("  أغنية   الأماكن!!")===ytCacheKey("اغنية الاماكن"),"cache key ignores hamza/spacing/punctuation");
// ردود API واقعية
const V=(id:string,o:any={})=>({id,snippet:{title:o.title||"Artist - Song "+id,channelTitle:"Ch",liveBroadcastContent:o.live||"none",thumbnails:{high:{url:`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}}},contentDetails:{duration:o.dur||"PT3M30S",...(o.rr?{regionRestriction:o.rr}:{}),...(o.age?{contentRating:{ytRating:"ytAgeRestricted"}}:{})},status:{embeddable:o.emb!==false,privacyStatus:o.priv||"public"}});
const p=ytPlayable([V("aaaaaaaaaa1",{emb:false}),V("aaaaaaaaaa2",{rr:{blocked:["SA"]}}),V("aaaaaaaaaa3",{dur:"PT12M"}),V("aaaaaaaaaa4",{live:"live"}),V("aaaaaaaaaa5",{age:true}),V("aaaaaaaaaa6")],{maxDurSec:420,region:"SA"});
ok(p.map(x=>x.ok?"ok":x.why).join("|")==="صاحب الفيديو منع التشغيل خارج YouTube|محجوب في منطقتك|أطول من الحد المسموح|بث مباشر|مقيد بالعمر (لا يعمل في المشغل المضمّن)|ok","only playable versions: embeddable, not region-blocked, within max length, not live, not age-restricted");
// خدمة البحث مع fetch وهمي يسجل الطلبات
const calls:string[]=[]; let mode="ok";
const fake=async(url:string)=>{ calls.push(url); const u=new URL(url);
 if(mode==="quota") return new Response(JSON.stringify({error:{errors:[{reason:"quotaExceeded"}]}}),{status:403});
 if(mode==="badkey") return new Response(JSON.stringify({error:{errors:[{reason:"keyInvalid"}]}}),{status:400});
 if(u.pathname.endsWith("/search")) return new Response(JSON.stringify({items:["vidBlocked1","vidGood0002","vidGood0003"].map(v=>({id:{videoId:v}}))}));
 if(u.pathname.endsWith("/videos")) return new Response(JSON.stringify({items:u.searchParams.get("id")!.split(",").map(id=>V(id,{emb:id!=="vidBlocked1",title:"محمد عبده - الأماكن"}))}));
 return new Response("{}",{status:404}) };
const yt=createYouTube({key:"TESTKEY",fetch:fake as any});
let r:any=await yt.find("الأماكن محمد عبده",{maxDurSec:420,region:"SA"});
const su=new URL(calls[0]);
ok(su.pathname.endsWith("/youtube/v3/search")&&su.searchParams.get("videoEmbeddable")==="true"&&su.searchParams.get("type")==="video"&&su.searchParams.get("regionCode")==="SA"&&su.searchParams.get("key")==="TESTKEY","official search.list: type=video, videoEmbeddable=true, regionCode, key server-side");
ok(r.ok&&r.track.vid==="vidGood0002"&&r.track.src==="yt"&&r.track.title==="الأماكن"&&r.track.artist==="محمد عبده"&&r.track.dur===210&&/i\.ytimg\.com/.test(r.track.cover),"first result blocked from embedding → skipped; picks playable one with title, artist, duration, cover");
ok(r.track.alts.length===1&&r.track.alts[0].vid==="vidGood0003","keeps an alternative version in case the player refuses");
const n=calls.length; r=await yt.find("الاماكن   محمد عبده",{maxDurSec:420,region:"SA"}); ok(r.ok&&r.cached&&calls.length===n,"same request again → served from cache (no quota used)");
r=await yt.find("!شغل https://youtu.be/vidGood0003",{maxDurSec:420}); ok(r.ok&&r.track.vid==="vidGood0003"&&new URL(calls.at(-1)!).pathname.endsWith("/videos")&&!calls.slice(n).some(c=>c.includes("/search")),"YouTube link → videos.list only (cheap), no search");
ok(yt.status().searchesToday===1&&yt.status().configured,"status: searches counted");
mode="quota"; r=await yt.find("أغنية جديدة تماماً"); ok(!r.ok&&r.error==="quota"&&/رابط/.test(r.message),"quota exceeded → clear message (use a link)");
const c2=calls.length; r=await yt.find("أغنية أخرى"); ok(!r.ok&&r.error==="quota"&&calls.length===c2,"while quota is exhausted no more search calls are made");
mode="badkey"; const yb=createYouTube({key:"BAD",fetch:fake as any}); r=await yb.find("x"); ok(!r.ok&&r.error==="bad_key","invalid key → clear message");
const yn=createYouTube({key:"",fetch:(async(u:string)=>{ calls.push(u); return /oembed/.test(u)?(/BLOCK/.test(u)?new Response("",{status:401}):new Response(JSON.stringify({title:"Adele - Hello",author_name:"AdeleVEVO"}))):new Response("{}",{status:500}) }) as any}); r=await yn.find("x"); ok(!r.ok&&r.error==="no_key"&&/رابط/.test(r.message)&&!yn.status().configured,"no key → name search unavailable (no fake results), asks for a link — never asks the creator for keys"); r=await yn.find("https://youtu.be/YQHsXMglC9A"); ok(r.ok&&r.track.title==="Hello"&&r.track.artist==="Adele"&&/oembed/.test(calls.at(-1)!),"no key → YouTube link works via official public oEmbed"); r=await yn.find("https://youtu.be/BLOCKxxxxxx"); ok(!r.ok&&/منع/.test(r.message),"oEmbed 401 → embedding disabled → refused");
console.log(f?`\n${f} FAILED`:"\nALL PASS"); process.exit(f?1:0);
