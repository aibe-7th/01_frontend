// =================================================================
// 4. 구조 분해 할당 (Destructuring) 실습
// =================================================================
// 💡 실행 방법: node 143-1-4_destructuring.js
// =================================================================

console.log("==================================================");
console.log("👉 4. 객체 및 배열 구조 분해 할당과 스왑(Swap)");
console.log("==================================================");

// [미션 1] 객체 구조 분해 할당 및 별칭(Alias)
const product = { name: "노트북", price: 1500000 };

// TODO: 구조 분해 할당을 통해 name과 price 변수를 추출해 보세요.
const { name, price } = product;
console.log(" 4-1. 노트북 정보 추출:", name, price);

// TODO: name 속성을 productName이라는 별칭 변수명으로 추출해 보세요.
const { name: productName } = product;
console.log(" 4-2. 별칭으로 추출:", productName);

// [추가 연습 4-1] 아래 user 객체에서 id, email 속성을 구조 분해 할당으로 추출하세요.
// 단, 이메일이 없을 경우를 대비해 email에 "이메일 없음"이 기본값으로 매치되도록 작성하세요.
const user = { id: "user_01", nickname: "철수" };
const { id, email = "이메일 없음" } = user;
console.log(" 4-3. 기본값을 적용한 속성 추출:", id, email); // user_01 이메일 없음

console.log("--------------------------------------------------");

// [미션 2] 배열 구조 분해 할당
const scores = [95, 82, 74, 60];

// TODO: 첫 번째(first), 두 번째(second)를 담고, 세 번째 값을 건너뛴 뒤 네 번째(fourth) 변수에 담으세요.
const [first, second, , fourth] = scores;
console.log(" 4-4. 과목 점수 추출:", first, second, fourth); // 95 82 60

// [추가 연습 4-2] 아래 rgb 배열에서 빨강, 녹색, 파랑 중 빨강(red)과 파랑(blue)만 구조 분해 할당으로 추출해 보세요.
const rgb = ["Red", "Green", "Blue"];
const [red, , blue] = rgb;
console.log(" 4-5. 색상 추출:", red, blue); // Red Blue

console.log("--------------------------------------------------");

// [미션 3] 임시 변수 없는 변수 스왑 (Value Swap)
let a = 1;
let b = 2;

// TODO: 배열 구조 분해 할당을 사용해 임시 변수 없이 a와 b의 값을 맞바꾸세요.
[a, b] = [b, a];

console.log(" 4-6. 변수 맞바꾸기(Swap) 결과:", a, b); // 2 1
console.log("==================================================");
