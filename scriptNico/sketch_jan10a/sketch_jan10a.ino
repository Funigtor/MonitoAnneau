void setup() {
  Serial.begin(9600);
}

void loop() {
  uint16_t val;
  double dat;
  val= analogRead(A8);
  dat = (double) val * (5/10.24);
  Serial.print(dat);
  Serial.print('\n');
  delay(60000);
}
