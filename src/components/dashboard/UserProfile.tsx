import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function UserProfile() {
  return (
    <div className="flex items-center gap-3 p-4">
      <Avatar className="h-10 w-10">
        <AvatarImage src="/lovable-uploads/2414e017-2418-41be-8487-f3826ccf16e3.png" />
        <AvatarFallback>RC</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">Rupak Chakraborty</p>
        <p className="text-xs text-muted-foreground truncate">rupakcb76@gmail.com</p>
      </div>
    </div>
  )
}