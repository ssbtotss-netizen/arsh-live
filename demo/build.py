# يبني demo/index.html من: القالب + أنماط المشروع + محركات المشروع (مصدر واحد للكود) + كود اللوحة
import re, pathlib
root=pathlib.Path(__file__).resolve().parent; src=root.parent/'arsh-live'/'src'
eng=''
for f in ['defs','leaderboard','clock','donations','latest','tops','poststats','events','platforms','notify','plans','room','bio','socials','lb','lb_bars','bots','chat','music','actions','followers','view','lbview','rboard','vgoal','vgoal80','botview','fcview','fc_designs','leview','le5','le_nature','le_royal','le_space','le_fire','le_kit','le_crystal','le_gaming','le_saudi','le_b6o6','qr','fachars','faview','dtext','chatview','musicview','actview']:
    t=(src/'engine'/f'{f}.js').read_text(encoding='utf-8')
    t=re.sub(r'^import .*?;\s*$','',t,flags=re.M)
    t=re.sub(r'^export (?=const|function|class|let)','',t,flags=re.M)
    eng+=f'\n/* ---- engine/{f}.js ---- */\n'+t
tpl=(root/'template.html').read_text(encoding='utf-8')
head=tpl.split('/*@@ENGINE@@*/')[0]
out=head.replace('/*@@APP_CSS@@*/',(src/'styles'/'app.css').read_text(encoding='utf-8')).replace('/*@@OVERLAY_CSS@@*/',(src/'styles'/'overlay.css').read_text(encoding='utf-8'))
out+=eng+'\n'+(root/'app.js').read_text(encoding='utf-8')
(root/'index.html').write_text(out,encoding='utf-8'); print('built',len(out))

# حزمة لوحة التحكم داخل منصة Next.js (نفس الكود المختبر)
app=(root/'app.js').read_text(encoding='utf-8').split('</script>')[0]
bundle='"use strict";\n(function(){\n'+eng+'\n'+app+'\n})();\n'
pub=root.parent/'arsh-live'/'public'; pub.mkdir(exist_ok=True)
(pub/'b6o6-dashboard.js').write_text(bundle,encoding='utf-8'); print('bundle',len(bundle))
