// ====== مولّد QR Code محلي (بايت، تصحيح أخطاء M، الإصدارات 1–20) — بدون أي خدمة خارجية ======
const QR_ECC=[-1,10,16,26,18,24,16,18,22,22,26,30,22,22,24,24,28,28,26,26,26];
const QR_BLK=[-1,1,1,1,2,2,4,4,4,5,5,5,8,9,9,10,10,11,13,14,16];
const qrRaw=v=>{ let r=(16*v+128)*v+64; if(v>=2){ const n=Math.floor(v/7)+2; r-=(25*n-10)*n-55; if(v>=7) r-=36 } return r };
const qrDataCw=v=>Math.floor(qrRaw(v)/8)-QR_ECC[v]*QR_BLK[v];
const gfMul=(x,y)=>{ let z=0; for(let i=7;i>=0;i--){ z=(z<<1)^((z>>>7)*0x11d); z^=((y>>>i)&1)*x } return z&255 };
function rsDiv(n){ const r=Array(n).fill(0); r[n-1]=1; let root=1; for(let i=0;i<n;i++){ for(let j=0;j<n;j++){ r[j]=gfMul(r[j],root); if(j+1<n) r[j]^=r[j+1] } root=gfMul(root,2) } return r }
function rsRem(data,div){ const r=div.map(()=>0); for(const b of data){ const f=b^r.shift(); r.push(0); div.forEach((d,i)=>r[i]^=gfMul(d,f)) } return r }
/** مصفوفة وحدات QR (true = داكن) */
export function qrMatrix(text){ const bytes=[...new TextEncoder().encode(String(text))];
 let v=1; for(;v<=20;v++){ const cap=qrDataCw(v)*8, need=4+(v<10?8:16)+bytes.length*8; if(need<=cap) break } if(v>20) throw new Error("النص طويل جداً لرمز QR");
 const bits=[], put=(val,n)=>{ for(let i=n-1;i>=0;i--) bits.push((val>>>i)&1) };
 put(4,4); put(bytes.length,v<10?8:16); bytes.forEach(b=>put(b,8)); const cap=qrDataCw(v)*8; put(0,Math.min(4,cap-bits.length)); put(0,(8-bits.length%8)%8);
 const data=[]; for(let i=0;i<bits.length;i+=8) data.push(parseInt(bits.slice(i,i+8).join(""),2)); for(let p=0xEC;data.length<qrDataCw(v);p^=0xEC^0x11) data.push(p);
 // تقسيم إلى كتل + تصحيح الأخطاء + التشابك
 const nb=QR_BLK[v], el=QR_ECC[v], raw=Math.floor(qrRaw(v)/8), nShort=nb-raw%nb, shortLen=Math.floor(raw/nb), div=rsDiv(el), blocks=[];
 for(let i=0,k=0;i<nb;i++){ const d=data.slice(k,k+shortLen-el+(i<nShort?0:1)); k+=d.length; const e=rsRem(d,div); if(i<nShort) d.push(0); blocks.push(d.concat(e)) }
 const cw=[]; for(let i=0;i<blocks[0].length;i++) blocks.forEach((b,j)=>{ if(i!==shortLen-el||j>=nShort) cw.push(b[i]) });
 const N=v*4+17, M=Array.from({length:N},()=>Array(N).fill(false)), F=Array.from({length:N},()=>Array(N).fill(false)), set=(x,y,d)=>{ M[y][x]=d; F[y][x]=true };
 for(let i=0;i<N;i++){ set(6,i,i%2===0); set(i,6,i%2===0) }
 for(const [x,y] of [[3,3],[N-4,3],[3,N-4]]) for(let dy=-4;dy<=4;dy++) for(let dx=-4;dx<=4;dx++){ const d=Math.max(Math.abs(dx),Math.abs(dy)), xx=x+dx, yy=y+dy; if(xx>=0&&xx<N&&yy>=0&&yy<N) set(xx,yy,d!==2&&d!==4) }
 if(v>1){ const n=Math.floor(v/7)+2, step=Math.ceil((v*4+4)/(n*2-2))*2, P=[6]; for(let p=N-7;P.length<n;p-=step) P.splice(1,0,p);
  P.forEach((a,i)=>P.forEach((b,j)=>{ if((i===0&&j===0)||(i===0&&j===n-1)||(i===n-1&&j===0)) return; for(let dy=-2;dy<=2;dy++) for(let dx=-2;dx<=2;dx++) set(a+dx,b+dy,Math.max(Math.abs(dx),Math.abs(dy))!==1) })) }
 const fmt=mask=>{ const d=(0<<3)|mask; let r=d; for(let i=0;i<10;i++) r=(r<<1)^((r>>>9)*0x537); const b=((d<<10)|r)^0x5412, g=i=>((b>>>i)&1)===1;
  for(let i=0;i<=5;i++) set(8,i,g(i)); set(8,7,g(6)); set(8,8,g(7)); set(7,8,g(8)); for(let i=9;i<15;i++) set(14-i,8,g(i));
  for(let i=0;i<8;i++) set(N-1-i,8,g(i)); for(let i=8;i<15;i++) set(8,N-15+i,g(i)); set(8,N-8,true) };
 fmt(0);
 if(v>=7){ let r=v; for(let i=0;i<12;i++) r=(r<<1)^((r>>>11)*0x1f25); const b=(v<<12)|r; for(let i=0;i<18;i++){ const bit=((b>>>i)&1)===1, a=N-11+i%3, c=Math.floor(i/3); set(a,c,bit); set(c,a,bit) } }
 let i=0; for(let right=N-1;right>=1;right-=2){ if(right===6) right=5; for(let vert=0;vert<N;vert++) for(let j=0;j<2;j++){ const x=right-j, up=((right+1)&2)===0, y=up?N-1-vert:vert; if(!F[y][x]&&i<cw.length*8){ M[y][x]=((cw[i>>>3]>>>(7-(i&7)))&1)===1; i++ } } }
 const MK=[(x,y)=>(x+y)%2===0,(x,y)=>y%2===0,(x,y)=>x%3===0,(x,y)=>(x+y)%3===0,(x,y)=>(Math.floor(x/3)+Math.floor(y/2))%2===0,(x,y)=>x*y%2+x*y%3===0,(x,y)=>(x*y%2+x*y%3)%2===0,(x,y)=>((x+y)%2+x*y%3)%2===0];
 const apply=m=>{ for(let y=0;y<N;y++) for(let x=0;x<N;x++) if(!F[y][x]&&MK[m](x,y)) M[y][x]=!M[y][x] };
 const pen=()=>{ let p=0, dark=0; for(let y=0;y<N;y++){ let rx=1,ry=1; for(let x=0;x<N;x++){ if(M[y][x]) dark++; if(x){ if(M[y][x]===M[y][x-1]){ rx++; if(rx===5) p+=3; else if(rx>5) p++ } else rx=1; if(M[x][y]===M[x-1][y]){ ry++; if(ry===5) p+=3; else if(ry>5) p++ } else ry=1 }
   if(x&&y&&M[y][x]===M[y-1][x]&&M[y][x]===M[y][x-1]&&M[y][x]===M[y-1][x-1]) p+=3 } } return p+Math.floor(Math.abs(dark*20-N*N*10)/(N*N))*10 };
 let best=0, bp=Infinity; for(let m=0;m<8;m++){ apply(m); fmt(m); const p=pen(); if(p<bp){ bp=p; best=m } apply(m) }
 apply(best); fmt(best); return M }
/** QR كـ SVG (هامش 4 وحدات) */
export function qrSVG(text,{fg="#000",bg="#fff",px=6}={}){ const M=qrMatrix(text), N=M.length, S=N+8; let d="";
 M.forEach((row,y)=>row.forEach((on,x)=>{ if(on) d+=`M${x+4} ${y+4}h1v1h-1z` }));
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}" width="${S*px}" height="${S*px}" shape-rendering="crispEdges"><rect width="${S}" height="${S}" fill="${bg}"/><path d="${d}" fill="${fg}"/></svg>` }
