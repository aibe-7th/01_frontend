// =================================================================
// 2. finally 클린업, return 오버라이드 및 블록 스코프 실습
// =================================================================
// 🔗 관련 교안: [[145-2_JS 예외처리]]
// 💡 실행 방법: node 145-2-2_finally_scope.js
// =================================================================

console.log("==================================================");
console.log("👉 1. finally 블록의 무조건 실행 (자원 클린업)");
console.log("==================================================");

// [미션 1] 에러 여부와 무관하게 무조건 커넥션을 닫아 정리하는 클린업 로직 구현
function handleResource(isSuccess) {
  console.log(`\n--- 자원 처리 테스트 (성공 여부: ${isSuccess}) ---`);
  try {
    console.log(" [1] 리소스 연결 수립 완료.");
    if (!isSuccess) {
      throw new Error("리소스 작업 도중 에러가 터졌습니다.");
    }
    console.log(" [2] 리소스 가공 작업 성공적으로 완료.");
  } catch (error) {
    console.error(` [3] Catch 블록에서 에러 감색: ${error.message}`);
  } finally {
    // TODO 1-1: 어떤 상황에서도 리소스 해제가 반드시 수행되도록 finally 블록을 완성하세요.
    console.log(" [4] finally 블록 실행: 리소스 안전하게 해제 및 클린업 완료!");
  }
}

handleResource(true);  // 성공 시나리오
handleResource(false); // 실패 시나리오

console.log("--------------------------------------------------");
console.log("👉 2. finally 내 return문 덮어쓰기 (Override)");
console.log("==================================================");

// [미션 2] try/catch 블록에 return문이 지정되어 있어도 finally의 return이 최종 가로채 덮어쓰는 동작 확인
// TODO 2-1: checkReturnOverride 함수를 선언하여 덮어쓰기 동작을 직접 눈으로 비교하세요.
function checkReturnOverride() {
  try {
    console.log(" try 블록 진입 및 결과 반환 예약...");
    return "TRY"; // 원래 반환하려 했던 값
  } catch (error) {
    return "CATCH";
  } finally {
    console.log(" finally 블록 진입 및 최종 결과 낚아채기!");
    return "FINALLY"; // 앞선 예약을 덮어쓰고(Override) 최종적으로 반환하는 값!
  }
}

console.log(" 최종 반환된 결과:", checkReturnOverride()); // "FINALLY" 출력 확인

console.log("--------------------------------------------------");
console.log("👉 3. try-catch 블록 스코프의 한계");
console.log("==================================================");

// [미션 3] try, catch, finally 블록이 가지는 독립적 블록 스코프(Block Scope)의 특징 실습
function testBlockScope() {
  try {
    const blockScopedData = "기밀 프로젝트 파일";
    console.log(" try 블록 내부 접근:", blockScopedData);
  } catch (error) {
    // try 블록 안의 blockScopedData는 이곳에서 참조 불가 (ReferenceError 발생)
  }
  // console.log(" try 블록 외부 접근:", blockScopedData); 
  // 💡 주석 풀고 실행 시 ReferenceError: blockScopedData is not defined 발생
}
testBlockScope();
console.log(" 3-1. try 블록 내부의 변수는 외부 및 타 블록에서 참조할 수 없음을 이해함.");

console.log("--------------------------------------------------");
console.log("👉 4. 올바른 공통 변수 스코프 설계");
console.log("==================================================");

// [미션 4] 블록 외부 상위 스코프에 let으로 공통 변수를 정의하고 안전하게 연계 가공하기
// TODO 4-1: try 블록 외부에서 let 변수를 먼저 생성하여 try-catch 이후의 코드 및 finally에서 공통 접근이 가능하게 조치하세요.
function runSafeScope(payload) {
  let processedResult = null; // 상위 스코프에 공통 변수 let 선언
  
  try {
    if (!payload) {
      throw new Error("빈 데이터가 유입되었습니다.");
    }
    // 데이터 처리 및 공통 변수에 할당
    processedResult = `[SUCCESS] ${payload.toUpperCase()}`;
  } catch (error) {
    console.error(" ⚠️ 에러 감지 시점에도 processedResult 접근 가능:", processedResult); // null
    processedResult = `[FAILED] ${error.message}`;
  } finally {
    console.log(" 🔒 finally 블록 공통 결과 검사:", processedResult);
  }
  
  // try-catch 외부에서도 공통 변수로 안전하게 결과를 반환/활용
  return processedResult;
}

console.log(" 4-1. 정상 페이로드 인입 결과:", runSafeScope("welcome"));
console.log(" 4-2. 에러 유발 시 결과:", runSafeScope(null));
