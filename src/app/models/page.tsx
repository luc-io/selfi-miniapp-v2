import { Metadata } from "next"
import { ModelsPage } from "@/components/models/models-page"

export const metadata: Metadata = {
  title: "Models | Selfi",
  description: "Browse and use community-created Lora models",
}

export default async function Page() {
  return <ModelsPage />
}