import { useState, useEffect } from 'react';
import { database, ref, onValue, set } from './firebase';

const SOIL_KERING_MAX = 20;
const SOIL_NORMAL_MAX = 75;

function App() {
  const [dataSensor, setDataSensor] = useState({
    temperature: null,
    humidity: null,
    soil_moisture: null
  });
  const [statusPompa, setStatusPompa] = useState(false);
  const [sedangMemuat, setSedangMemuat] = useState(false);
  const [terhubung, setTerhubung] = useState(false);

  useEffect(() => {
    const sensorsRef = ref(database, 'sensors');
    const unsubscribe = onValue(sensorsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setDataSensor({
          temperature: data.temperature ?? null,
          humidity: data.humidity ?? null,
          soil_moisture: data.soil_moisture ?? null
        });
        setTerhubung(true);
      }
    }, () => setTerhubung(false));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const pumpRef = ref(database, 'controls/pump_state');
    const unsubscribe = onValue(pumpRef, (snapshot) => {
      setStatusPompa(snapshot.val() === true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (dataSensor.soil_moisture === null) return;

    const moisture = dataSensor.soil_moisture;
    const pumpRef = ref(database, 'controls/pump_state');

    if (moisture <= SOIL_KERING_MAX) {
      set(pumpRef, true);
    } else if (moisture > SOIL_NORMAL_MAX) {
      set(pumpRef, false);
    }
  }, [dataSensor.soil_moisture]);

  const handleTogglePompa = async () => {
    setSedangMemuat(true);
    try {
      const pumpRef = ref(database, 'controls/pump_state');
      await set(pumpRef, !statusPompa);
    } catch (error) {
      alert('Gagal mengubah status pompa.');
    } finally {
      setSedangMemuat(false);
    }
  };

  const moisture = dataSensor.soil_moisture;
  const isKering = moisture !== null && moisture <= SOIL_KERING_MAX;
  const isBasah = moisture !== null && moisture > SOIL_NORMAL_MAX;
  const isNormal = moisture !== null && moisture > SOIL_KERING_MAX && moisture <= SOIL_NORMAL_MAX;
  const tombolDisabled = isKering || isBasah || sedangMemuat;

  const getStatusTanah = () => {
    if (moisture === null) return { text: 'Memuat...', color: '#6b7280' };
    if (isKering) return { text: 'Kering', color: '#dc2626' };
    if (isBasah) return { text: 'Basah', color: '#2563eb' };
    return { text: 'Normal', color: '#16a34a' };
  };

  const statusTanah = getStatusTanah();

  const containerStyle = {
    maxWidth: '960px',
    margin: '0 auto',
    padding: '0 20px'
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#fafafa',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>

      <nav style={{
        backgroundColor: '#166534',
        padding: '16px 0',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ ...containerStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: 'white' }}>
            <div style={{ fontSize: '18px', fontWeight: 600 }}>🌱 Smart Plant</div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '2px' }}>Sistem Penyiraman Otomatis</div>
          </div>
          <div style={{
            fontSize: '12px',
            padding: '6px 12px',
            borderRadius: '4px',
            backgroundColor: terhubung ? '#22c55e' : '#fbbf24',
            color: terhubung ? 'white' : '#1f2937',
            fontWeight: 500
          }}>
            {terhubung ? '● Online' : '○ Connecting...'}
          </div>
        </div>
      </nav>

      <main style={{ ...containerStyle, paddingTop: '32px', paddingBottom: '48px' }}>

        <section style={{ marginBottom: '40px' }}>
          <div style={{
            fontSize: '13px',
            fontWeight: 600,
            color: '#166534',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '16px'
          }}>
            Data Sensor
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div style={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '20px 16px'
              }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>Suhu</div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#1f2937' }}>
                  {dataSensor.temperature ?? '--'}
                  <span style={{ fontSize: '14px', color: '#9ca3af', marginLeft: '4px' }}>°C</span>
                </div>
              </div>

              <div style={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '20px 16px'
              }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>Kelembaban Udara</div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#1f2937' }}>
                  {dataSensor.humidity ?? '--'}
                  <span style={{ fontSize: '14px', color: '#9ca3af', marginLeft: '4px' }}>%</span>
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '20px 16px',
              borderLeft: `4px solid ${statusTanah.color}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                    Kelembaban Tanah
                    <span style={{
                      marginLeft: '8px',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: 600,
                      backgroundColor: statusTanah.color,
                      color: 'white'
                    }}>
                      {statusTanah.text}
                    </span>
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: '#1f2937' }}>
                    {dataSensor.soil_moisture ?? '--'}
                    <span style={{ fontSize: '14px', color: '#9ca3af', marginLeft: '4px' }}>%</span>
                  </div>
                </div>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  border: `4px solid ${statusTanah.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: statusTanah.color
                }}>
                  {dataSensor.soil_moisture ?? '--'}%
                </div>
              </div>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <div style={{
            fontSize: '13px',
            fontWeight: 600,
            color: '#166534',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '16px'
          }}>
            Kontrol Pompa
          </div>

          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '14px', color: '#374151', marginBottom: '4px' }}>
                  Status Pompa
                </div>
                <div style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: statusPompa ? '#166534' : '#6b7280'
                }}>
                  {statusPompa ? 'Menyala' : 'Mati'}
                </div>
                {isKering && (
                  <div style={{ fontSize: '12px', color: '#dc2626', marginTop: '8px' }}>
                    ⚡ Mode Otomatis: Tanah kering, pompa dinyalakan
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                <button
                  onClick={handleTogglePompa}
                  disabled={tombolDisabled}
                  style={{
                    padding: '12px 32px',
                    fontSize: '14px',
                    fontWeight: 600,
                    border: 'none',
                    borderRadius: '6px',
                    cursor: tombolDisabled ? 'not-allowed' : 'pointer',
                    backgroundColor: tombolDisabled ? '#d1d5db' : (statusPompa ? '#6b7280' : '#166534'),
                    color: 'white',
                    transition: 'background-color 0.15s'
                  }}
                >
                  {sedangMemuat ? 'Memproses...' : (statusPompa ? 'Matikan' : 'Nyalakan')}
                </button>
                {isKering && (
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    Kontrol manual dinonaktifkan (otomatis)
                  </div>
                )}
                {isBasah && (
                  <div style={{ fontSize: '12px', color: '#2563eb' }}>
                    Tanah sudah basah, tidak perlu disiram
                  </div>
                )}
                {isNormal && (
                  <div style={{ fontSize: '12px', color: '#16a34a' }}>
                    Kondisi normal, kontrol manual tersedia
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section>
          <div style={{
            fontSize: '13px',
            fontWeight: 600,
            color: '#166534',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '16px'
          }}>
            Keterangan Threshold
          </div>

          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '20px'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              fontSize: '13px'
            }}>
              <div style={{
                padding: '12px',
                borderRadius: '6px',
                backgroundColor: '#fef2f2',
                borderLeft: '3px solid #dc2626'
              }}>
                <div style={{ fontWeight: 600, color: '#dc2626' }}>Kering</div>
                <div style={{ color: '#6b7280', marginTop: '4px' }}>≤ {SOIL_KERING_MAX}%</div>
                <div style={{ color: '#374151', fontSize: '11px', marginTop: '4px' }}>Pompa otomatis nyala</div>
              </div>
              <div style={{
                padding: '12px',
                borderRadius: '6px',
                backgroundColor: '#f0fdf4',
                borderLeft: '3px solid #16a34a'
              }}>
                <div style={{ fontWeight: 600, color: '#16a34a' }}>Normal</div>
                <div style={{ color: '#6b7280', marginTop: '4px' }}>{SOIL_KERING_MAX + 1}% - {SOIL_NORMAL_MAX}%</div>
                <div style={{ color: '#374151', fontSize: '11px', marginTop: '4px' }}>Kontrol manual</div>
              </div>
              <div style={{
                padding: '12px',
                borderRadius: '6px',
                backgroundColor: '#eff6ff',
                borderLeft: '3px solid #2563eb'
              }}>
                <div style={{ fontWeight: 600, color: '#2563eb' }}>Basah</div>
                <div style={{ color: '#6b7280', marginTop: '4px' }}>&gt; {SOIL_NORMAL_MAX}%</div>
                <div style={{ color: '#374151', fontSize: '11px', marginTop: '4px' }}>Tombol dinonaktifkan</div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer style={{
        borderTop: '1px solid #e5e7eb',
        padding: '20px 0',
        backgroundColor: 'white'
      }}>
        <div style={{ ...containerStyle, textAlign: 'center', fontSize: '12px', color: '#9ca3af' }}>
          Tugas Besar IoT — Sistem Penyiraman Tanaman
        </div>
      </footer>

    </div>
  );
}

export default App;
