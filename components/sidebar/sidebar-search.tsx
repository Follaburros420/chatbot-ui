import { ContentType } from "@/types"
import { FC } from "react"
import { Input } from "../ui/input"

interface SidebarSearchProps {
  contentType: ContentType
  searchTerm: string
  setSearchTerm: (term: string) => void; // Updated type annotation
}

export const SidebarSearch: FC<SidebarSearchProps> = ({
  contentType,
  searchTerm,
  setSearchTerm
}) => {
  return (
    <Input
placeholder={`Buscar ${contentType}...`}
      value={searchTerm}
onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)} // Added type annotation
    />
  )
}
