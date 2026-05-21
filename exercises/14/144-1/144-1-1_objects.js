// =================================================================
// 1. 객체 (Object) CRUD 및 순회 실습
// =================================================================
// 💡 실행 방법: node 144-1-1_objects.js
// =================================================================

console.log("==================================================");
console.log("👉 1. 객체의 속성 CRUD 조작 및 Object 정적 메서드");
console.log("==================================================");

// [미션 1] 객체의 기본적인 CRUD 조작
const car = {
  brand: "Hyundai",
  speed: 120
};

// TODO 1-1: car 객체에 주행 여부를 나타내는 isDriving 속성(값: true)을 추가하세요. (Create)
car.isDriving = true;

// TODO 1-2: speed 속성을 140으로 변경하세요. (Update)
car.speed = 140;

// TODO 1-3: brand 속성을 delete 연산자로 제거하세요. (Delete)
delete car.brand;

console.log(" 1-1. car 객체 최종 상태:", car);
// { speed: 140, isDriving: true } 출력 확인

// [추가 연습 1-1] 사용자 프로필 객체 profile을 만들고 아래 미션을 수행하세요.
// 1. name: "준우", age: 25 로 초기 객체 생성
// 2. 새로운 속성 email: "jun@example.com" 추가
// 3. age 값을 26으로 1살 증가 변경
// 4. name 속성 제거
const profile = { name: "준우", age: 25 };
profile.email = "jun@example.com";
profile.age = 26;
delete profile.name;
console.log(" 1-2. profile 추가 연습 결과:", profile);

console.log("--------------------------------------------------");

// [미션 2] Object 정적 메서드를 활용한 데이터 순회
const stats = { hp: 120, mp: 50, atk: 35 };

// TODO 2-1: Object.keys()를 이용해 stats의 모든 키 배열을 추출해 출력하세요.
const keys = Object.keys(stats);
console.log(" 1-3. stats 키 목록:", keys); // ["hp", "mp", "atk"]

// TODO 2-2: Object.values()를 이용해 stats의 모든 값 배열을 추출해 출력하세요.
const values = Object.values(stats);
console.log(" 1-4. stats 값 목록:", values); // [120, 50, 35]

// TODO 2-3: Object.entries()를 이용해 stats의 [키, 값] 쌍을 모은 2차원 배열을 출력하세요.
const entries = Object.entries(stats);
console.log(" 1-5. stats 엔트리 목록:", entries);

// [추가 연습 1-2] Object.values()와 reduce() 메서드를 이용해 stats 모든 능력치의 총합을 계산해 출력하세요.
const totalStat = Object.values(stats).reduce((acc, val) => acc + val, 0);
console.log(" 1-6. 능력치 총합 계산 결과:", totalStat); // 205
console.log("==================================================");
