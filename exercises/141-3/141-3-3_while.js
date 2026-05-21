// =================================================================
// 3. while 반복문 및 흐름 제어 실습
// =================================================================
// 💡 실행 방법: 터미널에서 아래 명령어를 입력하여 실행하세요.
//    node 141-3-3_while.js
// =================================================================

console.log("==================================================");
console.log("👉 3. while 조건 루프 및 break, continue 제어");
console.log("==================================================");

// [미션 1] 1부터 5까지 카운트 출력 (무한 루프 방어)
let number = 1;

// TODO: number가 5 이하인 동안 루프가 계속 실행되도록 조건식을 기재하세요.
while (number <= 5) {
    console.log(` 3-1. 카운트: ${number}`);
    
    // TODO: 아래 줄에 루프 변수 number를 1씩 증가시키는 연산자를 추가하세요.
    number++;
}

console.log("--------------------------------------------------");

// [미션 2] break를 활용한 강제 탈출 & continue를 활용한 건너뛰기
let scoreScanner = 0;
const scores = [65, 78, 100, 45, 92];

console.log(" 3-2. [점수 목록 순회 및 스캔 시작]");
while (scoreScanner < scores.length) {
    const currentScore = scores[scoreScanner];
    
    scoreScanner++; // 회차 갱신

    // TODO: 만약 100점을 만났을 때 "💯 만점을 찾았습니다!"를 출력하고 루프를 즉각 폭파(break) 시키세요.
    if (currentScore === 100) {
        console.log(`  → 💯 ${currentScore}점 만점을 발견하여 탐색을 즉각 조기 종료합니다.`);
        break; 
    }

    // 60점 미만 낙제 점수는 continue로 출력을 건너뜀
    if (currentScore < 60) {
        continue;
    }

    console.log(`  → 통과 점수 스캔 결과: ${currentScore}점`);
}
console.log("==================================================");
