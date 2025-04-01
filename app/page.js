import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-blue-900">
      <div className="p-12 bg-gray-800 rounded-md shadow-xl border-t-4 border-blue-700 max-w-2xl w-full">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-1 bg-blue-700"></div>
          <div className="w-1 h-16 bg-blue-700 mx-6"></div>
          <div className="w-16 h-1 bg-blue-700"></div>
        </div>
        
        <h1 className="text-6xl font-bold text-center text-white tracking-tight">
          BIMBELKU
        </h1>
        
        <p className="mt-4 text-2xl text-center font-medium text-blue-400">
          by Kelompok 12
        </p>
        
        <p className="mt-2 text-xl text-center font-medium text-gray-300">
          Pengantar Keamanan Perangkat Lunak
        </p>
        
        <div className="mt-8 flex items-center justify-center">
          <div className="w-16 h-1 bg-blue-700"></div>
          <div className="w-1 h-16 bg-blue-700 mx-6"></div>
          <div className="w-16 h-1 bg-blue-700"></div>
        </div>
      </div>
    </div>
  );
}