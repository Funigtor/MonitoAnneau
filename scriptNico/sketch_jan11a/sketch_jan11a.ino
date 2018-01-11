void setup() {
  Serial.begin(9600);
}

void loop() {
  uint16_t val2;
  double dat;
  val2= analogRead(A8);
  dat = (double) val2 * (5/10.24);
  Serial.println(dat);
  delay(60000);
}

