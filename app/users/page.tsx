import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { UserList } from "@/components/users/user-list"
import { getUsers } from "@/lib/actions/users";
import { CreateUserForm } from "@/components/users/create-user-form";

export default async function UsersPage() {
  // Fetch users on the server
  const users = await getUsers();

  return (
    <div className="flex flex-col gap-6 p-6 w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-medium tracking-tight text-foreground">Users</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage user access and permissions</p>
        </div>
        {/* <div className="animate-fade-in" style={{ animationDelay: "0.05s" }}>
          <CreateUserForm />
        </div> */}
      </div>

      <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <UserList users={users} />
      </div>
    </div>
  )
}
