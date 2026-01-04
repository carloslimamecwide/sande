import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            AutoMecânica
          </Link>

          <div className="flex gap-6">
            <Link href="/" className="text-gray-700 hover:text-primary-600">
              Início
            </Link>
            <Link href="/cars" className="text-gray-700 hover:text-primary-600">
              Carros
            </Link>
            <Link href="/admin/login" className="text-gray-700 hover:text-primary-600">
              Admin
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
