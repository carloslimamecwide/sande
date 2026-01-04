"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { User, Car } from "@/lib/types";
import { formatPrice, getImageUrl } from "@/lib/utils";

export default function AdminDashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: user, isLoading: userLoading } = useQuery<{ user: User }>({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await api.get("/api/auth/me");
      return response.data;
    },
    retry: false,
  });

  const { data: carsData, isLoading: carsLoading } = useQuery<{ cars: Car[] }>({
    queryKey: ["admin-cars"],
    queryFn: async () => {
      const response = await api.get("/api/admin/cars");
      return response.data;
    },
    enabled: !!user,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await api.post("/api/auth/logout");
    },
    onSuccess: () => {
      router.push("/admin/login");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/admin/cars/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-cars"] });
    },
  });

  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/admin/login");
    }
  }, [user, userLoading, router]);

  if (userLoading) {
    return <div className="p-8 text-center">A carregar...</div>;
  }

  if (!user) {
    return null;
  }

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Tem a certeza que deseja eliminar "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Bem-vindo, {user.user.email}</p>
        </div>

        <div className="flex gap-4">
          <Link
            href="/admin/cars/new"
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Adicionar Carro
          </Link>
          <button
            onClick={() => logoutMutation.mutate()}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Sair
          </button>
        </div>
      </div>

      {carsLoading ? (
        <div className="text-center py-12">A carregar carros...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Imagem</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marca/Modelo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preço</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {carsData?.cars.map((car) => (
                <tr key={car.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {car.images[0] ? (
                      <img
                        src={getImageUrl(car.images[0].id)}
                        alt={car.title}
                        className="h-12 w-16 object-cover rounded"
                      />
                    ) : (
                      <div className="h-12 w-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">
                        Sem img
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{car.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {car.make} {car.model}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatPrice(Number(car.price))}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        car.isPublished ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {car.isPublished ? "Publicado" : "Rascunho"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/admin/cars/${car.id}/edit`} className="text-primary-600 hover:text-primary-900 mr-4">
                      Editar
                    </Link>
                    <button onClick={() => handleDelete(car.id, car.title)} className="text-red-600 hover:text-red-900">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {carsData?.cars.length === 0 && (
            <div className="text-center py-12 text-gray-600">Nenhum carro adicionado ainda</div>
          )}
        </div>
      )}
    </div>
  );
}
