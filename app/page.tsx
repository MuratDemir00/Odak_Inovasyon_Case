export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-900 text-white">
      <div className="text-center p-10 bg-neutral-800 rounded-2xl shadow-xl border border-neutral-700 max-w-md">

        <h1 className="text-3xl font-bold mb-4">
          MURAT DEMİR        </h1>

        <p className="text-neutral-300 mb-6">
          Kullanıcı yönetimi ve sipariş süreçlerinizi kolayca yönetin.
        </p>

        <a
          href="/login"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold inline-block transition"
        >
          Sisteme Giriş Yap
        </a>

      </div>
    </div>
  );
}
