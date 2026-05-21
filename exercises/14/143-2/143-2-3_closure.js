// =================================================================
// 3. 클로저 (Closure) 원리 및 상태 은닉 실습
// =================================================================
// 💡 실행 방법: node 143-2-3_closure.js
// =================================================================

console.log("==================================================");
console.log("👉 3. 클로저 내부 상태 메모리 기억 및 상태 캡슐화 실습");
console.log("==================================================");

// [미션 1] 기본 클로저 렉시컬 상태 유지 분석
function createCounter() {
  let count = 0; // 외부 함수에 갇힌 은닉 변수

  // TODO: count를 증가시키고 반환하는 클로저 내부 함수를 아래 리턴 구문에 적어주세요.
  return function () {
    count++;
    return count;
  };
}

const counter = createCounter();

console.log(" 3-1. 첫 번째 호출:", counter()); // 1
console.log(" 3-2. 두 번째 호출:", counter()); // 2

// [추가 연습 3-1] 상태 은닉 클로저 활용 (가상 은행 계좌 관리 기능)
// TODO: 외부에서 직접 접근하여 변경할 수 없는 은닉된 계좌 잔액(balance) 상태를 캡슐화하는 계좌 객체를 설계해 보세요.
function createAccount(initialBalance) {
  let balance = initialBalance; // 외부 조작이 불가능한 프라이빗 변수

  // 잔액 조회, 입금, 출금 기능을 수행하는 클로저 함수들을 객체로 반환
  return {
    getBalance: function () {
      return balance;
    },
    deposit: function (amount) {
      balance += amount;
      return balance;
    },
    withdraw: function (amount) {
      if (balance >= amount) {
        balance -= amount;
        return balance;
      }
      return "잔액 부족";
    }
  };
}

const myAccount = createAccount(10000); // 10,000원 충전된 계좌 생성

console.log(" 3-3. 초기 잔액 조회:", myAccount.getBalance()); // 10000
console.log(" 3-4. 5,000원 입금 후 잔액:", myAccount.deposit(5000)); // 15000
console.log(" 3-5. 12,000원 출금 후 잔액:", myAccount.withdraw(12000)); // 3000
console.log(" 3-6. 5,000원 추가 출금 시도:", myAccount.withdraw(5000)); // "잔액 부족"

// 이 가상 계좌의 잔액 balance는 오직 myAccount.getBalance(), myAccount.deposit(), myAccount.withdraw()를 통해서만 안전하게 접근 가능함!
// myAccount.balance = 9999999; 등의 직접 조작이 완벽히 차단됨!
console.log("==================================================");
