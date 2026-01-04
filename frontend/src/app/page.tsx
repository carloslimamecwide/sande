import Link from "next/link";

export default function HomePage() {
  return (
    <div className="bg-gradient-to-b from-primary-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Bem-vindo à AutoMecânica</h1>
          <p className="text-xl text-gray-600 mb-8">Encontre o seu próximo carro com qualidade e confiança</p>

          <div className="flex gap-4 justify-center">
            <Link
              href="/cars"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Ver Carros Disponíveis
            </Link>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">🚗</div>
            <h3 className="text-xl font-semibold mb-2">Grande Variedade</h3>
            <p className="text-gray-600">Carros de todas as marcas e modelos para escolher</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-xl font-semibold mb-2">Qualidade Garantida</h3>
            <p className="text-gray-600">Todos os carros verificados e com garantia</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-semibold mb-2">Preços Competitivos</h3>
            <p className="text-gray-600">Os melhores preços do mercado</p>
          </div>
        </div>
      </div>
    </div>
  );
}
