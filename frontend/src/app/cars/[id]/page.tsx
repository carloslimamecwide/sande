"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";
import api from "@/lib/api";
import { Car } from "@/lib/types";
import { formatPrice, formatMileage, getImageUrl } from "@/lib/utils";

export default function CarDetailPage() {
  const params = useParams();
  const carId = params.id as string;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const {
    data: car,
    isLoading,
    error,
  } = useQuery<Car>({
    queryKey: ["car", carId],
    queryFn: async () => {
      const response = await api.get(`/api/cars/${carId}`);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">A carregar...</div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">Carro não encontrado</div>
      </div>
    );
  }

  const selectedImage = car.images[selectedImageIndex];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="bg-gray-200 rounded-lg overflow-hidden mb-4">
            {selectedImage ? (
              <img src={getImageUrl(selectedImage.id)} alt={car.title} className="w-full h-96 object-cover" />
            ) : (
              <div className="w-full h-96 flex items-center justify-center text-gray-400">Sem imagem</div>
            )}
          </div>

          {car.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {car.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`rounded-lg overflow-hidden border-2 ${
                    index === selectedImageIndex ? "border-primary-600" : "border-transparent"
                  }`}
                >
                  <img
                    src={getImageUrl(image.id)}
                    alt={`${car.title} - ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{car.title}</h1>

          <div className="text-4xl font-bold text-primary-600 mb-6">{formatPrice(Number(car.price))}</div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">Marca</div>
                <div className="font-semibold">{car.make}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Modelo</div>
                <div className="font-semibold">{car.model}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Ano</div>
                <div className="font-semibold">{car.year}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Quilómetros</div>
                <div className="font-semibold">{formatMileage(car.mileage)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Combustível</div>
                <div className="font-semibold">{car.fuel}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Transmissão</div>
                <div className="font-semibold">{car.transmission}</div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Descrição</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{car.description}</p>
          </div>

          <button className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
            Contactar Vendedor
          </button>
        </div>
      </div>
    </div>
  );
}
