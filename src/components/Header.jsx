export default function Header({ terhubung }) {
    return (
        <header className="w-full bg-emerald-600">
            <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                            🌱 Sistem Penyiraman Tanaman
                        </h1>
                        <p className="text-emerald-100 mt-2 text-sm sm:text-base">
                            Dashboard IoT untuk Monitoring Tanaman Cerdas
                        </p>
                    </div>
                    <div className={`self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold
            ${terhubung
                            ? 'bg-white text-emerald-700'
                            : 'bg-emerald-500 text-white'
                        }`}>
                        <span className={`w-2 h-2 rounded-full ${terhubung ? 'bg-emerald-500' : 'bg-white animate-pulse'}`} />
                        {terhubung ? 'Terhubung' : 'Menghubungkan...'}
                    </div>
                </div>
            </div>
        </header>
    );
}
