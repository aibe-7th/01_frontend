// =================================================================
// 3. 맵 (Map) & 셋 (Set) 자료 구조 실습
// =================================================================
// 💡 실행 방법: node 144-1-3_maps_sets.js
// =================================================================

console.log("==================================================");
console.log("👉 3. Map 키-값 컬렉션 제어 및 Set 중복 원소 제거");
console.log("==================================================");

// [미션 1] Map 객체 다루기
const memberMap = new Map();

// TODO 1-1: set을 활용해 id_01: "김철수", id_02: "이영희" 정보를 추가하세요.
memberMap.set("id_01", "김철수");
memberMap.set("id_02", "이영희");

// TODO 1-2: get을 사용해 "id_01" 회원의 이름을 출력하세요.
console.log(" 3-1. id_01 회원 이름:", memberMap.get("id_01")); // "김철수"

// TODO 1-3: size를 활용해 현재 등록된 회원 총인원을 출력하세요.
console.log(" 3-2. 현재 총 회원 수:", memberMap.size); // 2

// TODO 1-4: delete를 사용하여 "id_02" 회원을 영구 삭제하세요.
memberMap.delete("id_02");
console.log(" 3-3. id_02 회원 존재 여부:", memberMap.has("id_02")); // false

// [추가 연습 3-1] 객체(Object)를 Key로 사용하는 고급 Map 활용 실습
// 1. 객체 keyObj = { code: 101 } 생성
// 2. productMap을 새로 선언하여 keyObj를 Key로 하고 값으로 "프리미엄 노트북"을 바인딩하세요.
// 3. get 메서드로 해당 상품명을 안전하게 추출해 보세요.
const keyObj = { code: 101 };
const productMap = new Map();
productMap.set(keyObj, "프리미엄 노트북");
console.log(" 3-4. 객체 키 기반 조회 결과:", productMap.get(keyObj)); // "프리미엄 노트북"

console.log("--------------------------------------------------");

// [미션 2] Set 객체 다루기 및 배열 중복 요소 제거 원스톱 트릭
const colorSet = new Set();

// TODO 2-1: add를 이용하여 "Red", "Blue", "Red" 순서로 저장하세요.
colorSet.add("Red");
colorSet.add("Blue");
colorSet.add("Red"); // 중복 삽입 시도

console.log(" 3-5. Set의 총 요소 개수(중복 제외):", colorSet.size); // 2 (Red 중복 제외)

// [추가 연습 3-2] 배열 중복 원소 일괄 정화 미션
// 아래 duplicateScores 배열의 우글거리는 중복 점수들을 Set과 스프레드 연산자(...)를 사용해 단 한 줄로 깔끔하게 중복이 필터링된 배열로 만드세요.
const duplicateScores = [90, 80, 90, 100, 80, 70];
const uniqueScores = [...new Set(duplicateScores)];
console.log(" 3-6. 중복이 전격 청소된 유니크 배열:", uniqueScores); // [90, 80, 100, 70]
console.log("==================================================");
