// =================================================================
// 2. 메서드 체이닝 (Method Chaining) 실습
// =================================================================
// 💡 실행 방법: node 144-2-2_chaining.js
// =================================================================

console.log("==================================================");
console.log("👉 2. 임시 변수 없는 고차함수 메서드 연쇄 체이닝");
console.log("==================================================");

const scores = [45, 82, 60, 95, 30];

// TODO 2-1: 아래 지시사항에 맞는 가공 흐름을 메서드 체이닝으로 한 번에 서술하여 passedTotal 변수에 담으세요.
// 1. filter를 이용하여 60점 이상의 점수들만 추출
// 2. map을 이용하여 살아남은 점수들에 각각 보너스 점수 +10 가산
// 3. reduce를 이용하여 최종 합산액 산출
const passedTotal = scores
  .filter(score => score >= 60)
  .map(score => score + 10)
  .reduce((acc, cur) => acc + cur, 0);

console.log(" 2-1. 체이닝 합산 결과:", passedTotal); // 267

console.log("--------------------------------------------------");

// [추가 연습 2-1] 가상의 회원 데이터를 이용한 평균 계산 체이닝 구현 미션
const users = [
  { name: "민지", age: 20, active: true },
  { name: "철수", age: 28, active: false },
  { name: "영희", age: 32, active: true },
  { name: "호열", age: 15, active: true }
];

// TODO 2-2: 아래 규칙을 모두 충족하는 회원들의 '평균 나이(Average Age)'를 체이닝으로 한 번에 한 줄의 코드로 작성해 보세요.
// 1. filter를 사용해 활성 상태인 사용자(active: true)만 추출
// 2. map을 사용해 나이(age) 속성들만 추출하여 숫자 배열화
// 3. reduce를 사용해 활성 사용자 나이의 총합을 계산한 뒤, 활성 사용자 수로 나누어 평균값을 도출하세요.
const activeUsers = users.filter(u => u.active);
const activeAverageAge = activeUsers
  .map(u => u.age)
  .reduce((acc, age) => acc + age, 0) / activeUsers.length;

console.log(" 2-2. 활성 유저 평균 나이:", activeAverageAge); // (20 + 32 + 15) / 3 = 22.333...
console.log("==================================================");
