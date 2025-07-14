# Arc - Elo 기반 스포츠 매칭 플랫폼

실력 기반 매칭과 토큰 보상 시스템을 제공하는 스포츠 커뮤니티입니다.

## 주요 기능

- **Elo 기반 매칭**: 실력에 따른 공정한 매칭 시스템
- **다양한 스포츠**: 테니스, 배드민턴, 탁구, 당구, 바둑, 체스
- **토큰 보상**: 게임 참여 및 커뮤니티 활동에 대한 보상
- **Web3 지갑**: Wepin을 통한 구글 로그인 및 지갑 관리
- **커뮤니티**: 종목별 게시판 및 정보 공유

## 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Styled Components
- **Web3**: Wepin SDK
- **Authentication**: Google OAuth + Wepin Wallet

## 시작하기

### 1. 환경 설정

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
```

### 2. Wepin SDK 설정

`.env.local` 파일에 다음 환경 변수를 설정하세요:

```env
# Wepin SDK Configuration
NEXT_PUBLIC_WEPIN_APP_ID=your_app_id_here
NEXT_PUBLIC_WEPIN_APP_KEY=your_app_key_here
```

Wepin App ID와 App Key는 [Wepin 개발자 콘솔](https://docs.wepin.io)에서 발급받을 수 있습니다.

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── login/             # 로그인 페이지
│   ├── elo/               # Elo 매칭 시스템
│   ├── profile/           # 사용자 프로필
│   └── community/         # 커뮤니티
├── components/            # 재사용 가능한 컴포넌트
├── contexts/              # React Context
├── hooks/                 # Custom Hooks
├── lib/                   # 유틸리티 함수
├── styles/                # 전역 스타일
└── constants/             # 상수 정의
```

## 인증 플로우

1. 사용자가 `/login` 페이지 접속
2. "구글 계정으로 시작하기" 버튼 클릭
3. Wepin SDK를 통한 구글 로그인
4. 자동으로 지갑 생성 및 연결
5. 생성된 지갑 주소를 사용자 ID로 사용
6. 메인 서비스 이용 가능

## 배포

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 라이선스

MIT License
