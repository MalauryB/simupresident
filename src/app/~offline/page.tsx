export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="mb-4 text-3xl font-bold text-gray-900">
        Hors connexion
      </h1>
      <p className="text-center text-lg text-gray-600">
        Vous semblez ne pas avoir de connexion internet. Veuillez vérifier votre
        connexion et réessayer.
      </p>
    </div>
  );
}
