export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";

export function getImageUrl(imageId: string): string {
  return `${API_BASE}/images/${imageId}`;
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
