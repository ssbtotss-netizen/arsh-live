// مكتبة الأغاني لصانع المحتوى + روابط صفحة الطلب ومشغل OBS
import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { musicStore, musicUsed, songTokenOf, MUSIC_LIMITS } from "@/server/music-store";
import { libEntry } from "@/server/music-svc";
import { ffmpegPath } from "@/server/media";
export const dynamic = "force-dynamic";
export async function GET() {
  const u = await currentUser(); if (!u) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const [rows, used, tok] = await Promise.all([musicStore.tracks(u.id), musicUsed(u.id), songTokenOf(u.id)]);
  return NextResponse.json({ tracks: rows.map(t => ({ ...libEntry(t), size: t.size })), used, quota: MUSIC_LIMITS.quota, maxFile: MUSIC_LIMITS.file, converter: !!ffmpegPath(),
    links: { request: `/sr/${tok}`, player: `/music-player/${u.overlayToken}` } });
}
