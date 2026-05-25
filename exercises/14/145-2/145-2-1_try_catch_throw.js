// =================================================================
// 1. 예외처리 기초, 커스텀 에러 및 throw/rethrow 실습
// =================================================================
// 🔗 관련 교안: [[145-2_JS 예외처리]]
// 💡 실행 방법: node 145-2-1_try_catch_throw.js
// =================================================================

console.log("==================================================");
console.log("👉 1. try-catch 기본 및 에러 객체 속성");
console.log("==================================================");

// [미션 1] try-catch 구조를 통해 에러 유발 및 에러 객체 상세 정보 출력하기
try {
  // TODO 1-1: 존재하지 않는 변수나 함수를 호출하여 의도적으로 ReferenceError를 발생시키세요.
  nonExistentFunction();
} catch (error) {
  // TODO 1-2: catch 블록에 전달된 에러 객체의 name, message를 출력해 속성을 확인하세요.
  console.log(" 1-1. 에러 이름 (name):", error.name);       // "ReferenceError"
  console.log(" 1-2. 에러 메시지 (message):", error.message); // "nonExistentFunction is not defined"
  // console.log(" 1-3. 스택 추적 (stack):", error.stack);    // 디버깅용 정보 (길어서 주석 처리)
}

console.log("--------------------------------------------------");
console.log("👉 2. throw 키워드와 커스텀 에러 클래스");
console.log("==================================================");

// [미션 2] 내장 Error 클래스를 상속받는 ValidationError, DatabaseError 선언 및 throw 활용
// TODO 2-1: Error를 상속받아 ValidationError와 DatabaseError 커스텀 클래스를 선언하세요.
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

class DatabaseError extends Error {
  constructor(message) {
    super(message);
    this.name = "DatabaseError";
  }
}

function registerMember(member) {
  if (!member.id) {
    // TODO 2-2: id가 없을 때 ValidationError를 던지도록 throw문을 구현하세요.
    throw new ValidationError("회원 ID는 필수 항목입니다.");
  }
  if (member.id === "admin") {
    // TODO 2-3: id가 'admin'인 경우 DatabaseError를 던지도록 throw문을 구현하세요.
    throw new DatabaseError("데이터베이스에 중복된 ID가 존재합니다.");
  }
  return `성공: ${member.id} 회원 등록을 마쳤습니다.`;
}

console.log("--------------------------------------------------");
console.log("👉 3. 에러 클래스 감지 (instanceof 분기)");
console.log("==================================================");

// [미션 3] instanceof 연산자를 사용해 에러 유형별로 정밀하게 분기 처리하기
try {
  const invalidMember = { nickname: "홍길동" }; // id 누락
  registerMember(invalidMember);
} catch (error) {
  // TODO 3-1: error가 ValidationError인지, DatabaseError인지 instanceof로 체크하여 각기 다른 방식으로 에러 로그를 기록하세요.
  if (error instanceof ValidationError) {
    console.error(` 🚨 [회원 정보 유효성 실패] ${error.message}`);
  } else if (error instanceof DatabaseError) {
    console.error(` 💾 [DB 트랜잭션 오류] ${error.message}`);
  } else {
    console.error(` ⚙️ [시스템 일반 예외] ${error.name}: ${error.message}`);
  }
}

console.log("--------------------------------------------------");
console.log("👉 4. 에러 다시 던지기 (Rethrow 패턴)");
console.log("==================================================");

// [미션 4] 에러를 감지한 후 로컬에서 일부 대처하거나 로그만 남기고, 완벽히 해결할 수 없어 다시 던지기(Rethrow) 구현
function setupApplication(memberData) {
  try {
    registerMember(memberData);
  } catch (error) {
    if (error instanceof ValidationError) {
      // ValidationError는 경고만 띄우고 임시 회원을 대체 등록하여 자체 해결(복구) 처리
      console.warn(" ⚠️ 가벼운 회원 데이터 검증 실패. 임시 계정으로 강제 등록 진행합니다.");
      return "임시 회원 등록 성공";
    } else {
      // DatabaseError나 기타 에러는 심각한 오류이므로, 로깅 후 상위 호출자로 다시 던짐 (Rethrow)
      console.log(" 🔍 [로컬 로그 기록] 치명적인 오류 발견! 상위 시스템으로 조치를 위임합니다.");
      // TODO 4-1: 잡은 에러를 상위 호출자로 그대로 다시 던지세요.
      throw error;
    }
  }
}

// 상위 호출자 영역에서의 에러 최종 처리 확인
try {
  // 중복 ID 'admin' 전송으로 DatabaseError 발생 유도
  setupApplication({ id: "admin" });
} catch (finalError) {
  console.log(" 🎯 [최종 최상단 감지] 위임받아 최종 처리된 에러 메시지:", finalError.message);
}
