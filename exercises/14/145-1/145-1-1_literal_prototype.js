// =================================================================
// 1. 객체 리터럴 고급 및 프로토타입 실습
// =================================================================
// 🔗 관련 교안: [[145-1_JS 클래스]]
// 💡 실행 방법: node 145-1-1_literal_prototype.js
// =================================================================

console.log("==================================================");
console.log("👉 1. 객체 리터럴 (축약 속성명 & 계산된 속성명)");
console.log("==================================================");

// [미션 1] 단축 속성명과 계산된 속성명을 활용하여 동적 객체 생성하기
const role = "manager";
const dynamicKey = "userGrade";

// TODO 1-1: 아래 조건에 맞는 user 객체를 생성하세요.
// 1. 속성 축약명(Property Shorthand)을 사용하여 role 변수를 속성으로 넣으세요.
// 2. 계산된 속성명(Computed Property)을 사용하여 dynamicKey 변수 값("userGrade")을 키로 삼고, 값은 "Gold"를 지정하세요.
// 3. 메서드 축약 표현을 사용해 greet() 메서드를 구현하세요. (내부에서 userGrade와 role을 출력)
const user = {
  role,
  [dynamicKey]: "Gold",
  greet() {
    return `안녕하세요! 등급은 ${this.userGrade}이며 역할은 ${this.role}입니다.`;
  }
};

console.log(" 1-1. user 객체 생성 확인:", user);
console.log(" 1-2. user.greet() 호출:", user.greet());

console.log("--------------------------------------------------");
console.log("👉 2. JavaScript의 this 동작 방식");
console.log("==================================================");

// [미션 2] 호출 방식에 따른 this 동작 차이 확인
// TODO 2-1: 객체 메서드로 호출할 때와 일반 클래스/생성자 내부에서의 this 차이를 콘솔 출력을 통해 이해하세요.

const tester = {
  name: "아린",
  showThis() {
    // 메서드를 실행한 온점(.) 앞의 객체(tester)를 가리킴
    return this;
  }
};
console.log(" 2-1. 메서드로서 호출된 this는 tester 객체와 동일한가?", tester.showThis() === tester); // true

class Person {
  constructor(name) {
    // new 연산자를 통해 새로 생성되는 인스턴스를 가리킴
    this.name = name;
  }
}
const p = new Person("다현");
console.log(" 2-2. 생성된 인스턴스의 name 속성:", p.name); // "다현"

console.log("--------------------------------------------------");
console.log("👉 3. 생성자 함수와 프로토타입 기반 공유 메서드");
console.log("==================================================");

// [미션 3] 생성자 함수 선언 및 인스턴스별 메서드 중복 할당에 따른 메모리 낭비 확인
function Customer(name, level) {
  this.name = name;
  this.level = level;
  
  // TODO 3-1: 인스턴스마다 중복 생성되어 메모리 낭비를 유발하는 badIntro 메서드를 정의하세요.
  this.badIntro = function() {
    return `안녕하세요, ${this.name}입니다. 등급은 ${this.level}입니다.`;
  };
}

const customerA = new Customer("길동", "VVIP");
const customerB = new Customer("철수", "VIP");

console.log(" 3-1. customerA.badIntro === customerB.badIntro:", customerA.badIntro === customerB.badIntro); // false (서로 다른 메모리 공간 점유)

// [미션 4] prototype을 활용한 공유 메서드 정의 패턴 적용
// TODO 4-1: Customer 생성자 함수의 prototype에 goodIntro 메서드를 정의하여 모든 인스턴스가 동일한 메모리의 메서드를 공유하게 하세요.
Customer.prototype.goodIntro = function() {
  return `반갑습니다. ${this.name}(${this.level})입니다.`;
};

console.log(" 4-1. customerA.goodIntro():", customerA.goodIntro());
console.log(" 4-2. customerB.goodIntro():", customerB.goodIntro());
console.log(" 4-3. customerA.goodIntro === customerB.goodIntro:", customerA.goodIntro === customerB.goodIntro); // true (동일한 메모리 주소 공유!)
