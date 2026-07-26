import { BookOpen, Home, StickyNote, Users } from "lucide-react"

import { SidebarAppearance } from "@/components/Common/Appearance"
import { Logo } from "@/components/Common/Logo"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import useAuth from "@/hooks/useAuth"
import { type Item, Main } from "./Main"
import { User } from "./User"

export function AppSidebar() {
  const { user: currentUser } = useAuth()

  // Role-based navigation. Screen groups (student/teacher) are added to this
  // list as their routes are built.
  const items: Item[] = [{ icon: Home, title: "Dashboard", path: "/" }]
  if (currentUser?.role === "student") {
    items.push({ icon: BookOpen, title: "My Courses", path: "/courses" })
    items.push({ icon: StickyNote, title: "Notes", path: "/notes" })
  }
  if (currentUser?.role === "teacher") {
    items.push({ icon: BookOpen, title: "Teaching", path: "/teach" })
  }
  if (currentUser?.is_superuser || currentUser?.role === "admin") {
    items.push({ icon: Users, title: "Admin", path: "/admin" })
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-4 py-6 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:items-center">
        <Logo variant="responsive" />
      </SidebarHeader>
      <SidebarContent>
        <Main items={items} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarAppearance />
        <User user={currentUser} />
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
