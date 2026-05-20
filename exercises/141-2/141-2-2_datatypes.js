// =================================================================
// 2. 기본 자료형과 템플릿 리터럴 실습
// =================================================================
// 💡 실행 방법: 터미널에서 아래 명령어를 입력하여 실행하세요.
//    node 141-2-2_datatypes.js
// =================================================================

console.log("==================================================");
console.log("👉 2. 기본 자료형 및 백틱(Template Literal) 실습");
console.log("==================================================");

// [미션 1] 다양한 원시 타입의 typeof 탐색
const score = 95;
const userName = "이순신";
const isCompleted = true;
const emptyBox = null;
let notAllocated;

// TODO: 아래 ??? 자리에 typeof 연산자를 사용하여 각 변수의 데이터 타입을 출력하세요.
console.log("score의 타입:", typeof score);
console.log("userName의 타입:", typeof userName);
console.log("isCompleted의 타입:", typeof isCompleted);
console.log("emptyBox의 타입:", typeof emptyBox); // (참고: null은 자바스크립트 스펙 상 'object'로 출력됨)
console.log("notAllocated의 타입:", typeof notAllocated);

console.log("--------------------------------------------------");

// [미션 2] 백틱(템플릿 리터럴)을 사용한 동적 문자열 합성
const studentName = "김유신";
const scoreMath = 92;

// TODO: 백틱(`) 기호와 ${} 플레이스홀더를 사용하여 아래와 같이 여러 줄 문장을 조립하세요.
// 출력 형식: 
// [성적 통보서]
// 김유신 학생의 수학 점수는 92점입니다.
const report = `[성적 통보서]
${studentName} 학생의 수학 점수는 ${scoreMath}점입니다.`;

console.log(report);
console.log("==================================================");
