export type CaseItem = {
  id: number
  title: string
  status: string
  createdAt: string
  summary: string
  applicantName: string
  postalCode: string
  original_cv_url: string
  redacted_cv_url: string
  email_subject: string
  email_body: string
  confirm_url?: string
  contacts: { firma: string; email: string; plz: string }[]
}

// Simple in-memory store. Resets on server restart.
export const casesStore: CaseItem[] = []


