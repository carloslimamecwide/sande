export interface Car {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel: string;
  transmission: string;
  description: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  images: CarImage[];
}

export interface CarImage {
  id: string;
  filename: string;
  mimeType: string;
  sortOrder: number;
}

export interface User {
  id: string;
  email: string;
  role: string;
}

export interface PaginatedCars {
  cars: Car[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
