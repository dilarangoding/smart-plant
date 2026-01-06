#include <ESP8266WiFi.h>
#include <DHT.h>

// ===== WIFI CONFIG =====
const char* ssid = "POCO X3 GT";
const char* password = "12348765";

// ===== PIN CONFIG (ESP8266) =====
#define SOIL_PIN A0        // ADC tunggal ESP8266
#define DHT_PIN D5         // GPIO14
#define RELAY_PIN D1       // GPIO12
#define DHTTYPE DHT22

DHT dht(DHT_PIN, DHTTYPE);

// ===== Variabel =====
int soilRaw;
float soilPercent;
float humidity;
float temperature;

String soilStatus = "NORMAL";
bool relayState = false;

// ===== Threshold =====
#define SOIL_KERING_MAX 60
#define SOIL_NORMAL_MAX 80

void setup() {
  Serial.begin(115200);

  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH); // relay OFF (aktif LOW)

  dht.begin();

  // ===== WIFI CONNECT =====
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi Connected!");
  Serial.print("IP Address : ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // ===== Baca Sensor Soil =====
  soilRaw = analogRead(SOIL_PIN);

  // Kalibrasi ESP8266 (0–1023)
  soilPercent = map(soilRaw, 1023, 300, 0, 100);
  soilPercent = constrain(soilPercent, 0, 100);

  humidity = dht.readHumidity();
  temperature = dht.readTemperature();

  // ===== FUZZY LOGIC SEDERHANA =====
  if (soilPercent <= SOIL_KERING_MAX) {
    soilStatus = "KERING";
    relayState = true;   // AUTO SIRAM
  }
  else if (soilPercent <= SOIL_NORMAL_MAX) {
    soilStatus = "NORMAL";
    relayState = false;
  }
  else {
    soilStatus = "BASAH";
    relayState = false;
  }

  // ===== Kontrol Relay =====
  digitalWrite(RELAY_PIN, relayState ? LOW : HIGH);

  // ===== Monitoring Serial =====
  Serial.println("==== MONITORING ====");
  Serial.print("Soil Moisture : ");
  Serial.print(soilPercent);
  Serial.println(" %");

  Serial.print("Humidity      : ");
  Serial.print(humidity);
  Serial.println(" %");

  Serial.print("Temperature   : ");
  Serial.print(temperature);
  Serial.println(" C");

  Serial.print("Status Tanah  : ");
  Serial.println(soilStatus);

  Serial.print("Relay State   : ");
  Serial.println(relayState ? "ON" : "OFF");
  Serial.println("====================\n");

  delay(3000);
}