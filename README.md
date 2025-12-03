# 📈 Subscriber Count-Up Animation

> 홈페이지 프로모션용 구독자 수 카운트업 애니메이션

## 📝 프로젝트 개요

이 프로젝트는 다음 요구사항을 만족하는 구독자 수 애니메이션입니다:

- React + TypeScript 기반
- 1에서 147까지 3초 동안 카운트업
- 숫자 뒤에 "M"(million) 단위 항상 표시
- 느린 기기(낮은 FPS)에서도 3초의 실행시간 보장
- 애니메이션 라이브러리 사용 안 함

## 🚀 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:5173(또는 Vite가 출력하는 주소)로 접속합니다.

## 🛠 기술 스택

- **React 18** (with TypeScript)
- **Vite** - 빠른 개발 서버
- **Tailwind CSS** - 스타일링

## 📁 프로젝트 구조

```
subscriber-count-animation/
├── src/
│   ├── components/
│   │   └── CountUp.tsx          # 메인 카운트업 컴포넌트
│   ├── App.tsx                  # 앱 진입점
│   └── main.tsx                 # React 렌더링
├── package.json
├── tsconfig.json
└── README.md
```

## 💡 기술적 의사결정

카운터를 구현하는 방법으로 setInterval을 사용하는 방법, 그리고 requestAnimationFrame을 사용하는 방법을 생각해보았습니다. 최종적으로 이번 프로젝트에서는 시간을 기반으로한 requestAnimationFrame을 사용하는 방식을 선택했고, 그 이유는 아래와 같습니다.

### 1) setInterval을 사용하는 방식

```tsx
const step = 3000 / 147; // 약 20.4ms
setInterval(() => setCount((c) => c + 1), step);
```

이러한 방법으로 접근했을때, setInterval은 브라우저 타이머가 관리하기 때문에 정확한 타이밍에 tick을 보낼 수 있지만, 그와 별개로 setInterval의 콜백 실행은 메인스레드가 비어있을 때만 실행됩니다. 따라서 실제 실행 간격은 불규칙적이 될 수 있습니다.

또한 애니메이션에서 가장 중요한 것은 FPS와 동기화 되는 것인데, setInterval은 FPS와 동기화 되지 않기 때문에 설령 setInterval의 콜백이 규칙적으로 실행되더라도, 콜백 실행 시점이 브라우저의 페인트 타이밍과 맞지 않기 때문에, 숫자 업데이트가 화면에 반영되는 시점은 불규칙하게 느껴질 수 있습니다. 특히 CPU가 느린 환경에서는 메인스레드가 비어있을 때만 실행되기 때문에, 실제 실행 간격은 불규칙적이 될 수 있습니다.

### 2) requestAnimationFrame을 사용하는 방식

반면 requestAnimationFrame은 브라우저의 페인트 타이밍과 동기화되기 때문에, 숫자 업데이트가 화면에 반영되는 시점 자체가 안정적으로 보장됩니다. 즉, 각 업데이트가 실제 렌더링 직전에 실행되므로, 애니메이션이 끊기지 않고 자연스럽게 보입니다.

또한 requestAnimationFrame 콜백은 매 프레임마다 현재 시간을 timestamp로 전달받기 때문에, 아래와 같이 경과 시간 기반으로 진행률을 계산하는 것이 가능합니다.

```typescript
const progress = elapsed / 3000;
const value = Math.floor(1 + (147 - 1) * progress);
```

이 방식을 사용하면 FPS가 낮아지더라도 프레임 수에 의존하지 않고 정확한 실행시간을 보장할 수 있습니다. 즉, 저사양 기기나 CPU 부하가 높은 상황에서도 주어진 시간안에 카운트가 완료되도록 보장할 수 있습니다.

## 🧪 테스트 방법

과제 요구사항인 "Slow render safeguard"를 테스트 하기 위해 크롬 개발자 도구의 Performance 탭을 사용하여 테스트 했습니다.

1. 크롬 개발자 도구 열기
2. Performance 탭 → CPU: 4x slowdown 선택
3. 페이지 새로고침
4. 콘솔에서 performance.now()를 통해 계산한 결과값이 3000ms에 충분히 근접하는지 확인
