# يولّد arsh-live/public/academy/index.json من بيانات الحلقات (فقط الحلقات المصدّرة فعلياً)
import json, glob, os, re
HERE = os.path.dirname(os.path.abspath(__file__)); PUB = os.path.join(HERE, "..", "..", "arsh-live", "public", "academy")
# صفحات إضافية مرتبطة بكل حلقة (زر «تعلّم الميزة» يظهر فيها أيضاً)
EXTRA = {"intro": ["home"], "connect": ["live", "connections"], "studio": ["studio"], "likes": ["likes", "library"], "supporters": ["gifts", "boards"], "alerts": ["alerts", "falerts"],
         "sounds": ["sounds"], "subathon": ["subathon"], "goals": ["-"], "challenges": ["-"], "followers": ["followers"], "layers": ["layers"], "latest": ["latest"],
         "uchat": ["chatcfg", "comments"], "floatchat": ["-"], "moderation": ["livechat"], "music": ["music"], "poststats": ["poststats", "stats"], "duration": ["duration", "timers"],
         "share": ["layouts"], "obs": ["obs"], "livestudio": ["-"], "billing": ["billing", "account"], "actions": ["actions"], "donations": ["donations", "donalerts", "dondiag"],
         "bots": ["bots"], "socials": ["socials"], "bio": ["bio"], "community": ["community"]}
eps = []
for mf in sorted(glob.glob(os.path.join(HERE, "episodes", "v2", "*.meta.json"))):
    m = json.load(open(mf, encoding="utf-8")); n = f"{m['num']:02d}-{m['slug']}"
    if not os.path.exists(os.path.join(PUB, n + ".mp4")): continue
    pages = list(dict.fromkeys(EXTRA.get(m["slug"], [m["page"]]) or [m["page"]]))
    eps.append(dict(num=m["num"], slug=m["slug"], title=m["title"], hook=(m.get("hook") or "").replace("*", "").replace("|", " "), desc=m.get("desc", ""),
                    cat=re.sub(r"^\d+-", "", m["folder"]), page=m["page"], pages=pages, video=n + ".mp4", poster=n + ".jpg", dur=59))
os.makedirs(PUB, exist_ok=True); json.dump(dict(v=1, eps=eps), open(os.path.join(PUB, "index.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(len(eps), "episodes:", ", ".join(e["slug"] for e in eps))
