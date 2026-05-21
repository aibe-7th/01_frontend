// =================================================================
// 1. 배열 고차함수 (forEach, map, filter, reduce) 실습
// =================================================================
// 💡 실행 방법: node 144-2-1_higher_order.js
// =================================================================

console.log("==================================================");
console.log("👉 1. 대표 배열 고차함수 4대장 개별 기능 실습");
console.log("==================================================");

const numbers = [10, 20, 30, 40];

// TODO 1-1: forEach를 사용해 numbers의 모든 값을 차례대로 출력하세요.
console.log(" 1-1. forEach 순회:");
numbers.forEach(n => console.log("  → 값:", n));

// TODO 1-2: map을 사용해 numbers의 모든 값을 2배씩 가공한 새 배열을 만드세요.
const doubled = numbers.map(n => n * 2);
console.log(" 1-2. map 2배 가공 배열:", doubled); // [20, 40, 60, 80]

// TODO 1-3: filter를 사용해 numbers에서 25보다 큰 숫자들만 추린 새 배열을 만드세요.
const filtered = numbers.filter(n => n > 25);
console.log(" 1-3. filter 조건 여과 배열:", filtered); // [30, 40]

// TODO 1-4: reduce를 사용해 numbers의 모든 요소를 더한 누적 합계를 구하세요.
const totalSum = numbers.reduce((acc, cur) => acc + cur, 0);
console.log(" 1-4. reduce 전체 합산 결과:", totalSum); // 100

console.log("--------------------------------------------------");

// [추가 연습 1-1] 가상의 쇼핑 상품 목록 장바구니 데이터를 바탕으로 미션을 해결하세요.
const cart = [
  { name: "키보드", price: 50000, category: "electronics" },
  { name: "마우스", price: 30000, category: "electronics" },
  { name: "사과", price: 5000, category: "food" },
  { name: "노트북", price: 1200000, category: "electronics" }
];

// 1. map을 사용해 상품명만 모아놓은 새 배열 productNames를 만드세요.
const productNames = cart.map(item => item.name);
console.log("  → 1) 상품명 목록:", productNames);

// 2. filter를 사용해 카테고리가 "electronics"인 상품들만 모아놓은 새 배열 electronicsItems를 만드세요.
const electronicsItems = cart.filter(item => item.category === "electronics");
console.log("  → 2) 전자기기 목록:", electronicsItems);

// 3. reduce를 사용해 모든 상품 가격(price)의 총합을 계산해 출력하세요.
const cartTotalPrice = cart.reduce((acc, item) => acc + item.price, 0);
console.log("  → 3) 장바구니 총액:", cartTotalPrice); // 1285000
console.log("==================================================");
