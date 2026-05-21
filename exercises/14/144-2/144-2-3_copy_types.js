// =================================================================
// 3. 재할당 vs 얕은 복사 vs 깊은 복사 실습
// =================================================================
// 💡 실행 방법: node 144-2-3_copy_types.js
// =================================================================

console.log("==================================================");
console.log("👉 3. 메모리 주소 공유 오염 분석 및 안전한 깊은 복제");
console.log("==================================================");

// [미션 1] 단순 재할당 (Reassignment) - 동일 주소 완벽 공유
const userA = { name: "철수" };

// TODO 3-1: userA 객체 변수를 userB 변수에 단순 재할당 복사하세요.
const userB = userA;
userB.name = "영희"; // 재할당본 수정

console.log(" 3-1. userA의 이름 상태:", userA.name); // "영희" (상호 공유 오염 확인)

console.log("--------------------------------------------------");

// [미션 2] 얕은 복사 (Shallow Copy) - 1단계는 분리, 2단계 중첩 객체는 오염
const original = { name: "노트북", detail: { color: "Silver" } };

// TODO 3-2: 스프레드 연산자(...)를 이용해 original의 얕은 복사본 copy를 만드세요.
const copy = { ...original };
copy.name = "태블릿";          // 1레벨 수정 (원본 무관)
copy.detail.color = "SpaceGray"; // 2레벨 수정 (중첩 객체 주소 공유 오염!)

console.log(" 3-2. 얕은 복사 - 원본 1레벨 이름:", original.name); // "노트북" (무사함)
console.log(" 3-3. 얕은 복사 - 원본 2레벨 색상:", original.detail.color); // "SpaceGray" (오염됨!)

console.log("--------------------------------------------------");

// [미션 3] 깊은 복사 (Deep Copy) - 중첩 객체까지 메모리 완벽 독립 격리
const originalObj = { name: "노트북", detail: { color: "Silver" } };

// TODO 3-3: structuredClone() API를 활용해 originalObj의 깊은 복사본 deepCopy를 생성하세요.
const deepCopy = structuredClone(originalObj);
deepCopy.detail.color = "SpaceGray"; // 중첩 객체 내부 수정

console.log(" 3-4. 깊은 복사 - 원본 2레벨 색상:", originalObj.detail.color); // "Silver" (오염 없이 무사함!)
console.log(" 3-5. 깊은 복사 - 복제본 2레벨 색상:", deepCopy.detail.color);     // "SpaceGray"

console.log("--------------------------------------------------");

// [추가 연습 3-1] 다차원 객체를 복사하여 원본을 지키는 방어 코딩 검증
// 아래 profileObj 객체를 복제하여 2레벨 중첩 속성(score.math)을 100으로 변경하되, 원본(80)이 절대로 훼손되지 않도록 깊은 복사를 적용하여 방어하세요.
const profileObj = {
  nickname: "마스터",
  score: { math: 80, science: 90 }
};

const safeCopy = structuredClone(profileObj);
safeCopy.score.math = 100;

console.log(" 3-6. 원본 수학 점수 확인(80 유지):", profileObj.score.math); // 80
console.log(" 3-7. 복제본 수학 점수 확인(100 반영):", safeCopy.score.math); // 100
console.log("==================================================");
