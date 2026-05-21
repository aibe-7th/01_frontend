// =================================================================
// 2. 인자, 매개변수 및 기본값 매개변수 실습
// =================================================================
// 💡 실행 방법: node 143-1-2_parameters.js
// =================================================================

console.log("==================================================");
console.log("👉 2. 매개변수와 인자의 기초 및 기본값 지정 연습");
console.log("==================================================");

// [미션 1] 매개변수와 인자 구분
// TODO: 매개변수 num을 받아 3배의 값을 계산해 반환하는 triple 함수를 완성하세요.
function triple(num) {
  return num * 3;
}

// TODO: 9를 인자(Argument)로 넣어 함수를 실행해 보세요.
console.log(" 2-1. 9의 3배 값:", triple(9)); // 27

// [추가 연습 2-1] 매개변수 width와 height를 받아 사각형의 넓이를 구하는 getArea 함수를 작성하고 테스트해 보세요.
function getArea(width, height) {
  return width * height;
}
console.log(" 2-2. 사각형의 넓이:", getArea(5, 8)); // 40

console.log("--------------------------------------------------");

// [미션 2] 기본값 매개변수 (Default Parameter) 지정
// TODO: name의 기본값은 "익명", role의 기본값은 "방문객"으로 선언하세요.
function introduce(name = "익명", role = "방문객") {
  return `이름: ${name}, 역할: ${role}`;
}

console.log(" 2-3. 인자 전달 시:", introduce("철수", "관리자"));
console.log(" 2-4. 인자 미전달 시 (기본값 적용):", introduce());

// [추가 연습 2-2] 사용자 닉네임과 등급을 받아 웰컴 메시지를 제작하는 welcomeUser 함수를 작성하세요.
// 단, nickname이 누락되면 "게스트", level이 누락되면 "Silver"가 들어가게 기본값을 설정하세요.
function welcomeUser(nickname = "게스트", level = "Silver") {
  return `환영합니다, ${nickname}님! 등급: ${level}`;
}
console.log(" 2-5. 웰컴 메시지(기본값):", welcomeUser()); // 환영합니다, 게스트님! 등급: Silver
console.log(" 2-6. 웰컴 메시지(인자 입력):", welcomeUser("민호", "Gold")); // 환영합니다, 민호님! 등급: Gold
console.log("==================================================");
