import { NextResponse } from "next/server"
import { casesStore, type CaseItem } from "@/lib/casesStore"

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const token = process.env.CASES_TOKEN
  if (token && req.headers.get("x-cases-token") !== token) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const idNum = Number(params.id)
  if (!Number.isFinite(idNum)) {
    return NextResponse.json({ error: "invalid_id" }, { status: 400 })
  }

  let payload: Partial<CaseItem>
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 })
  }

  const idx = casesStore.findIndex((c) => c.id === idNum)
  if (idx === -1) {
    return NextResponse.json({ error: "not_found" }, { status: 404 })
  }

  const updated = { ...casesStore[idx], ...payload }
  casesStore[idx] = updated

  return NextResponse.json({ ok: true, case: updated })
}


