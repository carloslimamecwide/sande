"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Car } from "@/lib/types";
import { getImageUrl } from "@/lib/utils";

const carSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  make: z.string().min(1, "Marca é obrigatória"),
  model: z.string().min(1, "Modelo é obrigatório"),
  year: z.string().regex(/^\d{4}$/, "Ano inválido"),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Preço inválido"),
  mileage: z.string().regex(/^\d+$/, "Quilómetros inválido"),
  fuel: z.string().min(1, "Combustível é obrigatório"),
  transmission: z.string().min(1, "Transmissão é obrigatória"),
  description: z.string().min(1, "Descrição é obrigatória"),
  isPublished: z.boolean(),
});

type CarForm = z.infer<typeof carSchema>;

export default function EditCarPage() {
  const router = useRouter();
  const params = useParams();
  const carId = params.id as string;
  const queryClient = useQueryClient();

  const [files, setFiles] = useState<FileList | null>(null);
  const [error, setError] = useState("");

  const { data: car, isLoading } = useQuery<Car>({
    queryKey: ["admin-car", carId],
    queryFn: async () => {
      const response = await api.get(`/api/cars/${carId}`);
      return response.data;
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CarForm>({
    resolver: zodResolver(carSchema),
    values: car
      ? {
          title: car.title,
          make: car.make,
          model: car.model,
          year: String(car.year),
          price: String(car.price),
          mileage: String(car.mileage),
          fuel: car.fuel,
          transmission: car.transmission,
          description: car.description,
          isPublished: car.isPublished,
        }
      : undefined,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: CarForm) => {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      if (files) {
        Array.from(files).forEach((file) => {
          formData.append("images", file);
        });
      }

      const response = await api.put(`/api/admin/cars/${carId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      router.push("/admin");
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || "Erro ao atualizar carro");
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: async (imageId: string) => {
      await api.delete(`/api/admin/cars/${carId}/images/${imageId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-car", carId] });
    },
  });

  const onSubmit = (data: CarForm) => {
    setError("");
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return <div className="p-8 text-center">A carregar...</div>;
  }

  if (!car) {
    return <div className="p-8 text-center text-red-600">Carro não encontrado</div>;
  }

  const handleDeleteImage = (imageId: string) => {
    if (confirm("Tem a certeza que deseja eliminar esta imagem?")) {
      deleteImageMutation.mutate(imageId);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Editar Carro</h1>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}

      {/* Imagens atuais */}
      {car.images.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Imagens Atuais</h2>
          <div className="grid grid-cols-4 gap-4">
            {car.images.map((image) => (
              <div key={image.id} className="relative">
                <img src={getImageUrl(image.id)} alt={image.filename} className="w-full h-24 object-cover rounded" />
                <button
                  onClick={() => handleDeleteImage(image.id)}
                  className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full text-xs hover:bg-red-700"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
            <input
              {...register("title")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Marca *</label>
            <input
              {...register("make")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            {errors.make && <p className="text-red-600 text-sm mt-1">{errors.make.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Modelo *</label>
            <input
              {...register("model")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            {errors.model && <p className="text-red-600 text-sm mt-1">{errors.model.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ano *</label>
            <input
              {...register("year")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            {errors.year && <p className="text-red-600 text-sm mt-1">{errors.year.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preço (€) *</label>
            <input
              {...register("price")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quilómetros *</label>
            <input
              {...register("mileage")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            {errors.mileage && <p className="text-red-600 text-sm mt-1">{errors.mileage.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Combustível *</label>
            <select
              {...register("fuel")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="Gasolina">Gasolina</option>
              <option value="Diesel">Diesel</option>
              <option value="Híbrido">Híbrido</option>
              <option value="Elétrico">Elétrico</option>
              <option value="GPL">GPL</option>
            </select>
            {errors.fuel && <p className="text-red-600 text-sm mt-1">{errors.fuel.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Transmissão *</label>
            <select
              {...register("transmission")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="Manual">Manual</option>
              <option value="Automática">Automática</option>
            </select>
            {errors.transmission && <p className="text-red-600 text-sm mt-1">{errors.transmission.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
          <textarea
            {...register("description")}
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
          {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Adicionar Novas Imagens (opcional)</label>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            onChange={(e) => setFiles(e.target.files)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          {files && <p className="text-sm text-gray-600 mt-1">{files.length} ficheiro(s) selecionado(s)</p>}
        </div>

        <div className="flex items-center">
          <input
            {...register("isPublished")}
            type="checkbox"
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700">Publicado</label>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {updateMutation.isPending ? "A guardar..." : "Guardar Alterações"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
