import { redirect } from "next/navigation"

export default function PlanProfesionalRedirect({ params }: { params: { locale: string } }) {
  redirect(`/${params.locale}/pricing`)
}
