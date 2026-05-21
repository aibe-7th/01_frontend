// =================================================================
// 4. for, for-in, for-of 반복문 실습
// =================================================================
// 💡 실행 방법: 터미널에서 아래 명령어를 입력하여 실행하세요.
//    node 141-3-4_for_loops.js
// =================================================================

console.log("==================================================");
console.log("👉 4. 기본 for, 객체 순회 for-in, 배열 순회 for-of");
console.log("==================================================");

// [미션 1] 기본 for 문 및 배열 length 순회
const colorList = ["빨강", "초록", "파랑"];

console.log(" 4-1. [기본 for 순회 결과]");
// TODO: 인덱스 변수 i가 0부터 시작하여 colorList의 총 개수 미만까지 1씩 증가하게 채우세요.
for (let i = 0; i < colorList.length; i++) {
    console.log(`  → 인덱스 ${i}번 색상: ${colorList[i]}`);
}

console.log("--------------------------------------------------");

// [미션 2] for-in 문을 통한 객체(Object) 속성(Key/Value) 순회
const teamMember = {
    name: "김철수",
    role: "UI 디자이너",
    level: "시니어"
};

console.log(" 4-2. [for-in 객체 속성 순회 결과]");
// TODO: for-in 루프를 사용해 teamMember의 key를 뽑아내고 점 표기법/대괄호 표기법으로 값을 출력하세요.
for (const key in teamMember) {
    console.log(`  → 속성 이름(Key): ${key} | 속성 값(Value): ${teamMember[key]}`);
}

console.log("--------------------------------------------------");

// [미션 3] for-of 문을 통한 배열(Array)의 순수 알맹이 값 순회
const numbers = [10, 20, 30];

console.log(" 4-3. [for-of 배열 값 순회 결과]");
// TODO: for-of 문을 사용하여 numbers 배열 내부의 값(value)을 직접 변수에 담아 출력하세요.
for (const val of numbers) {
    console.log(`  → 배열 내부 값: ${val}`);
}
console.log("==================================================");
