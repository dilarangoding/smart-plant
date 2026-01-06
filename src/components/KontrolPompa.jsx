export default function KontrolPompa({ statusPompa, kelembabanTanah, onToggle, sedangMemuat }) {
    const tanahBasah = kelembabanTanah !== null && kelembabanTanah > 70;
    const disabled = tanahBasah || sedangMemuat;

    return (
        <div className="w-full bg-white border border-emerald-300 rounded-2xl p-6 sm:p-8">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2 mb-4 sm:mb-6">
                💧 Kontrol Pompa Air
            </h3>

            <div className="flex flex-col gap-4 sm:gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3 bg-emerald-50 px-4 py-3 rounded-xl w-full sm:w-auto">
                    <span className={`w-3 h-3 rounded-full flex-shrink-0 ${statusPompa ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                    <span className="font-semibold text-gray-700">
                        Status: {statusPompa ? <span className="text-emerald-600">MENYALA</span> : <span className="text-gray-500">MATI</span>}
                    </span>
                </div>

                <div className="flex flex-col gap-3 w-full sm:w-auto">
                    <button
                        onClick={onToggle}
                        disabled={disabled}
                        className={`w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg text-white transition-colors
              ${disabled
                                ? 'bg-gray-400 cursor-not-allowed'
                                : statusPompa
                                    ? 'bg-gray-600 hover:bg-gray-700'
                                    : 'bg-emerald-600 hover:bg-emerald-700'
                            }`}
                    >
                        {sedangMemuat ? 'Memproses...' : statusPompa ? 'Matikan' : 'Nyalakan'}
                    </button>
                    {tanahBasah && (
                        <p className="text-sm text-amber-700 bg-amber-50 px-4 py-2 rounded-lg flex items-center gap-2">
                            ⚠️ Tanah sudah basah. Penyiraman manual dinonaktifkan.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
