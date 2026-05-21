// =================================================================
// 3. 나머지 매개변수 (Rest Parameter) 실습
// =================================================================
// 💡 실행 방법: node 143-1-3_rest_parameter.js
// =================================================================

console.log("==================================================");
console.log("👉 3. 나머지 매개변수 가변 인자 수집 및 활용 연습");
console.log("==================================================");

// [미션 1] 나머지 매개변수 기본 문법
// TODO: 첫 번째 값을 first 변수에 넣고, 나머지 인자들을 rest 배열에 수집하도록 매개변수를 적어주세요.
function sumAll(first, ...rest) {
  console.log("  → 첫 번째 값(first):", first);
  console.log("  → 나머지 묶음(rest 배열):", rest);
  return rest.reduce((acc, val) => acc + val, first);
}

console.log(" 3-1. 합산 결과:", sumAll(10, 20, 30, 40)); // 100

console.log("--------------------------------------------------");

// [추가 연습 3-1] 무제한으로 입력되는 임의의 점수 인자들의 평균(average)을 계산해 반환하는 averageAll 함수를 정의하세요.
// 단, 나머지 매개변수(Rest Parameter)를 활용하여 배열 메서드(reduce 등)나 루프를 통해 구해보세요.
function averageAll(...scores) {
  if (scores.length === 0) return 0;
  const sum = scores.reduce((acc, score) => acc + score, 0);
  return sum / scores.length;
}

console.log(" 3-2. 평균 계산 (80, 95, 77, 92):", averageAll(80, 95, 77, 92)); // 86
console.log(" 3-3. 평균 계산 (100, 90):", averageAll(100, 90)); // 95
console.log("==================================================");
