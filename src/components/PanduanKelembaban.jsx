export default function PanduanKelembaban() {
    const data = [
        { range: '0 - 30%', label: 'Kering', desc: 'Perlu disiram' },
        { range: '31 - 70%', label: 'Optimal', desc: 'Kondisi ideal' },
        { range: '71 - 100%', label: 'Basah', desc: 'Tidak perlu disiram' },
    ];

    return (
        <div className="w-full bg-emerald-50 border border-emerald-300 rounded-2xl p-6 sm:p-8">
            <h3 className="text-base sm:text-lg font-bold text-emerald-800 mb-4 sm:mb-6 flex items-center gap-2">
                📖 Panduan Kelembaban Tanah
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {data.map((item) => (
                    <div key={item.range} className="bg-white p-4 sm:p-5 rounded-xl border border-emerald-200 text-center">
                        <p className="font-bold text-emerald-700 text-base sm:text-lg">{item.range}</p>
                        <p className="text-gray-600 text-xs sm:text-sm mt-1">{item.label} — {item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
