import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, MoreHorizontal, Smartphone, Headphones, Laptop } from "lucide-react"

export function ProductList() {
  const products = [
    {
      id: 1,
      name: "Iphone 13 Pro",
      type: "Mobile",
      price: "$1,300.00",
      status: "In Stock",
      icon: <Smartphone className="h-4 w-4" />
    },
    {
      id: 2,
      name: "Apple airpod",
      type: "Airpod",
      price: "$1,200.00", 
      status: "Out of stock",
      icon: <Headphones className="h-4 w-4" />
    },
    {
      id: 3,
      name: "Macbook 2",
      type: "Laptop",
      price: "$2,300.00",
      status: "In Stock",
      icon: <Laptop className="h-4 w-4" />
    }
  ]

  return (
    <Card className="bg-card shadow-card border-0">
      <CardHeader className="space-y-4">
        <CardTitle className="text-lg font-semibold">Product List</CardTitle>
        
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search here" className="pl-9" />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Table Header */}
          <div className="grid grid-cols-5 gap-4 text-sm font-medium text-muted-foreground border-b pb-2">
            <div>Product</div>
            <div>Type</div>
            <div>Price</div>
            <div>Status</div>
            <div>Action</div>
          </div>
          
          {/* Table Rows */}
          <div className="space-y-3">
            {products.map((product) => (
              <div key={product.id} className="grid grid-cols-5 gap-4 items-center py-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                    {product.icon}
                  </div>
                  <span className="font-medium">{product.name}</span>
                </div>
                
                <div className="text-muted-foreground">{product.type}</div>
                
                <div className="font-medium text-primary">{product.price}</div>
                
                <div>
                  <Badge 
                    variant={product.status === "In Stock" ? "default" : "destructive"}
                    className={product.status === "In Stock" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                  >
                    {product.status}
                  </Badge>
                </div>
                
                <div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}