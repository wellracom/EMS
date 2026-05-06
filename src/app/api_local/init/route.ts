export const runtime = "nodejs"

import { initApp } from "@/lib/init"

export async function GET() {
  await initApp()
  return Response.json({ ok: true })
}