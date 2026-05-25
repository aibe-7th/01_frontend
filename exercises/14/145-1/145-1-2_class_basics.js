// =================================================================
// 2. ES6 클래스 기본 및 고급 실습
// =================================================================
// 🔗 관련 교안: [[145-1_JS 클래스]]
// 💡 실행 방법: node 145-1-2_class_basics.js
// =================================================================

console.log("==================================================");
console.log("👉 1. ES6 클래스 기본 (Constructor & Method)");
console.log("==================================================");

// [미션 1] 클래스를 이용해 책 객체의 템플릿 정의하기
// TODO 1-1: Book 클래스를 선언하고 title과 author를 입력받아 초기화하는 생성자를 구현하세요.
class Book {
  constructor(title, author) {
    this.title = title;
    this.author = author;
  }

  // 기본 메서드 정의
  getSummary() {
    return `"${this.title}" - 저자: ${this.author}`;
  }
}

const bookA = new Book("자바스크립트 마스터", "김철수");
console.log(" 1-1. bookA 요약 정보:", bookA.getSummary());

console.log("--------------------------------------------------");
console.log("👉 2. 클래스 Private 필드 (#)");
console.log("==================================================");

// [미션 2] Private 필드를 활용한 정보 은닉 및 캡슐화 구현
// TODO 2-1: BankAccount 클래스에 외부에서 수정 불가하도록 Private 필드인 #balance를 정의하세요.
class BankAccount {
  owner;
  // Private 필드는 클래스 최상단에 반드시 '#' 접두사로 선언해야 합니다.
  #balance = 0;

  constructor(owner, initialDeposit) {
    this.owner = owner;
    this.#balance = initialDeposit;
  }

  // 외부에서 Private 필드 값을 안전하게 읽어갈 수 있도록 하는 우회 메서드
  showBalance() {
    return this.#balance;
  }
}

const account = new BankAccount("박영희", 1000000);
console.log(" 2-1. 예금주:", account.owner);
// console.log(" 2-2. Private 필드 직접 접근 시도:", account.#balance);
// 💡 주석을 풀고 실행 시 SyntaxError: Private field '#balance' must be declared in an enclosing class 에러 발생
console.log(" 2-3. 안전한 우회 조회를 통한 잔액 확인:", account.showBalance()); // 1000000

console.log("--------------------------------------------------");
console.log("👉 3. 클래스 상속 (extends, super) 및 오버라이딩");
console.log("==================================================");

// [미션 3] Book 클래스를 상속받는 EBook 클래스 구현
// TODO 3-1: Book 클래스를 상속(extends)받고, 추가 속성 fileSize를 초기화하는 EBook 클래스를 생성하세요.
// 💡 주의: 자식 클래스의 constructor 내부에서는 this를 사용하기 전에 반드시 super()를 먼저 호출해야 합니다.
class EBook extends Book {
  constructor(title, author, fileSize) {
    super(title, author); // 부모 클래스의 생성자 실행
    this.fileSize = fileSize;
  }

  // TODO 3-2: 부모의 getSummary 메서드를 재정의(Method Overriding)하여 파일 크기 정보도 포함해 출력하세요.
  getSummary() {
    return `[E-Book] "${this.title}" - 저자: ${this.author} (용량: ${this.fileSize}MB)`;
  }
}

const myEBook = new EBook("모던 JS Deep Dive", "이영희", 15);
console.log(" 3-1. 자식 클래스 오버라이딩 메서드 호출:", myEBook.getSummary());

console.log("--------------------------------------------------");
console.log("👉 4. Getter와 Setter 접근자 프로퍼티");
console.log("==================================================");

// [미션 4] Getter와 Setter를 활용하여 안전하게 데이터 다루고 검증하기
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age; // 대입 시 age의 Setter 메서드가 자동 호출됨
  }

  // TODO 4-1: 게터(get age)를 선언하여 실제 저장된 내부 속성 _age를 반환하세요.
  get age() {
    return this._age;
  }

  // TODO 4-2: 세터(set age)를 선언하여 음수가 입력될 경우 경고 메시지를 띄우고 0으로 강제 보정하는 코드를 작성하세요.
  set age(value) {
    if (value < 0) {
      console.warn(" ⚠️ 경고: 나이는 음수가 될 수 없습니다. 0으로 강제 보정합니다.");
      this._age = 0;
    } else {
      this._age = value;
    }
  }
}

const userA = new Person("지수", -7);
console.log(" 4-1. 보정된 userA의 나이:", userA.age); // 0

const userB = new Person("민수", 23);
console.log(" 4-2. 정상 설정된 userB의 나이:", userB.age); // 23
