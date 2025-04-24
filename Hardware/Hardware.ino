#include <WiFi.h>
#include <HTTPClient.h>
#include <WebServer.h>

// Pin definitions
const int authButtonPin = 14;
const int authLedPin = 5;
const int deployButtonPin = 27;
const int deployLedPin = 18;
const int startStormPin = 4;
const int stopStormPin = 2;

// Button states
int lastAuthButtonState = HIGH;
int lastDeployButtonState = HIGH;

// WiFi credentials
const char* ssid = "Bsnl";
const char* password = "devagya123";

// Backend API endpoints
const char* registerAPI = "http://192.168.101.11:3050/api/register";
const char* deployAPI = "http://192.168.101.11:3050/api/deploy";
const char* tokenAPI = "http://192.168.101.9/token";

WebServer server(80);
String accessToken = "";
String status = "false";

void setup() {
  Serial.begin(9600);

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  // Pin modes
  pinMode(authButtonPin, INPUT_PULLUP);
  pinMode(deployButtonPin, INPUT_PULLUP);
  pinMode(authLedPin, OUTPUT);
  pinMode(deployLedPin, OUTPUT);
  pinMode(startStormPin, OUTPUT);
  pinMode(stopStormPin, OUTPUT);

  // Initialize LEDs and storm pins LOW
  digitalWrite(authLedPin, LOW);
  digitalWrite(deployLedPin, LOW);
  digitalWrite(startStormPin, LOW);
  digitalWrite(stopStormPin, LOW);

  // Web server route: /token
  server.on("/token", HTTP_POST, []() {
    if (server.hasArg("plain")) {
      accessToken = server.arg("plain");
      accessToken.trim();
      if (accessToken.startsWith("\"") && accessToken.endsWith("\"")) {
        accessToken = accessToken.substring(1, accessToken.length() - 1);
      }
      Serial.println("🔐 Token received from UI (cleaned):");
      Serial.println(accessToken);
      server.send(200, "text/plain", "Token received successfully");
    } else {
      server.send(400, "text/plain", "Missing token data");
    }
  });

  // Web server route: /status
  server.on("/status", HTTP_POST, []() {
    if (server.hasArg("plain")) {
      status = server.arg("plain");
      status.trim();
      if (status.startsWith("\"") && status.endsWith("\"")) {
        status = status.substring(1, status.length() - 1);
      }
      Serial.println("🔐 status received from UI (cleaned):");
      Serial.println(status);
      server.send(200, "text/plain", "Status received");
    } else {
      Serial.println("❌ No plain body received in /status");
      server.send(400, "text/plain", "Missing status data");
    }
  });

  server.begin();
  Serial.println("ESP32 Web server started");
}

void loop() {
  server.handleClient();

  int currentAuthButtonState = digitalRead(authButtonPin);
  int currentDeployButtonState = digitalRead(deployButtonPin);

  // Auth Button
  if (currentAuthButtonState == LOW && lastAuthButtonState == HIGH) {
    Serial.println("Auth Button Pressed");
    digitalWrite(authLedPin, HIGH);
    registerFunction();
  }

  // Deploy Button
  if (currentDeployButtonState == LOW && lastDeployButtonState == HIGH) {
    Serial.println("Deployment Button Pressed");
    digitalWrite(deployLedPin, HIGH);
    deployFunction();
  }

  // Turn off LEDs when buttons are released
  if (currentAuthButtonState == HIGH) {
    digitalWrite(authLedPin, LOW);
  }

  if (currentDeployButtonState == HIGH) {
    digitalWrite(deployLedPin, LOW);
  }

  lastAuthButtonState = currentAuthButtonState;
  lastDeployButtonState = currentDeployButtonState;

  // Storm control logic
  if (status == "true") {
    digitalWrite(startStormPin, HIGH);
    digitalWrite(stopStormPin, LOW);
  } else {
    digitalWrite(startStormPin, LOW);
    digitalWrite(stopStormPin, HIGH);
  }

  delay(200);
}

// Token fetch function (optional - not called)
void token() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(tokenAPI);
    http.addHeader("Content-Type", "application/json");

    String dummyData = "{\"status\":\"deploy triggered\"}";
    int responseCode = http.POST(dummyData);

    if (responseCode > 0) {
      Serial.print("✅ Server Response Code: ");
      Serial.println(responseCode);
      String responseBody = http.getString();
      Serial.println("🔐 Token received from backend:");
      Serial.println(responseBody);
    } else {
      Serial.print("❌ Error in POST. Code: ");
      Serial.println(responseCode);
    }

    http.end();
  } else {
    Serial.println("❌ WiFi Disconnected");
  }
}

// Registration function
void registerFunction() {
  Serial.println("Enter your email:");
  while (!Serial.available()) delay(100);
  String email = Serial.readStringUntil('\n');
  email.trim();

  Serial.println("Enter your password:");
  while (!Serial.available()) delay(100);
  String userPassword = Serial.readStringUntil('\n');
  userPassword.trim();

  Serial.println("Registering...");

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(registerAPI);
    http.addHeader("Content-Type", "application/json");

    String jsonPayload = "{\"email\":\"" + email + "\",\"password\":\"" + userPassword + "\"}";
    int responseCode = http.POST(jsonPayload);
    String response = http.getString();

    Serial.print("Server Response Code: ");
    Serial.println(responseCode);
    Serial.print("Message: ");
    Serial.println(response);

    http.end();
  } else {
    Serial.println("WiFi Disconnected");
  }
}

// Deployment function
void deployFunction() {
  Serial.println("Processing Deployment...");

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(deployAPI);
    http.addHeader("Content-Type", "application/json");

    String authHeader = accessToken;
    http.addHeader("Authorization", authHeader);

    String dummyData = "{\"status\":\"deploy triggered\"}";
    int responseCode = http.POST(dummyData);

    Serial.print("Server Response Code: ");
    Serial.println(responseCode);
    Serial.print("Server Response: ");
    Serial.println(http.getString());

    http.end();
  } else {
    Serial.println("WiFi Disconnected");
  }
}
