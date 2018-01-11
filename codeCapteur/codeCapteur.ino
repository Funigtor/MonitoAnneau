
 
int ledPin = 13;       // LED qui s'allume si détection
int inputPin = 3;      // capteur infrarouge PIR
int pirState = LOW;    // pas encore de mouvement détecté au départ
int val = 0;           // Lecture deu statut
long previousMillis = 0;   //instant du déclenchement

void setup() {
  pinMode(ledPin, OUTPUT);      //  LED en sortie
  pinMode(inputPin, INPUT);     // Détecteur PIR en entrée
  Serial.begin(9600);           //Affichage série
}

void loop(){
  val = digitalRead(inputPin);  // Lire le statut
  unsigned long currentMillis = millis();  //Heure
 
  if (val == HIGH) {            // Si HIGH, détection
    digitalWrite(ledPin, HIGH);  // Allumer la LED
    //delay(150);
   
    if (pirState == LOW) {  //Front montant (début de détection)
      Serial.print("Mouvement detecte ");  //Affiche une seule fois
      pirState = HIGH;  //Mémoriser l'état haut
      previousMillis = currentMillis;    //Mémoriser debut du signal
    }
   
  } else {   //Sinon pas de mouvement détecté
      digitalWrite(ledPin, LOW); // éteindre la ELd
      //delay(300);   
      if (pirState == HIGH){ //Détecter le front descendant
      Serial.print(" stop ");
      pirState = LOW;  //Mémoriser l'état bas
      unsigned long duree = currentMillis - previousMillis;
      Serial.print(" Duree ");
      Serial.println(duree);  //Durée en millisecondes
    }
  }
}

