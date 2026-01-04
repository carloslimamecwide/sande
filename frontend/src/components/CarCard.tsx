import Link from "next/link";
import { Car } from "@/lib/types";
import { formatPrice, formatMileage, getImageUrl } from "@/lib/utils";

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  const primaryImage = car.images[0];

  return (
    <Link href={`/cars/${car.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
        <div className="relative h-48 bg-gray-200">
          {primaryImage ? (
            <img src={getImageUrl(primaryImage.id)} alt={car.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">Sem imagem</div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{car.title}</h3>

          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>{car.year}</span>
            <span>{formatMileage(car.mileage)}</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">
              {car.fuel} • {car.transmission}
            </div>
            <div className="text-xl font-bold text-primary-600">{formatPrice(Number(car.price))}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
