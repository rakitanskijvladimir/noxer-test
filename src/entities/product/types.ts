export interface Product {
  id: number
  name: string
  price: number
  image: string
  description: string
  category: string
}

export interface ProductsResponse {
  products: Product[]
  total: number
  page: number
  per_page: number
}