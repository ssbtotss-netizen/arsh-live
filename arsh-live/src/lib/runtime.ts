// الخدمات التي يشغّلها server.ts (المركز اللحظي والتبرعات) — متاحة لمسارات API في نفس العملية
import type { DonationService } from "../server/donations/service";
export type Runtime = { donations: DonationService; connectors: { restart(userId: string, kind: string): Promise<void> }; hub?: { stats(room: string): any } };
export function runtime(): Runtime {
  const r = (globalThis as any).__b6o6;
  if (!r) throw new Error("شغّل المنصة عبر server.ts (npm run dev) وليس next dev");
  return r;
}
