// =================================================================
// 2. 함수 스코프 vs 블록 스코프 & 렉시컬 스코프 실습
// =================================================================
// 💡 실행 방법: node 143-2-2_scope.js
// =================================================================

console.log("==================================================");
console.log("👉 2. var 스코프 관통 분석, let/const 블록 차단 및 렉시컬 스코프");
console.log("==================================================");

// [미션 1] var의 함수 스코프 관통 현상 관찰
// TODO: var는 block(if, for 등) 단위를 무시하므로 아래 블록 밖에서도 A가 유출됨을 확인하세요.
if (true) {
  var globalA = "var 관통 유출!";
  let blockB = "let 격리 성공!";
}

console.log(" 2-1. 블록 밖에서 var 변수 조회:", globalA); // var 관통 유출!
// console.log(blockB); // 주석 해제 시 ReferenceError 발생!

// [추가 연습 2-1] var 대신 let을 활용하여 for 루프 내 반복 인덱스가 루프 밖으로 새어 나오지 않게 격리하고 에러를 확인해 보세요.
for (let i = 0; i < 3; i++) {
  // i는 루프 내부에서만 유효
}
// console.log(i); // let을 썼으므로 ReferenceError가 나면서 안전하게 차단됨!

console.log("--------------------------------------------------");

// [미션 2] 렉시컬 스코프 (Lexical Scope) 정적 스코프 검증
const value = "Global";

function printValue() {
  // TODO: printValue가 정의(선언)된 장소 기준의 상위 스코프에 있는 value 값을 출력합니다.
  console.log(" 2-2. 렉시컬 스코프 출력 값:", value); 
}

function execute() {
  const value = "Local";
  printValue(); // execute 내부에서 호출해도 결과는 무엇이 될까요?
}

execute(); // "Global" 출력 (호출 위치가 아닌 선언 위치 기준!)

// [추가 연습 2-2] 상위 정적 스코프를 활용해 외부 변수 message에 접근하는 innerFunc를 가진 outerFunc를 선언하세요.
const outerMessage = "정적 환경 기억 완료!";

function outerFunc() {
  function innerFunc() {
    console.log(" 2-3. 추가 연습 출력:", outerMessage);
  }
  innerFunc();
}

outerFunc(); // "정적 환경 기억 완료!" 출력
console.log("==================================================");
