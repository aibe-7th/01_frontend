// =================================================================
// 3. 정적 멤버 및 클래스 유틸리티 실습
// =================================================================
// 🔗 관련 교안: [[145-1_JS 클래스]]
// 💡 실행 방법: node 145-1-3_static_utilities.js
// =================================================================

console.log("==================================================");
console.log("👉 1. 정적 속성 및 메서드 (static)");
console.log("==================================================");

// [미션 1] 인스턴스 없이 호출 가능한 static 멤버 선언 및 접근성 테스트
// TODO 1-1: Calculator 클래스를 선언하고 정적 상수 PI(3.141592)와 정적 메서드 circleArea(radius)를 구현하세요.
class Calculator {
  // 정적 필드
  static PI = 3.141592;

  // 정적 메서드
  static circleArea(radius) {
    return this.PI * radius * radius;
  }
}

console.log(" 1-1. Calculator.PI 정적 상수 호출:", Calculator.PI); // 3.141592
console.log(" 1-2. Calculator.circleArea(5) 정적 메서드 호출:", Calculator.circleArea(5)); // 78.5398

const calc = new Calculator();
// console.log(calc.circleArea(5)); 
// 💡 주석 풀고 실행 시 TypeError: calc.circleArea is not a function 에러 발생 (인스턴스로는 정적 멤버 접근 불가)

console.log("--------------------------------------------------");
console.log("👉 2. 타입 확인 (instanceof & constructor)");
console.log("==================================================");

// [미션 2] instanceof 연산자와 constructor 속성을 통한 타입 식별
class Vehicle {}
class ElectricCar extends Vehicle {}
const tesla = new ElectricCar();

// TODO 2-1: tesla 인스턴스가 ElectricCar 및 Vehicle 클래스의 인스턴스가 맞는지 instanceof로 검증해 출력하세요.
console.log(" 2-1. tesla instanceof ElectricCar:", tesla instanceof ElectricCar); // true
console.log(" 2-2. tesla instanceof Vehicle:", tesla instanceof Vehicle);       // true (부모 클래스 타입 만족)

// TODO 2-2: tesla의 생성자 함수(constructor)가 ElectricCar와 일치하는지 비교하여 출력하세요.
console.log(" 2-3. tesla.constructor === ElectricCar:", tesla.constructor === ElectricCar); // true

console.log("--------------------------------------------------");
console.log("👉 3. 내장 빌트인 클래스 유틸리티 & 형변환");
console.log("==================================================");

// [미션 3] Array, Number 내장 클래스의 정적 유틸리티 및 형변환 API 활용
// TODO 3-1: Array.isArray, Number.isInteger, Number.isNaN 을 활용한 유효성 검증을 해보세요.
const arr = [10, 20];
const nanValue = NaN;

console.log(" 3-1. arr 변수가 진짜 배열인가?", Array.isArray(arr)); // true
console.log(" 3-2. 12.34가 정수인가?", Number.isInteger(12.34)); // false
console.log(" 3-3. nanValue 변수가 NaN인가?", Number.isNaN(nanValue)); // true

// TODO 3-2: Number(), String(), Boolean()을 사용한 명시적 형변환을 실습하세요.
console.log(" 3-4. '777' 문자열을 숫자로 변환:", Number("777")); // 777
console.log(" 3-5. 빈 문자열('')을 불리언으로 변환 (Falsy):", Boolean("")); // false

// TODO 3-3: Number.parseInt()와 Number.parseFloat()를 사용하여 텍스트에서 숫자만 파싱해 내세요.
console.log(" 3-6. '100px'에서 정수 부분 파싱:", Number.parseInt("100px")); // 100
console.log(" 3-7. '3.14달러'에서 실수 부분 파싱:", Number.parseFloat("3.14달러")); // 3.14

console.log("--------------------------------------------------");
console.log("👉 4. 객체/배열 복사 시의 주의점 및 내장 API");
console.log("==================================================");

// [미션 4] 클래스 인스턴스를 스프레드 연산자(...)로 복사할 때 생기는 프로토타입 유실 버그 극복
class Warrior {
  constructor(name, hp) {
    this.name = name;
    this.hp = hp;
  }
  attack() {
    return `${this.name}의 혼신의 타격!`;
  }
  // 복제 전용 메서드 정의
  clone() {
    return new Warrior(this.name, this.hp);
  }
}

const w1 = new Warrior("전사", 120);

// ⚠️ 버그 유발 사례: 스프레드 연산자를 사용하여 인스턴스 복사 진행
const badClone = { ...w1 };
console.log(" 4-1. badClone의 상태:", badClone); // { name: '전사', hp: 120 }
// console.log(badClone.attack());
// 💡 주석 풀고 실행 시 TypeError: badClone.attack is not a function 에러 발생!
// 스프레드로 단순 복사한 결과물은 프로토타입 메서드(attack)가 완전히 유실된 Plain Object(일반 객체)가 됨.

// TODO 4-1: Warrior 인스턴스의 정보와 기능을 보존하여 올바르게 goodClone으로 복제하고, attack() 메서드를 호출해 보세요.
const goodClone = w1.clone();
console.log(" 4-2. goodClone.attack() 정상 실행 결과:", goodClone.attack()); // "전사의 혼신의 타격!"

// TODO 4-2: Object.keys(), Object.values(), Object.freeze() 등 내장 객체 유틸리티 활용
const setting = { theme: "dark", lang: "ko" };
Object.freeze(setting);
setting.theme = "light"; // 동결(freeze) 처리되었으므로 값이 변경되지 않음
console.log(" 4-3. Object.keys(setting):", Object.keys(setting)); // ["theme", "lang"]
console.log(" 4-4. 동결된 setting의 theme 확인:", setting.theme); // "dark" (수정 무시됨)
