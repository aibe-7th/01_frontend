// =================================================================
// 1. 호이스팅 (Hoisting) 오작동 분석 및 대안 실습
// =================================================================
// 💡 실행 방법: node 143-2-1_hoisting.js
// =================================================================

console.log("==================================================");
console.log("👉 1. var 변수 & function 선언문 호이스팅 부작용 분석");
console.log("==================================================");

// [미션 1] var 변수의 호이스팅에 의한 undefined 초기화 문제 관찰
// TODO: 아래 코드를 실행해 보고, ReferenceError 대신 undefined가 뜨는 오작동 이유를 적어보세요.
console.log(" 1-1. 선언 전 score 조회:", score); // undefined
var score = 100;
console.log(" 1-2. 선언 후 score 조회:", score); // 100

// [추가 연습 1-1] var 대신 let 또는 const를 사용하여 TDZ(Temporal Dead Zone)에 의한 에러 검출을 확인해 보세요.
// (아래 주석을 해제하여 ReferenceError가 발생하는 것을 안전하게 유도해 보세요.)
// console.log(safeScore); // ReferenceError: Cannot access 'safeScore' before initialization
// const safeScore = 100;

console.log("--------------------------------------------------");

// [미션 2] function 선언문의 호이스팅 및 중복 선언(덮어쓰기) 문제 관찰
// TODO: 선언식 함수는 전체가 호이스팅되어 중복 선언 시 나중에 작성된 함수가 조용히 기존 함수를 덮어씁니다.
console.log(" 1-3. 계산기 호출 결과:", calculate(10)); // 110 (20이 아닌 110이 나옴!)

function calculate(n) {
  return n * 2;
}

// 동일한 이름의 함수를 다시 정의 (덮어쓰기 대참사)
function calculate(n) {
  return n + 100;
}

// [추가 연습 1-2] 함수 표현식(Expression)을 사용하여 중복 선언 및 선언 전 호출을 사전에 차단하세요.
// TODO: 아래 compute 함수를 const와 익명 화살표 함수를 사용해 구현하여, 중복 선언이 애초에 불가능(SyntaxError)하게 만드세요.
const compute = (n) => n * 2;

// const compute = (n) => n + 100; // 주석 해제 시 Identifier 'compute' has already been declared 에러 발생!
console.log(" 1-4. 안전한 compute 결과:", compute(10)); // 20
console.log("==================================================");
