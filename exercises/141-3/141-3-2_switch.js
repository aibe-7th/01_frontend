// =================================================================
// 2. switch 기초 및 switch 응용 실습
// =================================================================
// 💡 실행 방법: 터미널에서 아래 명령어를 입력하여 실행하세요.
//    node 141-3-2_switch.js
// =================================================================

console.log("==================================================");
console.log("👉 2. switch 문 매칭, switch (true), 객체 맵 매핑");
console.log("==================================================");

// [미션 1] switch 기본 매칭과 break 누락(Fall-through) 관찰
const targetDevice = "iPhone";

console.log(" 2-1. [기본 switch 구문 구동]");
// TODO: break 키워드를 지웠을 때 어떤 일이 발생하는지 아래 콘솔을 보며 관찰해 보세요.
switch (targetDevice) {
    case "Galaxy":
        console.log("  → 안드로이드 기기입니다.");
        break;
    case "iPhone":
        console.log("  → iOS 기기입니다.");
        break;
    default:
        console.log("  → 알려지지 않은 기기입니다.");
}

console.log("--------------------------------------------------");

// [미션 2] switch (true) 범위 판정 매칭
const memberAge = 17;
let ageGroup = "";

// TODO: switch (true) 기법을 활용하여 나이대에 따라 어린이, 청소년, 성인을 판정하세요.
switch (true) {
    case memberAge < 13:
        ageGroup = "어린이";
        break;
    case memberAge < 19:
        ageGroup = "청소년";
        break;
    default:
        ageGroup = "성인";
}

console.log(` 2-2. [switch (true)] 판정 결과: ${ageGroup}`);
console.log("--------------------------------------------------");

// [미션 3] 객체 리터럴 맵 매핑 패턴 (Object Lookup)으로 switch 문 대체하기
const inputRole = "editor";

// TODO: 복잡한 switch 문을 대체하기 위한 Key-Value 맵을 설계하세요.
const roleMessageMap = {
    admin: "👑 시스템의 모든 설정을 변경할 수 있습니다.",
    editor: "✍️ 본문의 글을 편집하고 수정할 수 있습니다.",
    guest: "👀 사이트의 내용을 조회만 할 수 있습니다."
};

// TODO: 단축 평가(||)를 조합하여 맵에 일치하는 값이 없을 때 "일반 사용자 권한입니다."가 담기도록 하세요.
const welcomeMessage = roleMessageMap[inputRole] || "일반 사용자 권한입니다.";

console.log(" 2-3. [객체 맵 매핑 결과] 환영 메시지:");
console.log(`  → ${welcomeMessage}`);
console.log("==================================================");
