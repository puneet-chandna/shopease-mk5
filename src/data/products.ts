export interface Product {
    _id: string;
    title: string;
    description: string;
    price: number;
    stock: number;
    image: string;  
  }
  
  export const products: Product[] = [
    {
      _id: "1",
      title: "Iphone 16",
      description: "The latest smartphone with advanced features and a powerful camera.",
      price: 699.99,
      stock: 50,
      image: "/placeholder.svg?height=300&width=300"
    },
    {
      _id: "2",
      title: "Lenovo ThinkPad X1 Carbon",
      description: "High-performance laptop for professionals and power users.",
      price: 1299.99,
      stock: 30,
      image: "/placeholder.svg?height=300&width=300"
    },
    {
      _id: "3",
      title: "Wireless Airpods",
      description: "True wireless earbuds with noise cancellation and long battery life.",
      price: 149.99,
      stock: 100,
      image: "/placeholder.svg?height=300&width=300"
    },
    {
      _id: "4",
      title: "Smart Watch",
      description: "Fitness tracker and smartwatch with heart rate monitoring and GPS.",
      price: 199.99,
      stock: 75,
      image: "/placeholder.svg?height=300&width=300"
    },
    {
      _id: "5",
      title: "4K TV",
      description: "55-inch 4K Ultra HD Smart TV with HDR and built-in streaming apps.",
      price: 599.99,
      stock: 25,
      image: "/placeholder.svg?height=300&width=300"
    }
  ];