export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export function getImageUrl(imageId: string): string {
  return `${API_URL}/api/images/${imageId}`;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
  }).format(price);
}

export function formatMileage(mileage: number): string {
  return new Intl.NumberFormat("pt-PT").format(mileage) + " km";
}
