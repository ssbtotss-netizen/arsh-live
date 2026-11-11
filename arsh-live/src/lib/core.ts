// واجهة TypeScript للمحركات المشتركة (نفس الملفات تُبنى أيضاً في لوحة التحكم ووضع التجربة)
// @ts-nocheck
export * from "../engine/defs.js";
export * from "../engine/leaderboard.js";
export * from "../engine/clock.js";
export * from "../engine/donations.js";
export * from "../engine/room.js";
export * from "../engine/socials.js";
export * from "../engine/lb.js";
export * from "../engine/view.js";
export * from "../engine/lbview.js";
export * from "../engine/rboard.js";
export * from "../engine/vgoal.js";
export * from "../engine/vgoal80.js";
export * from "../engine/bots.js";
export * from "../engine/botview.js";
export * from "../engine/followers.js";
export * from "../engine/fcview.js";
export * from "../engine/latest.js";
export * from "../engine/tops.js";
export * from "../engine/events.js";
export * from "../engine/lb_bars.js";
export * from "../engine/chat.js";
export * from "../engine/music.js";
export * from "../engine/actions.js";
export * from "../engine/actview.js";
export * from "../engine/platforms.js";
export * from "../engine/notify.js";
export * from "../engine/poststats.js";
export * from "../engine/bio.js";
export * from "../engine/le_kit.js";
export * from "../engine/le_crystal.js";
export * from "../engine/le_gaming.js";
export * from "../engine/le_saudi.js";
export * from "../engine/le_b6o6.js";
export * from "../engine/qr.js";
export * from "../engine/plans.js";
export * from "../engine/fc_designs.js";
export * from "../engine/fachars.js";
export * from "../engine/lb_art.js";
export * from "../engine/faview.js";
export * from "../engine/chatview.js";
export * from "../engine/musicview.js";
export * from "../engine/leview.js";
export * from "../engine/le5.js";
export * from "../engine/le_nature.js";
export * from "../engine/le_royal.js";
export * from "../engine/le_space.js";
export * from "../engine/le_fire.js";
export * from "../engine/dtext.js";

export type LiveUser = { id: string; name: string; avatar?: string };
export type LiveEvent =
  | { type: "like"; id?: string; user: LiveUser; count: number; t?: number }
  | { type: "gift"; id?: string; user: LiveUser; value: number; count?: number; gift?: string; giftId?: number | string; diamonds?: number; big?: boolean; t?: number }
  | { type: "comment"; id?: string; user: LiveUser; text: string; t?: number }
  | { type: "follow"; id?: string; user: LiveUser; t?: number }
  | { type: "subscribe"; id?: string; user: LiveUser; t?: number }
  | { type: "reset"; scope: string; t?: number }
  | { type: "shuffle"; scope: string; t?: number };
export type Widget = { id: string; type: string; x: number; y: number; w: number; h: number; z: number; [k: string]: any };
export type Layout = { id: string; name: string; canvas: "vertical" | "horizontal" | "square"; widgets: Widget[] };
