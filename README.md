# Gemini 챗봇

브라우저에서 바로 실행되는 Gemini API 기반 채팅 웹앱입니다.

## 사용법

1. `index.html`을 브라우저로 엽니다.
2. 오른쪽 위 ⚙️ 버튼을 눌러 [Google AI Studio](https://aistudio.google.com/apikey)에서 발급받은 Gemini API 키를 입력하고 저장합니다.
3. 메시지를 입력하고 Enter(또는 보내기 버튼)를 눌러 대화를 시작합니다.

API 키는 브라우저의 localStorage에만 저장되며 별도 서버로 전송되지 않습니다. 단, 이 앱은 클라이언트 사이드에서 직접 API를 호출하므로 브라우저 개발자 도구를 통해 키가 노출될 수 있습니다. 개인 사용 용도로만 사용하세요.
