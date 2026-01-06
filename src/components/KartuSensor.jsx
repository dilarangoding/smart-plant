export default function KartuSensor({ ikon, judul, nilai, satuan }) {
    return (
        <div className="w-full bg-white border border-emerald-300 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center">
            <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">{ikon}</div>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2 sm:mb-3 text-center">
                {judul}
            </p>
            <p className="text-3xl sm:text-4xl font-bold text-gray-800">
                {nilai !== null ? nilai : '--'}
                <span className="text-lg sm:text-xl text-emerald-600 ml-1">{satuan}</span>
            </p>
        </div>
    );
}
