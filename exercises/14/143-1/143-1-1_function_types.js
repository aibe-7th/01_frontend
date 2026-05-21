// =================================================================
// 1. 함수 정의 방식과 화살표 함수 실습
// =================================================================
// 💡 실행 방법: node 143-1-1_function_types.js
// =================================================================

console.log("==================================================");
console.log("👉 1. 함수 선언문, 함수 표현식, 화살표 함수 축약");
console.log("==================================================");

// [미션 1] 함수 선언문과 호이스팅 (Hoisting)
// TODO: 호이스팅 동작을 관찰하며 아래 greet 함수 선언문을 완성하세요.
console.log(greet("지민")); // 선언 전 호출 가능 여부 확인

function greet(name) {
  return `안녕하세요, ${name}님!`;
}

// [추가 연습 1-1] 두 수의 합을 계산하여 반환하는 sum 선언문 함수를 완성하세요.
// 이 자리에 선언문 함수 sum을 구현하고 자유롭게 호출 테스트를 해보세요.
function sum(a, b) {
  return a + b;
}
console.log(" 1-1. 두 수의 합(sum):", sum(10, 20)); // 30

console.log("--------------------------------------------------");

// [미션 2] 함수 표현식 (Function Expression)
// TODO: square 변수에 익명 함수를 할당하여 제곱 값을 구하는 표현식 함수를 만드세요.
const square = function (num) {
  return num * num;
};

console.log(" 1-2. 제곱 값(square):", square(4)); // 16

// [추가 연습 1-2] 두 수의 곱을 반환하는 multiply 표현식 함수를 만들고 변수 multiply에 담아 실행해 보세요.
const multiply = function (a, b) {
  return a * b;
};
console.log(" 1-3. 두 수의 곱(multiply):", multiply(3, 7)); // 21

console.log("--------------------------------------------------");

// [미션 3] 화살표 함수 (Arrow Function) 축약 연습
// 기본 함수 표현식을 화살표 함수 축약 규칙에 맞추어 변환하는 단계별 미션입니다.

// 일반 형태
const addTen = (n) => {
  return n + 10;
};

// TODO: 아래 addTenArrow를 소괄호, 중괄호, return을 모두 생략한 완전 축약형으로 작성하세요.
const addTenArrow = n => n + 10;

console.log(" 1-4. addTen 축약 결과:", addTenArrow(5)); // 15

// [추가 연습 1-3] 문자열을 받아 그 길이를 반환하는 화살표 함수 getLength를 완전 축약형(소괄호/중괄호/return 생략)으로 작성해 보세요.
const getLength = str => str.length;

console.log(" 1-5. 문자열 길이 구하기:", getLength("JavaScript")); // 10
console.log("==================================================");
