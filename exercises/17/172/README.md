# Express + LangChainJS Agent 실습 프로젝트

본 저장소는 **Express**와 **LangChainJS**를 활용하여 다양한 LLM Agent 디자인 패턴(체인, 구조화된 출력, 대화 메모리, Fallback 복구, 앙상블 및 피드백 루프)을 실습하는 교육용 프로젝트입니다.

---

## 💡 사용 가능 및 권장(검증) 모델 목록

각 실습 단계의 백엔드(`server.js`) 및 가이드라인에서 원활하게 작동이 검증되었으며, 2026년 기준 사용을 권장하는 모델 명세입니다.

### 1. Google AI Studio (Gemini)
Google Generative AI 패키지(`@langchain/google-genai`)를 통해 연동되며, API 키는 `GEMINI_API_KEY` 환경변수로 주입받습니다.

| 모델 ID (Model ID) | 구분 | 특징 및 활용 단계 |
| :--- | :---: | :--- |
| **`gemini-3.1-flash-lite`** | **기본 추천** | 속도가 매우 빠르고 API 단가가 낮아 기본 입출력, 메모리, Fallback 실습에 최적화 (실습 01, 02, 03, 04 기본 모델) |
| **`gemma-4-26b-a4b-it`** | **최신 추천 (MoE)** | 최신 Gemma4 MoE 모델로 안정적인 분류 및 의사결정이 필요할 때 권장 (실습 05 에이전트 주 모델 및 앙상블로 사용) |

### 2. Groq
Groq 패키지(`@langchain/groq`)를 통해 연동되며, API 키는 `GROQ_API_KEY` 환경변수로 주입받습니다.

| 모델 ID (Model ID) | 구분 | 특징 및 활용 단계 |
| :--- | :---: | :--- |
| **`openai/gpt-oss-20b`** | **기본 추천** | 경량 오프소스 모델로 뛰어난 레이턴시와 준수한 추론 성능 보유 (실습 01 기본 탑재, 실습 05 앙상블 투표 모델) |
| **`meta-llama/llama-4-scout-17b-16e-instruct`** | **참고 모델** | 최신 Llama 4 Scout 계열 모델로 범용 에이전트 지침 이해도 우수 |
| **`openai/gpt-oss-120b`** | **참고 모델** | 복잡한 코딩 가이드나 대량 추론 태스크가 결합될 때 최적화 |
| **`qwen/qwen3-32b`** | **참고 모델** | 다국어 처리 및 복잡한 정형 데이터 파싱에 강점 |

### 3. NVIDIA NIM
NVIDIA NIM 연동 시 패키지는 `@langchain/openai`를 사용하여 OpenAI Compatible 호환 모드로 연동되며, API 키는 `NVIDIA_API_KEY` 환경변수로 주입받습니다.

* **Base URL**: `https://integrate.api.nvidia.com/v1`

| 모델 ID (Model ID) | 구분 | 특징 및 활용 단계 |
| :--- | :---: | :--- |
| **`deepseek-ai/deepseek-v4-flash`** | **기본 추천** | 고성능 추론 성능을 가진 DeepSeek v4 계열 Flash 모델 (실습 05 앙상블 투표 모델) |
| **`google/gemma-4-31b-it`** | **최신 추천 (Dense)** | 최신 Gemma4 Dense 아키텍처 모델 (실습 01 기본 탑재) |
| **`deepseek-ai/deepseek-v4-pro`** | **참고 모델** | 극도의 추론 복잡도를 해결해야 할 때 사용하는 Pro 등급 모델 |
| **`qwen/qwen3.5-397b-a17b`** | **참고 모델** | Qwen 3.5 최신 초거대 파라미터 MoE 추론 특화 모델 |
| **`qwen/qwen3-next-80b-a3b-instruct`** | **참고 모델** | 차세대 Qwen3 아키텍처의 고성능 에이전트 지시 이행 모델 |

---

## 🏃‍♂️ 실습 프로젝트 실행 가이드

각 실습 폴더 내부의 `.env` 파일에 필요한 API 키들을 기입한 뒤 아래 스크립트로 실행합니다.

```bash
# 의존성 설치
npm install

# 01. 기본 LLM 체인 연동 실습 (.invoke)
npm run 01

# 02. 구조화된 출력 실습 (withStructuredOutput)
npm run 02

# 03. 브라우저 로컬스토리지 연동형 대화 메모리 실습
npm run 03

# 04. 에러 대응 및 자동 장애 복구 실습 (.withFallbacks)
npm run 04

# 05. 에이전트 디자인 패턴 통합 실습 (모델 간 앙상블, 다중 분류, 피드백 루프)
npm run 05
```
