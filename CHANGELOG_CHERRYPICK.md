<!--
## 4.x.x
출시일: unreleased<br>
기반 Misskey 버전: 2024.x.x<br>
Misskey의 전체 변경 사항을 확인하려면, [CHANGELOG.md#2024xx](CHANGELOG.md#2024xx) 문서를 참고하십시오.

### NOTE
- 

### General
- 

### Client
- 

### Server
- 

---

-->

# 릴리스 노트
이 문서는 CherryPick의 변경 사항만 포함합니다.

## 4.x.x
출시일: unreleased<br>
기반 Misskey 버전: 2024.x.x<br>
Misskey의 전체 변경 사항을 확인하려면, [CHANGELOG.md#2024xx](CHANGELOG.md#2024xx) 문서를 참고하십시오.

### General
- Feat: 계정 정리 기능 ([yodangang-express/cherrypick@dc51c907](https://github.com/yodangang-express/cherrypick/commit/dc51c907236570d6f072409832d312c937239514))
  - `다이렉트 메시지` 및 `고정된 노트`와 관련된 파일을 제외한 모든 노트와 파일을 자동으로 삭제할 수 있음

### Client
- Enhance: 사용자 페이지에서 `이름`, `자기소개`, `팔로우 메시지`, `추가 정보`에 포함된 외부 이모지를 가져올 수 있음
- Enhance: 노트에 여러 장의 이미지가 있을 때 미디어 탭에서 이미지 수를 숫자로 표시함
- Enhance: 키보드 단축키 목록을 볼 수 있음 (kokonect-link/cherrypick#562)
- Fix: 노트 헤더의 사용자 이름을 클릭하면 페이지가 중복으로 이동됨
- Fix: CherryPick 클라이언트 업데이트 알림이 잘못 반환될 수 있음
  - 출시 전 빌드 태그가 고려되지 않음(`alpha`, `beta`, `rc`)
    - 예: `4.14.2 < 4.14.3-alpha.0` 계산 시 `4.14.2`가 더 큰 것으로 계산됨
- Fix: 파일을 포함한 노트에서 일부 기능이 제대로 작동하지 않을 수 있음 (kokonect-link/cherrypick#552)
  - 사용자 페이지에서 다음 기능이 제대로 작동하지 않을 수 있는 문제가 수정됨
    - `민감한 미디어 표시` 설정이 반영되지 않음
    - `민감한 콘텐츠로 표시된 미디어를 열 때` 설정이 반영되지 않음
    - `데이터 절약 모드` 설정이 반영되지 않음
  - 미디어 왼쪽 상단에 `ALT`/`GIF`/`APNG`/`NSFW` 표시

### Server
- Fix: 신고 즉시 해결 기능에서 발생할 수 있는 일부 문제 해결 ([misskey-dev/misskey#11032 (review)](https://github.com/misskey-dev/misskey/pull/11032#pullrequestreview-2425669540))
	- forward가 `true`가 되면 `false`로 변경할 수 없음
- Fix: 채널에서 `노트 게시 예약`을 사용하면 채널 타임라인이 아닌 일반 타임라인에 게시됨 (kokonect-link/cherrypick#559)

---

## 4.14.2
출시일: 2025/1/3<br>
기반 Misskey 버전: 2024.11.1-alpha.0<br>
Misskey의 전체 변경 사항을 확인하려면, [CHANGELOG.md#2024111](CHANGELOG.md#2024111) 문서를 참고하십시오.

### Client
- Enhance: 노트 상세 페이지에서 공개 범위를 자세히 표시하도록 개선됨
- Fix: 노트 상세 페이지에서 역할 아이콘에 문제가 발생할 수 있음
  - 중복으로 표시될 수 있음
  - 아이콘이 제대로 표시되지 않을 수 있음

---

## 4.14.1
출시일: 2025/1/2<br>
기반 Misskey 버전: 2024.11.1-alpha.0<br>
Misskey의 전체 변경 사항을 확인하려면, [CHANGELOG.md#2024111](CHANGELOG.md#2024111) 문서를 참고하십시오.

### General
- Feat: 번역 서비스 추가 지원 (kokonect-link/cherrypick#551)
  - [LibreTranslate](https://github.com/LibreTranslate/LibreTranslate) 지원 추가
    - 외부 서비스를 이용하는 번역 서비스는 요금제에 따른 API 제한이 적용되므로, 자체 호스팅으로 구동할 수 있는 번역 API를 사용할 수 있음
- Feat: 검색 엔진 사용자화 (kokonect-link/cherrypick#554)
  - MFC 구문 중 `[검색]`, `[search]`, `[検索]`를 사용했을 때, 사용할 검색 엔진을 지정할 수 있음
- Enhance: 예약된 노트 게시에 실패할 경우 사용자에게 알림 ([penginn-net/kokonect@a0e47980](https://github.com/penginn-net/kokonect/commit/a0e47980470b49e79e84ff3b7ccaf2b4502928c8))

### Client
- Fix: 노트 상세 페이지에서 사용자 이름이 중복으로 표시될 수 있음
- Fix: 커스텀 이모지 관리 역할이 있는 사용자가 원격 서버의 이모지를 가져올 수 없음
- Fix: 신고 알림을 받을 이메일 주소 설정을 저장할 수 없음 (kokonect-link/cherrypick#540)
- Fix: 네비게이션 바에 배너 이미지가 표시되지 않을 수 있음 (kokonect-link/cherrypick#545)
- Fix: 고정된 리스트 타임라인을 사용할 수 없음 (kokonect-link/cherrypick#546)
- Fix: 버블 타임라인이 비활성화 상태면 버블 타임라인의 호스트 목록을 수정할 수 없음 (kokonect-link/cherrypick#544)
- Fix: 특정 환경에서 리액션을 변경할 수 없을 수 있음 (kokonect-link/cherrypick#549)

---

## 4.14.0
출시일: 2024/11/26<br>
기반 Misskey 버전: 2024.11.0<br>
Misskey의 전체 변경 사항을 확인하려면, [CHANGELOG.md#2024110](CHANGELOG.md#2024110) 문서를 참고하십시오.

### General
- Feat: 버블 타임라인 (kokonect-link/cherrypick#512, [TransFem-org/Sharkey#154](https://activitypub.software/TransFem-org/Sharkey/-/issues/154), [TransFem-org/Sharkey@2f99c7e9](https://activitypub.software/TransFem-org/Sharkey/-/commit/2f99c7e9dc2e5e3ca06c9672a6ab4887eb094310))
  - 관리자가 설정한 서버의 게시글만 볼 수 있는 타임라인으로, 글로벌 타임라인의 무분별한 내용을 포함하는 게시글을 제한하는 목적으로 사용할 수 있습니다.
- Enhance: 모더레이터 부재 감지 기간을 사용자화할 수 있음
  - 기간은 최소 `1`일부터 최대 `30`일까지 설정할 수 있습니다.
    - `0`일로 설정하면 최소 기간인 `1`일로 설정되며, `30`일을 초과하는 값을 입력하면 최대 기간인 `30`일로 설정됩니다.
  - 여기서 설정된 기간은 `초대제로 전환` 옵션과 `공개 노트 허용` 옵션 모두에 적용됩니다.

### Client
- Enhance: 미디어 그리드 레이아옷 조정
  - 여러 장의 이미지가 있을 때 표시되는 아이콘을 보다 명확하게 볼 수 있도록 개선됨
  - 배경과 같은 이미지를 구분하기 쉽도록 배경색 및 구분선 추가
- Enhance: 외부 사이트 이동 경고 표시 개선 (kokonect-link/cherrypick#533)
  - 신뢰할 수 있는 도메인 목록을 편집할 수 있음
  - 경고를 표시하지 않도록 설정할 수 있음
- Enhance: Bluesky 게시물 임베디드 미리보기 지원 (misskey-dev/misskey#14933)
- Fix: 아바타 장식에서 가이드라인이 표시되지 않음
- Fix: 설정 페이지에서 글자수가 긴 일부 항목의 디자인이 잘못 표시될 수 있음
- Fix: 서브 노트의 동작 버튼이 정상적으로 작동하지 않을 수 있음 (kokonect-link/cherrypick#536)

### Server
- Fix: 그룹 초대 알림을 수락하거나 거절하면 알림 목록을 볼 수 없음
- Fix: 모더레이터 부재 경고의 한국어 경고 내용에 일본어가 포함됨

---

## 4.13.0
출시일: 2024/11/14<br>
기반 Misskey 버전: 2024.10.1<br>
Misskey의 전체 변경 사항을 확인하려면, [CHANGELOG.md#2024101](CHANGELOG.md#2024101) 문서를 참고하십시오.

### NOTE
- Misskey 2024.10.1에 적용된 `스팸 대책`의 일부 개선 안내
  - 이 변경은 다양한 상황에서 관리자가 보다 유연하게 운영할 수 있도록 합니다.
  - 기존의 `7일 경과 시 초대제로 전환` 정책을 세분화 합니다.
    - 7일 경과 시 `초대제로 전환` 여부를 선택할 수 있음
    - 7일 경과 시 `공개 노트 허용` 여부를 선택할 수 있음
  - 시스템에 의해 변경된 경우에는 모더레이터에게 알림이 표시되며, 변경된 설정을 다시 복원하기 위해서는 제어판에서 수동으로 설정을 복원해야 합니다.
- `캡션 미설정 안내`의 기본값이 꺼짐으로 변경됨
  - 대부분의 소프트웨어에서 이 설정은 기본적으로 비활성화되어 있습니다.
  - 또한, 이 설정은 대부분의 사용자가 반드시 캡션을 설정할 필요는 없으므로 기본적으로 비활성화 됩니다.

### General
- Feat: 투표 내용 번역
  - 이제 투표 내용을 그대로 번역해서 볼 수 있으며, 번역된 투표 항목과 상호작용해 바로 투표할 수도 있습니다.
- Feat: `좋아요!` 버튼의 기본 리액션을 설정할 수 있음 (team-shahu/misskey#41)

### Client
- Enhance: 노트 작성 영역에서 각 항목이 더 잘 구분되도록 조정함
- Enhance: `노트 삭제 예약`이 설정된 노트의 노트 삭제 시간을 알 수 있음
- Enhance: 로그인 및 인증 화면에서 `Enter`를 입력하면 다음 단계로 이동할 수 있음
- Enhance: 로그인 알림 개선
  - 로그인 알림에서 로그인 한 장치의 `IP`를 표시하고 승인되지 않은 기기에 대한 대응 방법이 표시됩니다.
- Enhance: 노트 상세 페이지의 노트 헤더에서도 `편집됨`과 `노트 삭제 예약` 아이콘을 표시함
- Enhance: 타임라인의 옵션 메뉴에서 타임라인 탭을 편집할 수 있음 (kokonect-link/cherrypick#528)
- Enhance: 타임라인을 모두 비활성화하면 타임라인이 비활성화되었다는 안내 문구 표시
- Enhance: 항상 `고양이체로 표시하지 않기`로 설정할 수 있음
- Fix: (Friendly) 알림 영역에 `새 노트` 탭이 누락됨
- Fix: 노트 삭제 예약 기한을 `기간 지정`으로 설정한 경우 노트가 즉시 삭제될 수 있음
- Fix: 이벤트가 포함된 노트를 `삭제 후 편집` 또는 `내용 복사 후 편집`할 때, 이벤트를 편집하지 않으면 노트를 게시할 수 없음
- Fix: `노트 삭제 예약`이 적용된 노트의 상태가 표시되지 않음
- Fix: 상대방을 차단했을 때 팔로우 버튼이 표시됨
	- 상대방을 차단한 경우, 팔로우를 할 수 없으므로 팔로우 버튼을 숨깁니다.
- Fix: `노트 삭제 예약`을 활성화한 상태로 옵션을 수정하지 않고 노트를 게시하면 노트 삭제 예약이 적용되지 않을 수 있음
- Fix: 투표가 있는 노트에 답글을 작성할 때 노트 작성 영역에서 투표가 표시되지 않을 수 있음
- Fix: 환경설정 백업 시 일부 설정이 누락되어 백업될 수 있음
- Fix: 로그인 화면에서 `Enter`를 입력하면 Captcha 화면을 클릭할 때 로그인 화면이 사라질 수 있음

### Server
- Feat: 연합 대응 확장
  - 이제 노트를 작성 또는 편집하면 다음 항목이 연합됩니다.
    - `우클릭 방지`
    - `노트 삭제 예약`(삭제 예약 날짜 확인 가능)
- Enhance: 노트 편집 제한 강화
	- 5분에 10번 편집할 수 있던 것을 5분에 5번 편집할 수 있도록 제한함.
- Enhance: 노트 편집 강화
  - 노트 편집 시 다음 항목도 편집할 수 있게 됩니다.
    - `이벤트`
    - `노트 삭제 예약`
    - `우클릭 방지`
- Enhance: 로그인 알림 개선
  - 로그인 알림에서 로그인 한 장치의 `IP`를 표시하고 승인되지 않은 기기에 대한 대응 방법이 표시됩니다.
- Enhance: 노트 추출 대응 항목 확장
  - 다음 항목이 노트 추출에 대응합니다.
    - `이벤트`
    - `우클릭 방지`
- Enhance: 노트 게시를 예약할 때 `노트 삭제 예약`도 같이 사용할 수 있음

---

## 4.12.1
출시일: 2024/11/5<br>
기반 Misskey 버전: 2024.9.0<br>
Misskey의 전체 변경 사항을 확인하려면, [CHANGELOG.md#202490](CHANGELOG.md#202490) 문서를 참고하십시오.

### NOTE
- `오브젝트 스토리지 (리모트)`의 내부 변경으로 인해 DB 마이그레이션 과정에서 이전에 설정한 값이 제거됩니다. 마이그레이션 이후 값을 다시 설정해 주십시오.

### General
- Feat: 사용자 메뉴에서 서버를 뮤트할 수 있음 (kokonect-link/cherrypick#502)
  - 이전 빌드에 추가된 기능은 관리자 전용이며, 이 빌드에서 추가된 기능은 일반 사용자용 기능입니다.
- Feat: 새 노트 알림을 묶어서 표시할 수 있음 (yojo-art/cherrypick#328)
- Feat: 노트 게시를 예약할 수 있음 (kokonect-link/cherrypick#513, yojo-art/cherrypick#483, [Type4ny-Project/Type4ny@271c872c](https://github.com/Type4ny-Project/Type4ny/commit/271c872c97f215ef5d8e0be62251dd422a52e5b1))

### Client
- Enhance: (Friendly) 모바일 환경에서 계정 목록을 표시할 때 내 프로필을 표시함
- Enhance: 업데이트 및 마이그레이션 알림에서 CherryPick의 변경 사항만 표시함
- Enhance: 검색과 같은 입력 블록에서 `Enter`를 입력하면 자동으로 가상 키보드를 숨김
- Enhance: 환영 페이지의 타임라인에서 사용할 수 있는 일부 노트 메뉴 추가
  - QR 코드 생성
  - 새 탭에서 열기
  - 리노트 목록
  - 리액션 목록
  - 텍스트 소스 보기
  - 고양이체로 표시하지 않기
- Enhance: 노트 작성 폼의 사용자 선택 메뉴에서 현재 계정과 로그인된 추가 계정 영역을 구분함
- Enhance: 모바일 환경에서 토스트 알림의 디자인 및 배치를 개선함
- Enhance: 로그인 시 표시되는 환영 메시지의 표시 유무를 선택할 수 있음
- Ehhance: `텍스트 소스 보기`를 사용하면 자동으로 내용을 펼침
- Enhance: 사용자 메뉴에서 서버 정보 페이지로 갈 수 있는 바로 가기를 추가함
- Enhance: 사용자 페이지와 사용자 팝업 개선
  - 사용자 페이지와 사용자 팝업에 `새 노트 알림 켜기` 버튼이 추가됨
  - 사용자 페이지에 `사용자 노트 검색` 버튼이 추가됨
- Enhance: 상대방이 나를 차단한 경우 차단되었음을 알 수 있도록 개선함
  - 차단되면 다음 기능들이 화면 상에서 사라지고 사용이 제한됩니다.
    - 팔로우 버튼
    - 사용자 페이지에서 기본 정보 외 다른 모든 정보는 열람할 수 없음
    - 사용자 페이지에서 요약 탭 외에 모든 탭이 사용할 수 없게됨
- Fix: 임베디드 코드에서 CherryPick의 색상 설정이 반영되지 않음
- Fix: 임베디드 코드에 `fade`와 `Temml(KaTex)`가 반영되지 않음
- Fix: 노트의 QR 코드를 생성했을 때 `링크 복사` 버튼을 누르면 잘못된 토스트 알림이 표시됨
- Fix: 노트 메뉴에 `링크 복사` 옵션이 표시되지 않음
- Fix: 서버 이름에 마크업 언어가 포함되어 있으면 외부 사이트로 이동할 때 표시되는 대화상자에서 서버 이름이 잘못 표시될 수 있음
- Fix: 로그인 하지 않은 사용자가 노트 내용에 포함된 이모지를 누르면 이모지 복사 및 리액션 메뉴에 접근할 수 있음
- Fix: 모바일 환경에서 노트 작성 폼의 미리보기 디자인이 잘못 표시될 수 있음
- Fix: 리버시에서 커스텀 이모지를 리액션으로 보낼 수 없음
- Fix: 리버시에서 리액션할 때 말풍선의 위치가 어긋나 보일 수 있음
- Fix: 특정 조건에서 노트 동작 버튼을 비활성화 해도 버튼이 사라지지 않음
  - 노트에 답글을 작성할 수 없을 때
  - 노트를 리노트할 수 없을 때
- Fix: 캡션이 512자를 초과하면 초과한 내용이 잘릴 수 있음 (kokonect-link/cherrypick#518)
  - 캡션을 512자를 초과해서 작성하면 캡션 내용을 저장하기 전에 경고를 표시합니다.
- Fix: 노트 상세 페이지의 InstanceTicker에 커서를 올릴 때 마우스 포인터가 올바르게 표시되지 않음
- Fix: `UI에 흐림 효과 사용` 옵션이 토스트 알림에서 제대로 적용되지 않음
  - 모바일 환경에서만 적용되는 문제를 해결합니다.
- Fix: 모바일 환경에서 제어판의 인디케이터가 잘못된 위치에 표시될 수 있음
- Fix: `답글을 자동으로 더 보기`를 활성화하면 3개 미만의 답글이 있는 노트에서 답글이 보이지 않음 (kokonect-link/cherrypick#521)
- Fix: 제어판에서 문의처 URL이 설정되지 않았을 때 표시되는 경고의 바로가기가 잘못 설정되어 있음
- Fix: 캡션이 설정된 이미지 위에 마우스 커서를 올려도 캡션이 표시되지 않음 (kokonect-link/cherrypick#514)
- Fix: 코드 편집기의 커서 위치가 올바르게 표시되지 않을 수 있음 (kokonect-link/cherrypick#520)
- Fix: 투표 기한을 `기간 지정`으로 설정한 경우 투표가 즉시 종료될 수 있음 (kokonect-link/cherrypick#523)
- Fix: 로그인하지 않은 사용자가 리버시 전적을 볼 수 없음 (yojo-art/cherrypick#404)

### Server
- Enhance: 노트 편집 제한 완화
  - 1시간에 10번 편집할 수 있던 것을 5분에 10번 편집할 수 있도록 완화함.
- Enhance: 이모지를 등록할 때 시스템 사용자로 다시 업로드 하도록 변경함 (yojo-art/cherrypick#510)
  - 이모지를 등록한 사용자가 계정을 삭제하면 이모지도 같이 삭제되기 때문에 변경되었습니다.
- Fix: 로컬 전용 노트를 편집하면 편집한 노트가 연합될 수 있음 (kokonect-link/cherrypick#519, [libnare/shiftkey@654821da](https://github.com/libnare/shiftkey/commit/654821da003be7471f3c6fc320bf50afcb599d4e))

---


## 4.12.0
출시일: 2024/10/8<br>
기반 Misskey 버전: 2024.9.0<br>
Misskey의 전체 변경 사항을 확인하려면, [CHANGELOG.md#202490](CHANGELOG.md#202490) 문서를 참고하십시오.

### NOTE
- Enable condensed line의 기본값이 꺼짐으로 변경됨
  - 활성화하면 글자를 표시하기 위한 여유 공간이 좁을 때 디자인이 상대적으로 어색하게 보일 수 있으며, 실험실 기능이므로 이 기능이 변경하는 부분을 확실히 알고 있는 사용자만 활성화할 것을 권장합니다.
- 비밀번호 해싱 알고리즘이 `bcrypt`에서 `argon2`로 변경됨
  - 이 변경으로 이후에 비밀번호를 변경하거나 신규로 가입한 사용자는 `argon2`를 사용하여 비밀번호 해시가 생성됩니다.
  - 이전에 가입한 사용자는 로그인 시 자동으로 `bcypt`에서 `argon2`로 해시가 변경됩니다.

### General
- Feat: 위젯 영역을 숨길 수 있음
	- 기존 Friendly UI 한정 기능이 다른 UI에서도 사용할 수 있도록 확대됨
- Feat: `내용 숨기기`로 설정한 내용을 항상 보이게 설정할 수 있음 (kokonect-link/cherrypick#495)
- Feat: 내용이 긴 노트의 간략화 여부를 선택할 수 있음 (kokonect-link/cherrypick#495)
- Feat: 답글로 작성된 노트를 간략화하여 표시할 수 있음 (kokonect-link/cherrypick#495)
	- 리액션한 노트는 옵션 활성화 유무와 상관없이 항상 표시됩니다.
- Feat: 사용자 메뉴에서 원격 서버를 관리할 수 있음 (kokonect-link/cherrypick#502)
	- `서버 차단`, `서버 사일런스`, `서버 미디어 사일런스`
- Feat: 노트 동작 버튼을 개인화할 수 있음 (kokonect-link/cherrypick#501)
- Feat: 답글 대상 노트의 반투명 옵션을 선택할 수 있음 (kokonect-link/cherrypick#495)
- Feat: 사용자 페이지의 미디어 탭을 그리드 레이아웃으로 설정할 수 있음 (kokonect-link/cherrypick#494)
- Feat: 검색 위젯 (1673beta/cherrypick#125)
- Feat: 캡션 미설정 안내 표시 (1673beta/cherrypick#142)
  - 노트를 게시하기 전에 첨부한 파일에 캡션이 없으면 경고를 표시합니다.
  - 이 변경으로 이미지 뷰어의 파일 이름 영역에는 더 이상 캡션이 아닌 실제 파일 이름이 표시됩니다.
- Feat: 사용자 정의 스플래시 텍스트를 설정할 수 있음 (1673beta/cherrypick#153)
- Feat: 주사위 위젯 (1673beta/cherrypick#73)
- Feat: QR 코드를 생성하고 공유할 수 있음
  - 노트를 QR 코드로 공유 (1673beta/cherrypick#45)
  - 사용자를 QR 코드로 공유 (1673beta/cherrypick#46), (1673beta/cherrypick#49)
  - 갤러리를 QR 코드로 공유 (1673beta/cherrypick#51)
  - 페이지를 QR 코드로 공유 (1673beta/cherrypick#53)
  - Play를 QR 코드로 공유
- Feat: 설정한 시간이 지나면 노트를 자동으로 삭제할 수 있음 (1673beta/cherrypick#70)
- Feat: 모바일 환경에서 하단 내비게이션 바를 개인화할 수 있음
  - `설정` - `내비게이션 바`의 `하단 내비게이션 바`에서 설정할 수 있습니다.
- Feat: 리버시 대전 중에 상대방에게 리액션을 보낼 수 있음 (misskey-dev/misskey#13119)
- Feat: 자동 번역 기능
  - 자동 번역은 번역 서비스의 API 제한을 방지하기 위해 자동으로 활성화되지 않으며, 기본적으로 비활성화되어 있습니다.
  - `역할`에서 `자동 번역 기능 이용`를 활성화 하면 자동 번역을 사용할 수 있는 상태가 됩니다.
    - 자동 번역 사용 권한을 역할별로 설정할 수 있습니다.
  - 이후, 각 사용자별로 `설정` - `일반`에서 `자동 번역`을 활성화한 사용자는 자동 번역을 사용할 수 있습니다.
  - 노트가 아래와 같이 설정된 경우에는 자동 번역을 사용하지 않습니다.
    - 노트가 `내용 가리기`로 설정되어 있음
    - 내용이 긴 노트
    - 노트에 5개 이상의 파일이 포함되어 있음
- Feat: 노트의 전체 대화와 전체 답글을 불러올 수 있음 (kokonect-link/cherrypick#495)
  - `답글을 자동으로 더 보기`를 활성화하면 `더 보기` 버튼을 누르지 않아도 노트 내 답글을 전부 표시합니다.
  - `대화를 자동으로 더 보기`를 활성화하면 `대화 보기` 버튼을 누르지 않아도 노트 내 대화를 전부 표시합니다.

### Client
- Enhance: CherryPick 업데이트 페이지를 제어판 목록에 추가함
- Enhance: Webhook 추가 버튼을 헤더로 이동해 디자인 개선
- Enhance: 노트 번역 영역에서도 이모지를 눌러 이모지 메뉴를 열 수 있음
- Enhance: 노트 상세 페이지에서 InstanceTicker를 클릭해 리모트에서 노트를 볼 수 있음
- Enhance: 리액션 수신 범위에 따라 리액션 버튼의 툴팁 내용이 변경됨
- Enhance: 설정 페이지 개선
  - 일반 설정에 있던 설정 중 디자인과 관련된 설정을 모양으로 옮겼습니다.
- Enhance: 외부 사이트로 이동할 때 경고 표시 (misskey-dev/misskey#13557)
- Enhance: 이미지의 확장자를 더욱 정확하게 표시함
  - APNG 형식의 이미지가 GIF로 표시되던 것을 APNG로 표시하도록 변경
- Enhance: 이미지 뷰어가 파일 이름과 캡션을 동시에 표시하도록 변경
- Enhance: 노트를 작성할 때 첨부한 파일에 캡션이 존재하는 경우 파일 목록에 아이콘을 표시함
- Enhance: 미디어 숨기기 버튼의 디자인을 개선함
- Enhance: 갤러리를 노트로 공유할 때 노트 내용에 줄바꿈을 적용함
- Enhance: 노트 내용에 `検索`, `검색`, `search`이 포함되면 의도하지 않게 검색 블록이 활성화되는 문제를 개선함
	- 이제 노트에서 검색 블록을 활성화하려면 `[検索]`, `[검색]`, `[search]`으로만 사용할 수 있습니다.
- Enhance: 설정 페이지의 하단 여백 디자인을 조정함
- Enhance: 노트 작성 시 `본문 미리보기`를 활성화한 경우, 본문에 내용이 있을 때만 표시되도록 변경함
- Enhance: 노트 작성 폼의 일부 기능 버튼을 드롭 다운 메뉴로 이동함
- Enhance: 노트나 프로필의 번역 버튼을 누르면 자동으로 내용을 펼침
- Fix: 환경설정 백업 시 일부 설정이 누락되어 백업될 수 있음
- Fix: 이미지 자르기를 할 때 이미지 크기 전체를 표시하지 못할 수 있음
- Fix: 페이지에서 페이지 생성 버튼이 본문에 중복으로 표시됨
- Fix: 노트 본문의 사용자 멘션 영역을 클릭하면 노트 상세 페이지가 표시됨
- Fix: 역할 권한에 의해 번역 기능을 사용할 수 없을 때도 번역 버튼이 표시됨

### Server
- Enhance: 보안 향상을 위해 비밀번호 해싱 알고리즘이 `bcrypt`에서 `argon2`로 변경됨 (kokonect-link/cherrypick#511)
  - 이제 72 바이트를 초과하는 비밀번호를 사용할 수 있습니다.
  - 이로써 `Sharkey`, `FireFish`, `IceShrimp` 등의 클라이언트에서 `CherryPick`으로 이전할 때 암호 호환성이 보장됩니다.
- Enhance: `Sharkey`를 사용하는 서버의 사용자가 설정한 아바타 장식을 자동으로 불러옴
- Fix: 이모지를 등록하거나 가져오려고 할 때 오류가 발생할 수 있음 (kokonect-link/cherrypick#487), (kokonect-link/cherrypick#508)
- Fix: 사용자 이름에 `.`이 있는 경우 멘션을 할 수 없음 (kokonect-link/cherrypick#509)

---

## 4.11.1
출시일: 2024/8/30<br>
기반 Misskey 버전: 2024.8.0<br>
Misskey의 전체 변경 사항을 확인하려면, [CHANGELOG.md#202480](CHANGELOG.md#202480) 문서를 참고하십시오.

### Client
- Fix: 노트의 세부 옵션을 표시하는 `더 보기!` 버튼을 누를 수 없음

---

## 4.11.0
출시일: 2024/8/28<br>
기반 Misskey 버전: 2024.8.0<br>
Misskey의 전체 변경 사항을 확인하려면, [CHANGELOG.md#202480](CHANGELOG.md#202480) 문서를 참고하십시오.

### Client
- Fix: 노트를 인용했을 때 `더 보기` 버튼이 보이지 않거나 잘려서 표시될 수 있음
- Fix: 클라이언트 업데이트 페이지에서 Misskey의 버전 정보를 불러오지 못할 수 있음

---

## 4.10.0
출시일: 2024/8/26<br>
기반 Misskey 버전: 2024.7.0<br>
Misskey의 전체 변경 사항을 확인하려면, [CHANGELOG.md#202470](CHANGELOG.md#202470) 문서를 참고하십시오.

### Client
- Fix: CherryPick 클라이언트 업데이트를 올바르게 확인하지 못할 수 있음
  - 일부 버전에서 버전 확인 오류가 발생할 수 있음
    - 예: `4.9.0 < 4.10.0` 계산 시 `4.9.0`이 더 큰 것으로 계산됨
  - CherryPick 클라이언트 업데이트 페이지에서 버전 알림이 작동하지 않을 수 있음

### Server
- Fix: `Announce`를 사용하는 릴레이 서버의 노트를 가져올 수 없음 (kokonect-link/cherrypick#483)
- Fix: 번역 기능을 사용할 수 없을 수 있음 (kokonect-link/cherrypick#486)
- Fix: withCats 상태인 사용자가 작성하는 노트가 streaming에서 필터링되지 않을 수 있음 (kokonect-link/cherrypick#485)

---

## 4.9.0
출시일: 2024/7/27<br>
기반 Misskey 버전: 2024.5.0<br>
Misskey의 전체 변경 사항을 확인하려면, [CHANGELOG.md#202450](CHANGELOG.md#202450) 문서를 참고하십시오.

### Client
- Enhance: 노트 작성 폼에서 '공개 범위 기억하기' 설정을 변경할 수 있음
- Fix: 타임라인 노트의 리액션 뷰어에 리모트 서버의 커스텀 이모지가 표시되지 않음
- Fix: '리노트 공개 범위 지정' 옵션이 `없음`으로 설정된 경우 리노트를 할 수 없음
- Fix: 아바타 장식을 설정할 때 설정 팝업이 두 번 표시될 수 있음
- Fix: 코드 블록의 하이라이트가 실제 위치와 다르게 표시될 수 있음 (kokonect-link/cherrypick#475)

### Server
- Feat: 리모트 유저의 아바타 장식을 여러 개 불러올 수 있음([yunochi/misskey@696787b3](https://github.com/yunochi/misskey/commit/696787b38bac31e7586899a5a59611a6fe50b9a1), [yunochi/misskey@4a5fcfe4](https://github.com/yunochi/misskey/commit/4a5fcfe43880f08380541caa6b7593b90306d103))
- Enhance: 노트를 삭제해도 답글을 유지하도록 변경([yunochi/misskey@72feaecd](https://github.com/yunochi/misskey/commit/72feaecdc1d9bd358396053f6505c46ccb23ef74))
- Fix: 유니코드 이모지로 리액션한 경우에도 리액션 알림의 양 끝에 `:`가 표시됨

---

## 4.8.0
출시일: 2024/5/20<br>
기반 Misskey 버전: 2024.3.1<br>
Misskey의 전체 변경 사항을 확인하려면, [CHANGELOG.md#202431](CHANGELOG.md#202431) 문서를 참고하십시오.

### General
- Change: '타임라인에 다른 사람에게 보내는 답글을 포함'의 기본값을 비활성으로 설정

### Client
- Enhance: 노트 메뉴에 '새 탭에서 열기' 추가
- Fix: (Friendly) 타임라인 헤더와 알림 영역의 헤더 타이틀이 잘못 표시될 수 있음 (kokonect-link/cherrypick#461)
- Fix: (Friendly) 윈도우 크기를 조정하면 타임라인 탭의 하이라이트가 잘못된 위치에 표시될 수 있음 (kokonect-link/cherrypick#415)
- Fix: (Friendly) 일부 페이지에서 알림 영역의 디자인이 잘못 표시될 수 있음
  - 사용자 프로필 페이지
  - 노트 상세 페이지
- Fix: 노트를 내보낼 때 노트의 편집 기록을 포함
- Fix: MkA 컴포넌트를 사용하는 항목이 작동하지 않을 수 있음 (kokonect-link/cherrypick#422)
  - 알림의 읽음 표시, 테스트 알림, 기본 업로드 위치 등
- Fix: 코드 복사 버튼을 누르면 노트 상세 페이지가 표시될 수 있음 (kokonect-link/cherrypick#414)
- Fix: 창으로 제어판을 열었을 때 뒤로 가기 버튼이 잘못된 작동을 야기할 수 있음 (kokonect-link/cherrypick#407)
- Fix: 서버 이름이 매우 긴 경우, CherryPick에 대하여(MkSourceCodeAvailablePopup) 대화 상자의 디자인이 잘못 표시될 수 있음
- Fix: '노트를 클릭하여 자세히 표시' 기능을 활성화하면 일부 기능이 올바르게 작동하지 않을 수 있음 (kokonect-link/cherrypick#451)
  - 타임라인에서 노트의 프로필 아이콘을 클릭하면 프로필로 이동하지 않음
  - 노트 본문 내의 프로필 아이콘을 클릭하면 화면에 아무것도 표시되지 않음

### Server
- Enhance: 디버깅을 보다 편하게 할 수 있도록 vite 생성 파일의 이름 개선
- Fix: 엔드포인트 `users/translate` 에러 개선
- Fix: Mastodon 사용자에게 대화를 보낼 때 [#objectobject] 태그가 추가될 수 있음

---

## 4.7.0
출시일: 2024/3/19<br>
기반 Misskey 버전: 2024.2.0<br>
Misskey의 전체 변경 사항을 확인하려면, [CHANGELOG.md#202420](CHANGELOG.md#202420) 문서를 참고하십시오.

### Client
- Feat: 리노트 공개 범위를 지정할 수 있음 (kokonect-link/cherrypick#406)
  - 이 기능은 '리노트 공개 범위 옵션 표시' 기능이 꺼져있어야 합니다.
- Enhance: 빌트인 테마를 설치하려고 할 때 오류 메시지 개선
- Enhance: '노트를 클릭하여 자세히 표시' 기능 개선
  - 노트를 두 번 클릭해서 열 수 있음
- Fix: 장식 추가로 일부 태그를 추가할 수 없음
- Fix: 알림 위젯 필터링이 작동하지 않을 수 있음 (kokonect-link/cherrypick#404)
- Fix: 노트 자세히 보기에서 노트 작성 폼을 클릭하면 내용이 초기화될 수 있음 (kokonect-link/cherrypick#410)
- Fix: '설정 - 타임라인' 페이지가 표시되지 않음
- Fix: '노트 - 리액션 목록' 기능이 작동하지 않음

---

## 4.6.0
출시일: 2024/1/8<br>
기반 Misskey 버전: 2023.12.2<br>
Misskey의 전체 변경 사항을 확인하려면, [CHANGELOG.md#2023122](CHANGELOG.md#2023122) 문서를 참고하십시오.

### General
- Change: 노트를 번역할 때 유저가 고양이로 설정되어 있으면 nyaize를 적용
- Change: Misskey 또는 CherryPick v4.3.0 이전 버전에서 마이그레이션 시, 마이그레이션 관련 대화 상자가 표시됨
- Feat: 리모트 서버의 이모지를 즉시 가져올 수 있음 ([pikokr/cherrypicnic@03d536c0](https://github.com/pikokr/cherrypicnic/commit/03d536c00212f2dfbebecf75e5d58e0ddb749444), [pikokr/cherrypicnic@8a2d6f3b](https://github.com/pikokr/cherrypicnic/commit/8a2d6f3b518fc13a6c32364780fba3be5eea3e5d))
  - 노트 본문 및 리액션 뷰어에서 사용 가능
- Feat: 아이콘 장식을 세부 조정할 수 있음 ([Secineralyr/misskey.dream@b3299181](https://github.com/Secineralyr/misskey.dream/commit/b329918194f1991c84633361d8a1319cf203641c), [Secineralyr/misskey.dream@1a9642bb](https://github.com/Secineralyr/misskey.dream/commit/1a9642bb9087a256522767e113c3bbfa87ec2e47))
  - 위치, 크기, 불투명도를 추가로 조정할 수 있습니다.
- Feat: 노트를 클릭하여 자세히 볼 수 있음
- Feat: 텍스트 장식(MFM, HTML, Markdown)을 보다 편하게 추가할 수 있음
  - 노트 작성 폼에서 텍스트 장식 버튼을 눌러 사용할 수 있음
  - 텍스트를 선택한 상태에서도 적용 가능
- Enhance: 다양한 자산의 출력 파일 이름에 CherryPick 버전을 포함하도록 설정 ([MisskeyIO/misskey@436ddb8f](https://github.com/MisskeyIO/misskey/commit/436ddb8fdb2e585987f403c1527915947c7aae7c))
- Revert: 사용자 통계 표시 기능 제거 ([MisskeyIO/misskey@114c7fe6](https://github.com/MisskeyIO/misskey/commit/114c7fe6b37dd6bddbcd9d92406f8b13bf688e8b))

### Client
- Feat: 데이터 절약 모드로 코드 하이라이트 로드를 줄일 수 있음 (misskey-dev/misskey#12526)
- Feat: InstanceTicker를 클릭해 노트를 자세히 볼 수 있음
  - 리모트에서 수신된 노트인 경우, '리모트에서 보기'로 작동함
- Feat: 신규 도전 과제 추가
- Enhance: 사운드 설정을 기본값으로 복원하거나 저장할 때 확실하게 표시함
- Enhance: 리모트 서버와 동일한 이모지가 존재하지 않는 경우 '이모지 복사'를 비활성화함
- Enhance: 아이콘 장식을 바로 업로드 하거나 드라이브에서 불러올 수 있음 ([Secineralyr/misskey.dream@e358212d](https://github.com/Secineralyr/misskey.dream/commit/e358212da93256749e31d9e0ca9dd2ed37fd548e), [Secineralyr/misskey.dream@52592fea](https://github.com/Secineralyr/misskey.dream/commit/52592fea52684497ba7e07f173aac2b1083afcb1))
- Enhance: 클라이언트 언어와 노트 본문의 언어가 같으면 번역 버튼을 표시하지 않음
- Enhance: 진동 기능 개선
  - 진동 기능을 사용할 수 없는 환경에서 스위치를 조작할 수 없도록 비활성화
  - 진동 기능을 사용할 수 없는 이유를 보다 명확하게 표시하도록 개선
- Enhance: 데이터 절약 모드 적용 범위를 개별적으로 설정할 수 있음 (misskey-dev/misskey#12526)
  - 기존 데이터 절약 모드 설정이 재설정됩니다.
- Enhance: 컴포넌트만 새로 고쳐도 적용할 수 있는 설정은 페이지를 새로 고치지 않고 설정을 반영함
  - 각 기능이 적용되는 컴포넌트(타임라인, 알림)에 따라 해당 컴포넌트만 새로 로드됩니다.
- Enhance: 페이지를 새로 불러오지 않고 알림 컴포넌트를 갱신할 수 있음
- Enhance: 리노트 개선 #400
  - 리노트 시 공개 범위를 설정할 수 있음
- Enhance: 사용자 팝업 개선
  - 자신의 프로필인 경우, 팔로우 버튼을 프로필 편집 버튼으로 표시함
- Enhance: 노트 상세 페이지의 노트 작성 폼에서 노트를 게시했을 때 작성 폼을 다시 닫도록 변경함
- Enhance: 액세스 토큰 개선
  - 토큰을 생성할 때 토큰을 복사할 필요없이 '확인' 버튼을 누르면 자동으로 클립보드에 토큰이 복사됨
  - 토큰을 삭제할 때 삭제 전 대화 상자가 표시됨
- Enhance: 링크 또는 내용을 복사할 때 토스트 알림 표시
- Enhance: HTML 태그 및 Markdown 태그가 자동 완성을 지원함
  - `<`를 입력하면 ``<b>, ~~, <i>, <small>, <center>, <plain>, `, ```, \(\), \(\\ \)`` 태그를 자동으로 입력할 수 있음
- Enhance: 서버에서 푸시 알림을 사용할 수 있으면 푸시 알림을 활성화 하도록 대화 상자를 표시
- Enhance: 리액션 뷰어에서 우클릭하면 리액션을 복사할 수 있음
- Enhance: 대화 페이지를 새로 고치지 않아도 자동으로 갱신함
- Fix: '모달 배경색 제거' 옵션이 이모지 피커에 반영되지 않음
- Fix: 열람 주의로 설정된 노트의 리액션이 '더 보기'를 눌러야 표시됨
- Fix: 채널 이름이 긴 경우 게시 양식 표시가 깨지는 문제 (misskey-dev/misskey#12524)
- Fix: 알림의 '받은 멘션' 및 '다이렉트 노트' 탭에서 '알림에서 답글이 달린 노트의 상위 노트 표시하기' 옵션이 적용되지 않음
- Fix: 모바일 환경에서 스크롤 시 헤더 위에 요소가 존재할 경우 헤더 디자인에 문제가 발생함
- Fix: '모든 미디어 노트 간략화하기' 옵션을 활성화하면 미디어가 없는 노트가 잘려서 표시될 수 있음
- Fix: 모바일 환경에서 헤더 타이틀 부분을 터치할 때 영역이 강조되어 표시될 수 있음
- Fix: 서브 노트에서 액션 버튼의 클릭 가능 영역이 매우 작게 설정될 수 있음
- Fix: 내 프로필에서 간헐적으로 헤더에 MkFollowButton 컴포넌트가 표시될 수 있음
- Fix: 다이렉트 노트를 리노트 할 수 있음
- Fix: 이모지를 변경할 때 이모지가 '❤️'로 고정될 수 있음
- Fix: 일부 환경에서 특정 영역에 스크롤 바가 표시될 수 있음
- Fix: 일부 검색 페이지에서 Enter 키를 눌러 검색할 수 없음
- Fix: 서버 이름이 매우 긴 경우, 후원(MkDonation) 대화 상자의 디자인이 잘못 표시될 수 있음
- Fix: 화면이 작은 기기에서 Play의 액션 버튼이 잘려서 보일 수 있음
- Fix: 노트 상세 페이지에서 노트 작성 폼을 클릭했을 때, 노트 작성자가 자동으로 멘션에 포함되지 않을 수 있음
- Fix: 링크를 인용해서 노트를 작성할 때 노트 작성 폼의 디자인이 올바르지 않게 표시됨
- Fix: MFM 도움말의 수식(블록) 항목이 누락됨
- Fix: Temml를 사용할 때 폰트가 올바르게 표시되지 않을 수 있음
- Fix: 열람 주의로 설정된 미디어가 답글 또는 인용된 경우 '더 보기' 버튼을 누를 수 없음
- Fix: 노트 공개 범위가 비공개인 노트를 편집하면 다른 사용자가 노트 편집 기록을 볼 수 있음
- Fix: 대화 목록의 인디케이터가 중복 및 잘못된 위치에 표시될 수 있음
- Fix: 노트 작성 폼에서 링크 프리뷰가 표시될 수 있음

### Server
- Feat: Bearcaps URL 지원 (MisskeyIO/misskey#330)
- Enhance: (dev) 개발 모드에서 locale 및 유형 정의가 자동으로 재생성됨 (misskey-dev/misskey#12481)
- Enhance: 푸시 알림 개선
  - 개인간 대화 알림을 받았을 때, 대화 내용을 푸시 알림에 표시
  - 그룹간 대화 알림을 받았을 때, 대화를 보낸 사용자와 내용을 표시
  - 팔로우 알림에 Acct 및 host 정보 표시
  - 리액션 알림 디자인 개선
- Enhance: 사용자 반응 목록 API 성능 향상 (MisskeyIO/misskey#278)
- Fix: RedisKVCache에서 Redis에서 읽은 값을 MemoryKVCache에 다시 쓰기 (MisskeyIO/misskey#289)
- Fix: redisForJobQueue 연결 사용 (MisskeyIO/misskey#268)
- Fix: redisForJobQueue의 maxRetriesPerRequest를 null로 설정 (MisskeyIO/misskey#272)
- Fix: Inbox 또는 Deliver 큐에 data 필드가 비어 있는 작업이 등록되지 않도록 (MisskeyIO/misskey#307)
- Fix: Misskey에서 CherryPick으로 마이그레이션 하면 타임라인이 표시되지 않음

---

## 4.5.2 (Hotfix)
출시일: 2023/11/23<br>
기반 Misskey 버전: 2023.11.1<br>
Misskey의 전체 변경 사항을 확인하려면, [CHANGELOG.md#2023111](CHANGELOG.md#2023111) 문서를 참고하십시오.

### Client
- Fix: 대화에서 채팅 입력란이 표시되지 않음

---

## 4.5.1
출시일: 2023/11/22<br>
기반 Misskey 버전: 2023.11.1<br>
Misskey의 전체 변경 사항을 확인하려면, [CHANGELOG.md#2023111](CHANGELOG.md#2023111) 문서를 참고하십시오.

### Client
- Enhance: 리액션 상태에 따라 버튼의 툴팁을 다르게 표시함
- Enhance: 노트 헤더의 편집됨 아이콘에 커서를 올리면 마지막으로 노트를 편집한 시간을 툴팁으로 표시함
- Enhance: 번역을 완료하면 진동으로 알림
- Enhance: '내용 복사 후 편집'과 '삭제 후 편집'의 아이콘을 더욱 알아보기 쉽도록 변경함
- Fix: 역할 설정에 잘못된 설정이 표시됨
- Fix: 비공개 노트에 답글을 달 수 있음
  - 답글이 달리면 해당 비공개 노트의 내용을 다른 사람이 볼 수 있음
- Fix: 노트 헤더의 편집됨 아이콘의 툴팁 디자인이 잘못 표시됨

### Server
- Fix: 일부 환경에서 아이콘 장식을 추가하지 못할 수 있음 ([libnare/cp-castella@d2d05a5](https://github.com/libnare/cp-castella/commit/d2d05a54570ce1b9cfe2a839bafafe6a27e320db))
- Fix: 리모트 유저의 프로필 미디어가 잘못된 URL로 표시될 수 있음 ([libnare/cp-castella@6f3f8dc](https://github.com/libnare/cp-castella/commit/6f3f8dcfe8918efdc6ad78d6e2b07441149c3ec7))

---

## 4.5.0
출시일: 2023/11/16<br>
기반 Misskey 버전: 2023.11.0<br>
Misskey의 전체 변경 사항을 확인하려면, [CHANGELOG.md#2023110](CHANGELOG.md#2023110) 문서를 참고하십시오.

### General
- Change: 프로필과 노트를 번역할 때 nyaize를 사용하지 않음

### Client
- Feat: (Friendly) 모바일 환경의 플로팅 네비게이션 버튼에서 아이콘 장식 표시 여부를 선택할 수 있음
  - 시인성 문제로 기본적으로 비활성화 상태임
- Feat: 본문 미리보기의 프로필을 표시하지 않도록 설정할 수 있음
- Feat: 이모티콘 피커의 카테고리를 다중 계층 폴더로 분류할 수 있음 (misskey-dev/misskey#12132)
- Feat: 열람 주의로 설정된 미디어를 두 번 탭 하여 표시하도록 할 수 있음 #392
- Feat: 노트의 텍스트 소스를 볼 수 있음
- Feat: 고양이로 설정된 유저의 노트를 nyaize로 표시하지 않고 볼 수 있음
- Enhance: 스와이프하여 타임라인을 다시 불러올 수 있음 (misskey-dev/misskey#12113)
	- PC의 경우 오른쪽 상단의 버튼을 통해서도 다시 불러올 수 있습니다
- Enhance: 타임라인 자동 업데이트를 비활성화할 수 있음 (misskey-dev/misskey#12113)
- Enhance: AiScript 함수 `Mk:nyaize()`가 추가됨 (misskey-dev/misskey#12136)
- Enhance: 노트 작성 폼에서 노트를 게시한 뒤에 textarea의 높이를 원래대로 되돌림
- Enhance: 노트 상세 페이지의 답글 목록 개선
- Enhance: 유저 페이지 개선
  - 요약 탭의 하이라이트를 제거 & 노트 탭으로 하이라이트를 이동
  - 요약 탭의 리액션을 제거 & 노트 탭으로 리액션을 이동
- Enhance: 노트 편집 시 관련 안내 추가
- Enhance: 계정을 고양이로 설정하면 자동으로 노트 작성 버튼을 '노트'에서 '냥!'으로 변경함
  - 임의로 해당 옵션을 조작한 경우에는 설정을 변경하지 않음
- Enhance: 노트 메뉴를 보기 쉽도록 자주 사용하지 않는 메뉴 이동
- chore: 이모티콘 이름 필드에서 autocapitalize를 끄기 (misskey-dev/misskey#12139)
- Fix: 외부 리소스 설치 페이지에서 페이지 캐시가 작동하는 문제 수정 (misskey-dev/misskey#12105)
- Fix: 채널 생성/업데이트 시 실패하면 아무 것도 표시되지 않는 문제 수정 misskey-dev/misskey#11983 (misskey-dev/misskey#12142)
- Fix: 유저 페이지의 미디어 타임라인에서 미디어가 없는 답글이 표시됨 #388
- Fix: Friendly UI가 아닌 경우 헤더 디자인이 잘못 표시되는 문제
  - 헤더의 액션 항목이 여러 개 일 때 왼쪽으로 타이틀이 치우칠 수 있음
  - 특정 조건에서 헤더의 왼쪽에 여백이 발생할 수 있음
  - 일부 페이지에서 잘못된 디자인이 표시됨
  - 일부 페이지에서 액션 항목이 존재해도 버튼이 표시되지 않을 수 있음
- Fix: 네비게이션 메뉴의 하단 프로필 영역이 잘못된 디자인으로 표시됨
- Fix: 노트를 인용할 때 입력란에 자동으로 포커스가 맞춰지지 않음
- Fix: '모든 미디어 노트 간략화하기' 옵션을 활성화하면 미디어가 아닌 노트에도 '닫기' 버튼이 표시될 수 있음
- Fix: 유저 프로필에서 헤더 디자인이 잘못 표시되는 문제
- Fix: 비로그인 상태에서 노트 번역을 시도할 수 있음
- Fix: 클립이 없는 상태에서 노트 메뉴의 클립 추가 버튼 위에 줄이 표시됨

### Server
- Feat: 연합에서 노트 수정이 반영됨 (libnare/cp-castella#1)
- Feat: 리모트 유저의 아이콘 장식이 반영됨 ([libnare/cp-castella@7891331](https://github.com/libnare/cp-castella/commit/7891331321e2fbaf4ec5f5c9d4e51b116948d564), [libnare/cp-castella@ae4004c](https://github.com/libnare/cp-castella/commit/ae4004cd41c85f56716a4100c2eb0d8410fbd20a), [libnare/cp-castella@135aa97](https://github.com/libnare/cp-castella/commit/135aa97046548ba5929c04e412622c979a2cad09))
- Enhance: 사용자 차단 개선 (Renote Part) (misskey-dev/misskey#12089)
- Fix: 장시간 기다려도 마이그레이션이 완료되지 않을 수 있음
- Fix: Redis 에서 TL 캐시를 반환하지 않으면 '고양이만 보기'가 작동하지 않을 수 있음
- Fix: latestRequestReceivedAt이 제대로 반영되지 않음 (misskey-dev/misskey#12270)

---

## 4.4.1
출시일: 2023/10/21<br>
기반 Misskey 버전: 2023.10.2<br>
Misskey의 전체 변경 사항을 확인하려면, [CHANGELOG.md#2023102](CHANGELOG.md#2023102) 문서를 참고하십시오.

### Client
- Feat: 노트 편집 시 토스트 알림을 표시하고 사운드를 재생
- Feat: PostForm 접두사에 현재 공개 범위 표시 ([tanukey-dev/tanukey@1cc0071](https://github.com/tanukey-dev/tanukey/commit/1cc0071bbd424949d9305bcec554f5d755a73554))
- Feat: 플러그인 및 테마를 외부 사이트에서 직접 설치할 수 있음 (misskey-dev/misskey#12034)
  - 외부 사이트에서 구현해야 합니다. 자세한 내용은 Misskey Hub를 참조하세요.
    https://misskey-hub.net/docs/advanced/publish-on-your-website.html
- Enhance: 노트를 편집할 때 편집 중인 노트임을 강조함
- Enhance: 타임라인에서 새 노트가 20개 이상이면 '20+'로 표기
- Enhance: 노트를 편집한 시간이 개별적으로 표시됨
- Fix: '새 노트 알림'을 '노트 수 표시'로 설정했을 때 한국어 이외의 언어에서 내용이 표시되지 않음
- Fix: 알림에 여는 인용문 사용 (misskey-dev/misskey#12082)

### Server
- Enhance: '내용 숨기기'로 설정된 노트의 주석도 노트 편집 기록에 표시됨
- Revert: Perf: 부팅 시 MeiliSearch 설정을 업데이트하지 마십시오 (MisskeyIO/misskey#158)
- Fix: 이모지를 여러 개 추가할 때도 이름의 중복을 확인하도록
- Fix: 유저 페이지 및 이벤트 검색에서 '미래순'으로 정렬할 수 없음

---

## 4.4.0
출시일: 2023/10/17<br>
기반 Misskey 버전: 2023.10.1<br>
Misskey의 전체 변경 사항을 확인하려면, [CHANGELOG.md#2023101](CHANGELOG.md#2023101) 문서를 참고하십시오.

### NOTE
- Misskey 2023.10.0 에서 제거된 노트 편집 기능이 계속 유지됩니다.

### General
- Add: Mirerado 테마 추가 ([mirerado-theme](https://mi.rerac.dev/@notify/pages/mirerado-theme))
- Feat: 읽지 않은 알림 수를 표시할 수 있음 (misskey-dev/misskey#11982)
- Feat: 햅틱 피드백 개선
  - 지원 범위 추가
  - 설정을 세부적으로 변경할 수 있음
- Fix: 서버 측에서 테스트 알림을 올바르게 수행할 수 있도록 수정 (misskey-dev/misskey#11982)

### Client
- Feat: 클라이언트 업데이트 알림 개선
  - 알림 채널을 선택할 수 있음
  - 다음 릴리즈 출시까지 알리지 않도록 설정할 수 있음
- Feat: 활동에서 팔로잉, 팔로워 차트를 볼 수 있음
- Feat: 모달 디자인을 변경할 수 있음
  - 흐림 효과를 활성화하면 디자인이 변경됨
  - 흐림 효과가 활성화 된 상태에서 '모달 배경색 제거' 옵션을 활성화하면 일부 모달의 디자인이 변경됨
- Enhance: 그룹 대화에서 읽음 표시를 개선
- Enhance: cli, bios 페이지 개선
- Enhance: 서버와 연결이 끊겼을 때 stream indicator가 즉시 표시되지 않도록 (MisskeyIO/misskey#172)
- Enhance: 스피너 디자인 변경
- Enhance: 후원 버튼의 디자인 개선
  - 버튼을 하나로 병합함
  - 버튼을 누르면 팝업 메뉴로 표시됨
- Fix: (Friendly) 길게 누르면 표시되는 계정 관리 다이얼로그의 UI 관련 오류 수정
- Fix: 서브 노트 기능 오류
  - 서브 노트에서 더 보기 버튼을 사용할 수 없음
  - 리액션 변경 기능을 사용할 수 없음
- Fix: 노트 상세 페이지의 노트 입력 폼을 누르기 전에 일부 요소가 표시될 수 있음
- Fix: 히트맵이 표시되지 않음
- Fix: 대화 페이지에서 일부 요소가 중복으로 표시될 수 있음
- Fix: 브랜딩에서 적용한 이미지가 대화 페이지에서 반영되지 않음
- Fix: 유저 검색에서 로컬/리모트 설정이 제대로 작동하지 않음
- Fix: 유저 선택 다이얼로그에서 검색 결과가 표시되지 않음
- Fix: 게시 양식에서 사용자 변경 사항이 미리보기에 반영되지 않는 문제 (misskey-dev/misskey#12022)
- Fix: 타임라인 메뉴 요소 수정

### Server
- Feat: Note pack에서 SQL 디바운스 (MisskeyIO/misskey#176)
- Enhance: 초기 로드 속도 개선
- Revert: Feat: 이모티콘 중복 체크 (misskey-dev/misskey#11941)
- Fix: Publish notes announced by relay (misskey-dev/misskey#11056)
- Fix: Meilisearch가 설정된 상태에서 노트 검색 시 로컬/리모트 설정이 제대로 작동하지 않음
- Fix: Redis의 TTL이 만료되지 않았다면 메모리에 값을 다시 쓰기 (MisskeyIO/misskey#174)
- Fix: NoteEntityService의 pack 내에서 CustomEmojiService의 prefetchEmoji를 호출함 (MisskeyIO/misskey#179)

---

## 4.3.3 (Hotfix)
출시일: 2023/10/3<br>
기반 Misskey 버전: 2023.9.3<br>
Misskey의 전체 변경 사항을 확인하려면, [CHANGELOG.md#202393](CHANGELOG.md#202393) 문서를 참고하십시오.

### Server
- Fix: 마이그레이션 문제
	- Misskey에서 CherryPick으로 마이그레이션하면 오류가 발생함

---

## 4.3.2
출시일: 2023/10/3<br>
기반 Misskey 버전: 2023.9.3<br>
Misskey의 전체 변경 사항을 확인하려면, [CHANGELOG.md#202393](CHANGELOG.md#202393) 문서를 참고하십시오.

### General
- Feat: 편집한 노트의 기록을 확인할 수 있음 (misskey-dev/misskey#11938)

### Client
- Feat: 움직이는 이미지를 표시하는 방법을 세분화
  - 마우스를 움직이거나 화면을 터치하고 있으면 이미지를 재생
  - 일정 시간이 경과하면 이미지 재생을 중지
- Feat: 미디어가 포함된 모든 노트를 접을 수 있음
- Feat: 클라이언트 업데이트가 있으면 알림
- Enhance: 유저명, 이름, 인스턴스 이름이 길면 스크롤해서 볼 수 있음
- Fix: 로그인하지 않은 상태에서 노트 상세 페이지의 노트 작성 폼을 조작할 수 있음
- Fix: Chromium 기반 브라우저에서 노트 작성 폼의 스크롤 영역이 잘못된 디자인을 표시함
- Fix: 반응한 사용자 목록의 UI가 드물게 왼쪽 상단에 남아있는 문제 수정 (misskey-dev/misskey#11949)
- Fix: deck ui에서 user list를 볼 때 답글이 표시되지 않음 (misskey-dev/misskey#11951)
- Fix: 노트 상세 페이지의 노트 작성 폼 입력란에 멘션이 기본으로 입력되어 있음
  - 작성란을 눌러야 멘션이 입력되도록 변경

### Server
- Feat: 이모티콘 중복 체크 (misskey-dev/misskey#11941)
- Enhance: '내용 숨기기'로 설정된 노트의 주석도 번역에 포함됨

---

## 4.3.1
출시일: 2023/9/29<br>
기반 Misskey 버전: 2023.9.2<br>
Misskey의 전체 변경 사항을 확인하려면, [CHANGELOG.md#202392](CHANGELOG.md#202392) 문서를 참고하십시오.

### General
- 미디어, 고양이 타임라인 개선
  - [misskey-dev/misskey@eb740e2](https://github.com/misskey-dev/misskey/commit/eb740e2c72ae6854b244ad099c927c069008720e) 이 추가됨에 따라, 해당 기능에 병합하고 기존 미디어 및 고양이 타임라인을 제거함

---

## 4.3.0
출시일: 2023/9/29<br>
기반 Misskey 버전: 2023.9.1<br>
Misskey의 전체 변경 사항을 확인하려면, [CHANGELOG.md#202391](CHANGELOG.md#202391) 문서를 참고하십시오.

> 버전 관리 방식이 변경되었기 때문에, 기존 버전보다 낮은 것으로 인식되어 업데이트 대화 상자가 표시되지 않을 수 있습니다.
> 또한, 일부 locale이 누락되거나 기능이 정상적으로 작동하지 않는 등의 문제가 발생할 수 있습니다.
> 문제가 발생하면 '설정 - 캐시 비우기'를 진행하거나, 브라우저 캐시를 삭제하십시오.

### General
- Add: Rosé Pine 테마 추가 ([rose-pine/misskey](https://github.com/rose-pine/misskey))
- Add: 타임라인 소개 추가
- Change: EventBus를 사용하는 코드를 EventEmitter3로 변경
- Change: 버전 관리 방식 변경
- Change: '광고를 항상 표시' 옵션을 기본 활성화로 변경
- Feat: 스크롤 시 요소 표시(헤더, 플로팅 버튼, 탐색 모음)를 사용자화 할 수 있는 옵션 추가
- Feat: 노트 작성 버튼을 '노트'에서 '냥!'으로 변경할 수 있는 옵션 추가
- Feat: 리노트를 신고할 수 있도록 (misskey-dev/misskey#11466)
- Feat: 계정 초기 설정과 타임라인 튜토리얼을 다시 진행할 수 있도록
- Feat: 리모트 사용자의 노트/팔로잉/팔로워 수를 리모트 서버의 정보와 동일하게 보이도록
- Feat: 유저 메뉴에서 '리모트 유저 정보 갱신'을 진행할 수 있도록
- Feat: 신고 즉시 해결 기능 (misskey-dev/misskey#11032)
- Feat: 어떤 이유로 클라이언트의 이모티콘 캐시가 삭제된 경우 즉시 다시 가져오도록 (MisskeyIO/misskey#163)
- Feat: 노트 작성 폼에 MFM 도움말을 볼 수 있는 버튼 추가
- Feat: 새 MFM 구문 추가 (페이드)
- Feat: 햅틱 피드백 지원
- Feat: 빌드 기반 Misskey 버전을 확인할 수 있음
- Enhance: 노트의 리액션을 삭제하지 않고도 리액션 버튼을 눌러 리액션을 변경할 수 있도록 (misskey-dev/misskey#11157)
- Enhance: 이용 약관을 서버 메뉴에서 볼 수 있도록
- Enhance: 설정에서 변경 가능한 옵션은 다이얼로그에서 안내하도록 설명 추가
- Enhance: 메모리 할당자를 jemalloc으로 설정 (MisskeyIO/misskey#152)

### Client
- Feat: (Friendly) 길게 눌러 계정 메뉴를 표시하는 옵션을 비활성화 할 수 있음
- Feat: (Friendly) 알림 영역과 위젯 영역의 표시 설정을 '설정 - CherryPick'에서 변경할 수 있음
- Feat: about-misskey 페이지에서 클라이언트 버전을 누르면 변경 사항을 볼 수 있음
- Feat: 이미지 압축 방식을 선택할 수 있음
  - 사이즈 변경 여부를 선택할 수 있음
  - 이미지를 업로드할 때 손실 압축으로 변경할 수 있음
- Feat: Scratchpad에서 Async: 계열 함수나 버튼 콜백 등의 오류에도 대화창을 띄우도록(시험적이라 Play 등에는 미구현) (misskey-dev/misskey#11850)
- Feat: 민감한 미디어를 돋보이게 하는 설정 추가 (misskey-dev/misskey#11851)
- Feat: 알림에서 답글이 달린 노트의 상위 노트를 표시하지 않도록 하는 설정 추가
- Feat: 리노트와 인용 버튼을 표시하는 방법을 선택할 수 있음
- Feat: 알림 위젯에 필터, 모두 읽은 상태로 표시 버튼 추가
- Feat: 답글에 글 작성란을 표시하는 기능 추가
- Feat: 모바일 환경에서 유저 페이지의 헤더 디자인을 변경할 수 있음
- Spec: 사용자 정의 이모티콘 라이센스를 여러 항목으로 추가할 수 있도록 (MisskeyIO/misskey#130)
- Enhance: 새로운 신고가 있는 경우, 네비게이션 바의 제어판 아이콘과 제어판 페이지의 신고 섹션에 점을 표시
- Enhance: 스크롤 시 요소 표시 기능을 Friendly 이외의 UI에도 대응
- Enhance: '제어판 - 신고' 페이지의 버튼 가독성 향상
- Enhance: '모달에 흐림 효과 사용' 옵션이 비활성화된 경우, 이미지를 탭하여 표시할 때 표시되는 배경을 어둡게 조정
- Enhance: 대화 페이지 디자인 개선
- Enhance: 유저 페이지 헤더에 유저 메뉴, 팔로우 버튼 추가
- Enhance: 대화 페이지의 탭을 '다이렉트 메시지 / 그룹'으로 분할
- Enhance: 헤더에 모든 대화를 읽음으로 표시하는 버튼 추가
- Enhance: 공지사항에 이미지가 있는 경우 다이얼로그 알림에도 표시하도록 (MisskeyIO/misskey#157)
- Enhance: 공지사항에서 다이얼로그 알림을 아카이브 할 때 이벤트가 발생하지 않도록・아카이브 된 공지를 알기 쉽게 (MisskeyIO/misskey#153)
- Enhance: 네비게이션 메뉴 디자인 개선
- Enhance: '서버의 머신 사양을 공개하기' 설정이 비활성화 상태인 경우, 제어판에서 서버 통계를 출력할 수 없다는 안내 문구를 표시하도록
- Enhance: 로그인할 때 프로필 아이콘의 모양을 '프로필 아이콘을 사각형으로 표시' 설정을 따르도록
- Enhance: 일부 설정 배치 변경
- Enhance: '타임라인 상단에 글 작성란 표시' 옵션이 활성화 되었을 때 autofocus를 사용하지 않도록
- Enhance: 로컬 유저만 그룹에 초대할 수 있도록
- Enhance: 노트를 게시한 방식에 따라 토스트 알림의 아이콘과 내용이 다르게 표시되도록
- Enhance: 'Enter 키를 눌러 보내기' 옵션에 관계없이 채팅에서 Enter 키를 눌러 전송하도록 강제함
- Enhance: 상대방이 채팅을 읽기 전이면 '보냄'으로 표시하도록
- Fix: (Friendly) 흐림 효과를 사용할 때 하단 내비게이션 바의 가독성이 매우 떨어지는 문제
- Fix: (Friendly) 위젯 버튼에서 'UI 애니메이션 줄이기' 옵션이 적용되지 않는 문제
- Fix: (Friendly) 스크롤을 해도 위젯 버튼이 숨겨지지 않는 문제
- Fix: (Friendly) 특정 조건에서 페이지를 새로 고치면 이전 페이지가 표시되는 문제
- Fix: 움직임이 있는 MFM 설정을 사용하지 않아도 `$[rainbow ]`문자를 볼 수 있음 (misskey-dev/misskey#11361)
- Fix: 모바일에서 헤더의 디자인을 변경하면 흐림 효과가 강제됨
- Fix: 환경설정 백업 시 일부 설정이 누락되어 백업되는 문제
- Fix: 다른 서버의 사용자에게 '메시지 보내기' 시 초기 텍스트 멘션이 잘못 표시되는 문제 수정 (misskey-dev/misskey#11721)
- Fix: Misskey 플러그인 설치 시 AiScript 버전 확인이 0.14.0 이후 버전에서 지원되지 않는 문제 수정 (misskey-dev/misskey#11729)
- Fix: '대화'에서 Autocomplete를 사용할 수 없음
- Fix: 누락된 안테나 소스 추가
- Fix: OffscreenCanvas undefined (MisskeyIO/misskey#165)
- Fix: 대화 삭제가 올바르게 작동하지 않음
- Fix: 유저 메뉴에서 '대화 시작하기'를 클릭하면 잘못된 페이지가 호출됨화
- Fix: 대화 페이지의 스크롤이 의도하지 않은 방향으로 작동할 수 있음

### Server
- Nodeinfo의 Software 이름을 CherryPick이 아닌 다른 이름으로 변경할 때 관련 주석 추가
- Graceful Shutdown (MisskeyIO/misskey#156)
- Perf: 부팅 시 MeiliSearch 설정을 업데이트하지 마십시오 (MisskeyIO/misskey#158)
- Enhance: 종료 시 DB 연결이 끊어지면 확실하게 종료 (MisskeyIO/misskey#159)
- Fix: 실행 중인 앱 내에서 ServerStatsService 시작 (misskey-dev/misskey#11342)
- Fix: deliver-delayed에서 URL 구문 분석에 실패할 때 모든 것이 꼬이는 문제 수정 (MisskeyIO/misskey#164)
- Fix: 대기열에 예상치 못한 데이터가 있는 경우, 엔드포인트 URL 구문 분석 및 오류 로그 생성에 실패하는 문제 수정 (MisskeyIO/misskey#168)
- Fix: 리모트 서버로 대화를 발신할 수 없는 문제

---

## 13.14.2-cp-4.2.0
출시일: 2023/7/29<br>
Misskey의 전체 변경 사항을 확인하려면, [CHANGELOG.md#13142](CHANGELOG.md#13142) 문서를 참고하십시오.

### General
- 리액션 수신의 기본값을 전체로 설정
- 제어판 메인 화면에 서버 통계 추가
- 노트의 시간을 일자로 표시하는 기능
- 고양이 타임라인 추가
- 미디어 타임라인 개선
- 타임라인 편집 기능 추가
- 모바일 환경에서 타임라인의 헤더 디자인을 변경할 수 있음
- 「제어판 - 유저」에서 최근 온라인 유저를 정렬해서 볼 수 있음
- 「이미 본 리노트를 간략화하기」 옵션의 기본값을 켜짐으로 변경 (revert 94bd0fa9)
- 서브 노트에 액션 버튼을 표시하는 기능
- 「발견하기」의 인기 태그 기본값을 펼침으로 설정
- 초대 코드 해지 기능을 새 버전에 맞게 개선
- 리모트 캐시 파일을 별도의 Object Storage에 저장하도록 설정 ([libnare/mk-castella@0d93433](https://github.com/libnare/mk-castella/commit/0d93433b0836238f518658b5719ce335060963b0)) 
- Byeolvit 테마 추가 ([Luminon/Byeolvit-Theme](https://github.com/Luminon/Byeolvit-Theme), [libnare/mk-castella@3c95399](https://github.com/libnare/mk-castella/commit/3c95399d0989015bb92836e48d010df07619038b))
- buttersc.one 테마 추가 ([libnare/mk-castella@6f15fa1](https://github.com/libnare/mk-castella/commit/6f15fa10b8022d0830254b8f615153d11c441480))
- stella.place 테마 추가 ([libnare/mk-castella@f6f77db](https://github.com/libnare/mk-castella/commit/f6f77dbd7f94b87edd3550ecf59e2bbd1fb3c708))
- 이모지를 한 번에 두 개 이상 업로드할 수 있는 옵션 추가

### Client
- (Friendly) 데스크톱 모드에서 타임라인 옆에 위젯 영역을 배치하도록
- (Friendly) 위젯 영역과 알림 영역의 현재 상태에 따라서 아이콘을 다르게 설정
- 리노트 전 확인 팝업을 띄움
- 유저 팝업 디자인 개선
- 절대 시간으로 표시할 때 툴팁에서는 상대 시간을 표기
- 환영 메시지를 MFM으로 렌더링
- 노트 내용이 없으면 번역 버튼을 활성화하지 않음
- 노트 작성 폼 개선
  - 내용이 너무 길면 스크롤 가능하도록
  - 브라우저의 최대 높이를 초과하지 않도록
- MkDialog 버튼이 3개 이상이면 정렬을 변경하도록
- 리노트 유저 팝업의 디자인 일부 개선
- 네비게이션 바의 블러 처리 추가
- 헤더의 블러 설정 추가
- 「이미 팔로우한 경우 알림 필드에 팔로우 버튼을 표시하지 않음」설정 사용 시, 팔로우 했다는 문구를 표시하도록
- 흐림 효과를 비활성화 하면 알림을 불투명하게 표시하도록
- 설정 - 일반에 있는 일부 기능의 위치를 CherryPick 으로 이동
- 리노트할 때 확인 팝업 표시 유무를 선택할 수 있음
- Fix: 그룹 초대 알림 아이콘이 잘못 표시되는 문제
- Fix: 노트 디자인이 올바르지 않게 표시되는 문제
- Fix: 프로필 아이콘이 투명일 때 노트 답글선이 비치는 문제
- Fix: 서브 노트의 내용 숨김 버튼의 디자인이 잘못 표시되는 문제
- Fix: 「좋아요만 받기」로 설정된 노트에서 리액션 버튼이 여러 개 표시되는 문제
- Fix: 「좋아요만 받기」로 설정된 노트에서 좋아요를 취소하려고 할 때 아이콘이 잘못 표시되는 문제

### Server
- 미디어 타임라인 개선
- 오류 페이지 재구성

---

## 13.13.2-cp-4.1.0
출시일: 2023/6/20<br>
Misskey의 전체 변경 사항을 확인하려면, [CHANGELOG.md#13132](CHANGELOG.md#13132) 문서를 참고하십시오.

### General
- 타임라인에 노트의 답글을 표시하는 옵션의 기본값을 켜짐으로 설정
- 네비게이션 메뉴의 배치를 수정
- 프로필 아이콘의 기본값을 사각형으로 설정
- 미디어 타임라인 추가 ([kiyo4act/misskey.design＠c01be0d](https://github.com/kiyo4act/misskey.design/commit/c01be0dc7674cdf0bcac6081c63baab52c4c9abe))
- ruby 표기 지원 ([yuriha-chan/misskey@0a109d4](https://github.com/yuriha-chan/misskey/commit/0a109d4f7442f8eedc48693b09ad2fd0b61e67a5), [yuriha-chan/misskey@446f0c2](https://github.com/yuriha-chan/misskey/commit/446f0c2ea5cc9a9f7f48a75935bce550bd0b3095), [yuriha-chan/misskey@4cfd28a](https://github.com/yuriha-chan/misskey/commit/4cfd28a452be0cdcc1328d77ab0db6dca627ca23), [yuriha-chan/misskey@dc6a6dc](https://github.com/yuriha-chan/misskey/commit/dc6a6dcdc3c2ac5b836570defb14ef4d441725e8))
- 노트 검색을 전체/로컬/리모트로 나누도록 변경 ([kiyo4act/misskey.design@4adad07](https://github.com/kiyo4act/misskey.design/commit/4adad0768ce02bd49207a94678cf3c9130ed9e10))
- 노트/유저 검색 페이지에서 Enter 키를 누르면 검색하도록
- 프로필 번역 기능 추가
- 네비게이션 메뉴에 배너 표시 옵션 추가
- 노트에서 프로필 아이콘을 숨기는 옵션 추가
- 닉네임 기능 ([shrimpia/misskey@126f145](https://github.com/shrimpia/misskey/commit/126f145560caa0cc34fe8d2c9ee22f3be922ea10), [shrimpia/misskey@58f70be](https://github.com/shrimpia/misskey/commit/58f70beb9aff2287a64d903b43583184340294aa))
  - 유저 페이지에서 사용자의 이름을 클릭 또는 탭하여 원하는 이름으로 변경할 수 있습니다.
- 「노트 액션 버튼을 마우스를 올렸을 때에만 표시」 옵션을 켰을 때, 자세히 버튼을 표시하도록 변경 ([shrimpia/misskey@4802191](https://github.com/shrimpia/misskey/commit/48021913bb9b6b2a314e8d88e3816f6f66a52888))
- 「이미 팔로우한 경우 알림 필드에 팔로우 버튼을 표시하지 않음」을 선택 사항으로 설정 ([shrimpia/misskey@9345149](https://github.com/shrimpia/misskey/commit/9345149f5d0447058a6ed1524708925a84744bd7))
- 노트 작성 폼에서 본문 미리보기 상태 기억 ([shrimpia/misskey](https://github.com/shrimpia/misskey))
- 리모트에 존재하는 커스텀 이모지도 자신의 서버 내에 같은 이름의 이모지가 있으면 리액션 할 수 있도록 ([shrimpia/misskey@e91295f](https://github.com/shrimpia/misskey/commit/e91295ff9c6f8ac90f61c8de7a891a6836e48e95), [shrimpia/misskey@010378f](https://github.com/shrimpia/misskey/commit/010378fae659ad3015bfade4346209e01bb2a902), [shrimpia/misskey@acf2a30](https://github.com/shrimpia/misskey/commit/acf2a30e8a8c57525dfbab499dbb0b6c7d8e43c2))
- 「이미 본 리노트를 간략화하기」 옵션의 기본값을 꺼짐으로 설정
- 이벤트 기능 (misskey-dev/misskey#10628)
- Play에 API Token을 요청할 수 있는 기능 추가 (misskey-dev/misskey#10949)
- 절대 시간 표기 (sakura-tel/milkey#69)
- 초대 코드 해지 기능 ([atsu1125/groundpolis@2da90e7](https://github.com/atsu1125/groundpolis/commit/2da90e7241d2f88390a7713e76a86f26e158248e))

### Client
- (Friendly) 일부 페이지를 제외하고 플로팅 버튼을 표시하지 않음
- 모바일에서 UI 흐림 효과를 비활성화 했을 때 가독성 향상
  - 토스트 알림의 배경이 불투명하게 표시되도록
  - 헤더의 배경이 불투명하게 표시되도록
- MFM 도움말에 검색 섹션 추가
- 노트 디자인 개선
- 채팅을 읽지 않았을 떄 표시되는 인디케이터의 위치 조정
- 이미 읽은 채팅은 가독성 개선을 위해 배경을 연하게
- 답글 노트의 디자인 개선
- 업데이트 팝업의 버튼 디자인 변경
- 팔로우/팔로워를 비공개로 하고 있는 경우 표시는 '0'이 아닌 키 아이콘을 표시하도록 (misskey-dev/misskey#10934)
- 신고의 초기 댓글에 사용자 ID 추가 ([kiyo4act/misskey.design@fded63c](https://github.com/kiyo4act/misskey.design/commit/fded63c7317721daeb8babcdf901dc00ab475231), [kiyo4act/misskey.design@8b6e303](https://github.com/kiyo4act/misskey.design/commit/8b6e303f184888193f4ce1daaa1629fedb46c7a9))
- OGP 미리보기 추가 ([kiyo4act/misskey.design@4eb0a6d](https://github.com/kiyo4act/misskey.design/commit/4eb0a6d8467c0c601e6fe37b0170c6c36f4bc8f2))
- 더 보기! 메뉴에 도움말 추가
- 노트를 자세히 볼 때 역할 배지를 표시하도록
- 일부 제어판 페이지의 헤더 개선
- 스크롤이 최상단일 때 헤더를 누르면 새로고침 메뉴를 표시하도록
- MkImgWithBlurhash에서 blurhash 그리기에 사용하는 canvas는 재사용하도록(misskey-dev/misskey#10966)
- CherryPick 고유 기능 및 개선된 기능은 「CherryPick」 배지 추가
- 네비게이션 메뉴 편집 페이지 UI 개선 ([shrimpia/misskey@bf8c84d](https://github.com/shrimpia/misskey/commit/bf8c84d299bd06cb21e18a9fe68ff9abc11fd4a0))
- 「노트 본문에 번역 버튼 표시」를 선택 사항으로 설정
- 답글도 번역할 수 있도록 개선
- 리노트 했을 때 뜨는 토스트 알림에 아이콘 추가
- 노트의 서버 정보 옵션의 순서를 변경
- 글로벌 타임라인의 아이콘 변경
- 노트 헤더에 리액션 수신 상태 표시
- 노트를 게시했을 때 토스트 알림 표시
- 노트 액션 버튼 추가 및 편의성 향상
- 데이터 세이버를 활성화하면 설정을 반영하기 위해 페이지를 새로 고치도록
- 그룹 페이지의 전반적인 디자인 개선
- 파일 및 투표의 details 디자인 개선
- Fix: (Friendly) 플로팅 메뉴를 길게 눌렀을 때 프로필 이미지를 드래그 할 수 있는 문제
- Fix: (Friendly) 타임라인이 변경되었을 때 네비게이션 바의 인디케이터가 사라지지 않는 문제
- Fix: (Friendly) 모바일에서 헤더가 사라졌을 때 프로필 아이콘의 높이가 잘못 설정되는 문제
- Fix: (Friendly) 화면이 넓은 일부 모바일 기기에서 프로필 아이콘의 높이가 잘못 설정되는 문제
- Fix: (Friendly) 스크롤 계산 방식 변경
- Fix: (Friendly) 모바일에서 네비게이션 메뉴의 인디케이터 크기를 작게 조정
- Fix: (Friendly) 유저 이름이 너무 긴 경우 디자인에 문제가 발생할 수 있음
- Fix: 네트워크 트래픽이 10MB/s를 초과하면 네트워크 통계 위젯의 그래프가 잘못 출력되는 문제
- Fix: iOS 기기에서 채팅 입력란이 채팅을 가리는 문제
- Fix: 특정 MFM 구문이 포함된 노트 간략화 옵션 비활성화 시, MFM 구문에 대해서는 더 보기 버튼을 표시하지 않도록
- Fix: 프로필 아이콘을 사각형으로 설정했을 때 유저 팝업의 디자인 개선
- Fix: 노트 헤더에서 유저 이름이 너무 긴 경우 디자인에 문제가 발생할 수 있음
- Fix: 그룹 페이지에서 기능이 제대로 작동하지 않음
- Fix: 채팅 내용이 길이가 너무 길어도 그만큼 공간을 차지하는 문제

### Server
- mfm-js를 cherrypick-mfm-js로 변경
- misskey-js를 cherrypick-js로 변경
- Add: Cloud Logging 기능 ([libnare/mk-castella@0a883ef](https://github.com/libnare/mk-castella/commit/0a883efe08921d5e5b7914a1075c3931122a623b), [libnare/mk-castella@7987d57](https://github.com/libnare/mk-castella/commit/7987d57789316084b38665e539e41a463ddaa110))
- Fix: 알림에서 UserGroupInvitation 관련 문제 해결 (kokonect-link/cherrypick#75)
- Fix: 정의되지 않은 OffscreenCanvas (misskey-dev/misskey#11017)

---

## 13.13.1-cp-4.0.0
출시일: 2023/6/6<br>
Misskey의 전체 변경 사항을 확인하려면, [CHANGELOG.md#13131](CHANGELOG.md#13131) 문서를 참고하십시오.

### General
- 채팅 및 그룹 기능 유지 (revert: misskey-dev/misskey#9919, misskey-dev/misskey#9942)
- 노트 수식 삽입 기능 복원 (MathML 호환을 위해 기존에 제거된 KaTex를 Temml로 대체 (misskey-dev/misskey#9754))
- Cloud Translation - Advanced(v3) 지원 추가 ([libnare/mk-castella@3c582dd](https://github.com/libnare/mk-castella/commit/3c582dd850d00f5b8faea027fd054118efb97856))
- mfm-cheat-sheet 복원

### Client
- (Friendly) 모바일에서 스크롤 시 각종 요소들의 유동적인 높이 조절을 변경된 헤더 디자인에 대응
- (Friendly) 모바일에서 하단 바를 길게 눌러 나오는 계정 관리 팝업에서 로그아웃 버튼 제거
- (Friendly) 모바일에서 하단 바를 길게 눌러 나오는 계정 관리 팝업에서 현재 계정의 이름을 표시하도록
- (Friendly) 데스크톱 헤더 디자인 개선
- (Friendly) 데스크톱 모드에서 타임라인 옆에 알림 영역을 배치하도록
- (Friendly) 오조작 방지를 위해 플로팅 버튼을 길게 눌러 새로고침 기능 제거
- (Friendly) 채팅 탭에 플로팅 버튼 추가
- 클라이언트에서 사용되는 폰트의 확장자를 ttf에서 woff2 및 woff로 변경 ([libnare/mk-castella@f439b3e](https://github.com/libnare/mk-castella/commit/f439b3e007618c02da7a352016b3d0f397311f54))
- about-misskey 페이지에 CherryPick 관련 정보 추가 및 Misskey 문단 구분명 추가
- 계정 초기 설정 마법사 개선
  - 뒤로 가기 버튼 추가
  - 나중에 버튼 추가
  - 글자 크기 설정 추가
  - 흐림 효과 설정 추가
  - MFM 및 움직이는 이미지 설정 추가
  - 초기 설정을 완료하면 페이지를 새로 고치도록 (일부 옵션이 페이지를 새로 고쳐야만 반영되므로)
- 계정 생성 팝업에 뒤로 가기 버튼 추가
- 리액션 버튼 디자인 개선
- 새 글꼴 크기 추가
- 위젯 편집 시 버튼의 디자인 개선
- 글꼴 크기를 보다 쉽게 변경할 수 있도록
- 볼드체 텍스트 설정 추가
- 노트 작성 폼의 디자인 개선
- 헤더에 뒤로 가기 버튼 추가
- 업데이트 팝업 개선 (Misskey와 CherryPick의 변경 사항을 직관적으로 볼 수 있도록)
- 서버 통계 위젯의 원 그래프 디자인 개선
- 새로운 서버 통계 위젯 추가
- 알림 기본 정렬을 수직으로 변경
- 채팅방 목록 페이지 디자인 개선
- 리노트 문구를 노트 최상단으로 배치
- 특정 MFM 구문이 포함된 노트를 간략화 할지 선택할 수 있음(enhance: [@aba0755](https://github.com/kokonect-link/cherrypick/commit/aba0755880d6797f49d34c8b7fe2c602d153e367))
- 노트 사이를 띄우는 옵션 활성화 시 알림 페이지의 노트도 띄우도록
- 안테나, 그룹, 리스트, 클립 페이지의 생성 버튼을 헤더로 이동
- 채팅 디자인 일부 개선
- 페이지 새로 고침 팝업을 조용히 알리는 기능 추가
- Fix: (Friendly) 위젯 영역에 safe-area-inset-bottom이 적용되지 않음
- Fix: (Friendly) 플로팅 메뉴를 길게 눌렀을 때 프로필 이미지를 드래그 할 수 있는 문제
- Fix: 위젯 편집 시 헤더 이외의 영역을 눌렀을 때 위젯 설정이 뜨는 문제
- Fix: 위젯 편집 종료 버튼이 여러 개 있는 문제
- Fix: 일부 옵션 변경 시 페이지를 새로 고치도록
- Fix: 위젯 추가 영역의 위치가 오른쪽으로 치우쳐 있음
- Fix: 노트 작성 폼의 프로필 아이콘 여백 조정
- Fix: 새 노트 알림이 프로필 아이콘을 밀어내는 문제
- Fix: 리노트 알림에 프로필 아이콘이 뜨는 문제
- Fix: 테마의 호환성이 저하되는 문제
- Fix: 채팅 입력란의 위치를 고정하도록
- Fix: 안테나 편집 페이지에 헤더가 누락됨

---

## 13.5.6-cp-3.1.0
출시일: 2023/2/10<br>
Misskey의 전체 변경 사항을 확인하려면, [CHANGELOG.md](CHANGELOG.md) 문서를 참고하십시오.

### NOTE
변경 사항이 없습니다.

---

## 13.5.5-cp-3.1.0
출시일: 2023/2/10<br>
Misskey의 전체 변경 사항을 확인하려면, [CHANGELOG.md](CHANGELOG.md) 문서를 참고하십시오.

### NOTE
이 버전부터 Misskey v13을 대응합니다.

### Improvements
- 클라이언트: (friendly) 새 노트가 있으면 하단 내비게이션 바에 인디케이터 알림이 활성화됨
- 클라이언트: (friendly) 일부 페이지에서 하단으로 스크롤하면 헤더를 자동으로 숨김
- 클라이언트: (friendly) 하단으로 스크롤하면 새 노트 알림의 위치가 자동으로 조정됨
- 클라이언트: (friendly) UI에 흐림 효과 사용 옵션을 비활성화하면 플로팅 버튼을 불투명하게 표시하도록 설정함
- 클라이언트: (friendly) UI 애니메이션 줄이기 옵션이 활성화된 경우 헤더와 플로팅 버튼의 전환 애니메이션을 비활성화함
- 클라이언트: (friendly) 하단 내비게이션 바의 타임라인 버튼을 길게 누르면 계정 전환 모달이 뜨도록 조정
- 클라이언트: (friendly) 플로팅 메뉴 버튼을 길게 눌러 새로고침 할 수 있음
- 클라이언트: 기본 테마 색상 일부 변경 🎨
- 클라이언트: 모든 계정 로그아웃 버튼과 구분하기 쉽도록 로그아웃 아이콘이 변경됨
- 클라이언트: 새 노트 알림이 부드럽게 표시되도록 애니메이션 추가
- 클라이언트: UI 애니메이션 줄이기 옵션이 활성화된 경우 새 노트 알림의 애니메이션을 비활성화함
- 클라이언트: 노트를 작성할 때, 단축키로 공개 범위를 전환할 수 있음
- 클라이언트: 작성한 노트를 복사 후 편집할 수 있는 기능 추가
- 클라이언트: 클라이언트 업데이트 시 캐시를 지우도록 유도하는 팝업 추가

### Bugfixes
- 클라이언트: (friendly) 타임라인이 아닌 페이지에서 헤더에 블러가 적용되는 문제
- 클라이언트: (friendly) 내비게이션 메뉴가 iPhone의 safe-area를 침범하는 문제 
- fix(locale): ko-KR 로케일 일부 개선

---

## 12.119.0-cp-3.0.0
출시일: 2022/9/16<br>
Misskey의 전체 변경 사항을 확인하려면, [CHANGELOG.md](CHANGELOG.md) 문서를 참고하십시오.

### NOTE
이 버전부터는 기존 버전과 연결되지 않고, 새로 포크하여 작업되었습니다. 따라서 기존 버전에 있던 기능들이 다시 명시될 수 있습니다.

### Improvements
- 클라이언트: (friendly) 모바일 환경에서 서버와 연결이 끊어졌을 때 표시되는 경고창의 UI 개선
- 클라이언트: (friendly) 모바일 환경에서 스크롤을 내리면 플로팅 버튼이 감춰지도록 변경
- 클라이언트: (friendly) 서버와 연결이 끊어졌을 때 10초간 경고를 표시한 후 자동으로 숨기기
- 클라이언트: (friendly) 서버와 연결이 끊어졌을 때 헤더에 연결 끊김 표시
- 클라이언트: (friendly) 모바일 환경에서 노트 작성 폼의 디자인 개선
- 클라이언트: Google Translate 서비스 추가 (thanks to @ltlapy)
- 클라이언트: DeepL과 Google Translate를 선택할 수 있는 옵션 추가
- 클라이언트: 더 많은 폰트 사이즈 설정
- 클라이언트: Enter 키를 눌러 보내기 옵션 추가
- 클라이언트: 서버와 연결이 끊어졌을 때 경고를 표시하지 않는 옵션 추가
- 클라이언트: 미디어 우클릭 방지 기능 추가
- 클라이언트: welcomeBack 알림에 프로필 아이콘 추가
- 클라이언트: 알림을 옆으로 스와이프 하거나 x 버튼을 눌러(데스크톱 전용) 지울 수 있도록 개선 (thanks to @groundpolis)
- 클라이언트: 알림 디자인 개선
- 클라이언트: 알림 페이지 디자인 개선
- 클라이언트: welcomeBack 알림을 옆으로 스와이프 해서 지울 수 있도록 개선
- 클라이언트: 새 노트 알림에 '노트 수 표시' 및 '알림 표시하지 않음' 옵션 추가
- 클라이언트: 모바일 환경에서 로그인 페이지 디자인 개선
- 클라이언트: 타임라인 전환시 맨 위로 이동하도록 변경
- 클라이언트: 위젯 위치 변경 방식 개선
- 클라이언트: 네비게이션 바 편집 환경 개선
- 클라이언트: 로그인된 모든 계정을 로그아웃하는 기능 추가
- 클라이언트: 네비게이션 바에 계정 로그아웃 메뉴 추가
- 클라이언트: 최초 가입 및 메일 인증시 스팸 메일함 확인 문구 추가
- 클라이언트: 대화 탭을 네비게이션 기본 배치에 추가

### Bugfixes
- 클라이언트: 채팅방에서 메시지를 입력하고 있을 때 움직이지 않는 온점(.)이 표시되는 문제
- 클라이언트: 환영 페이지에서 GitHub 바로가기와 더 보기 버튼이 겹쳐있는 경우 더 보기 버튼을 누를 수 없었던 문제

<!--
## 12.x.x-cp-2.x.x (unreleased)_legacy

### Improvements
- 클라이언트: 전반적인 UI의 브러시 업
- 클라이언트: MFM 함수 구문의 제안 구현
- 클라이언트: 읽지 않은 알림만 표시하는 기능
- 클라이언트: 알림 페이지에서 알림 종류에 따른 필터
- 클라이언트: 애니메이션 줄이기 설정 적용 범위 확대
- 클라이언트: 테마 컴파일러에 hue와 saturate 함수 추가
- 클라이언트: 노트 작성 폼에 취소선 기능 추가
- 클라이언트: 제어판 성능 개선
- 클라이언트: 자신의 리액션을 볼 수 있도록 개선
	- 설정에 따라, 리액션 목록을 모두에게 공개할 수 있음
- 클라이언트: 유저 검색 정확도 개선
- 클라이언트: 새로운 라이트 테마 추가
- 클라이언트: 새로운 다크 테마 추가
- 클라이언트: /share 쿼리로 댓글이나 파일 등의 정보를 전달할 수 있도록 변경
- UI(friendly): 내비게이션 메뉴 버튼에 알림 인디케이터 추가
- UI(friendly): 발견하기 탭에서 내비게이션 메뉴에 접근할 수 있도록 개선
- UI(friendly): 타임라인 헤더의 모달 팝업에 표시되는 인디케이터의 디자인 조정
- UI(friendly): 타임라인의 노트 디자인을 Misskey 기본 테마와 병합하고 디자인 개선
- UI(friendly): 헤더 작동 방식 최적화
- UI(friendly): 전반적인 UI를 Misskey 기본 테마와 병합
- ActivityPub: HTML -> MFM 변환 강화
- API: 그룹에서의 users/groups/leave 엔드포인트 구현
- API: i/notifications 에 unreadOnly 옵션 추가
- API: ap계열의 엔드포인트 로그인 필수화 + 속도 제한 추가
- API: 사용자의 리액션 목록을 가져오는 users/reactions 추가
- API: users/search 및 users/search-by-username-and-host 를 강화
- MFM: 굵게 <b></b> 및 취소선 <s></s> 태그 구문 추가
- Docker: Node.js를 17.0.1으로 업데이트
- 계정 등록 시 이메일 주소 설정을 필수로 설정하는 옵션 추가
- 페이지 로드 오류 페이지에 새로 고침 버튼 추가
- 뮤트 및 차단 목록을 import 할 수 있도록 변경
- 차트의 동기화를 매일 0시에 자동으로 수행

### Bugfixes
- 클라이언트: 헤더의 탭이 반환되는 문제
- 클라이언트: 헤더에 탭이 표시된 상태에서 타이틀을 클릭했을 때 탭 선택 팝업이 표시되는 문제
- 클라이언트(friendly): 안테나, 리스트 타임라인을 불러올 수 없는 문제
- 클라이언트: 유저 페이지의 탭이 작동하지 않는 문제
- 클라이언트: 핀 고정 사용자 설정 항목이 없는 문제
- 클라이언트: Deck UI 에서 겹친 컬럼의 한쪽을 접은 상태에서 오른쪽으로 내밀면 깨지는 문제
- 클라이언트: 테마 관리를 할 수 없는 문제
- 클라이언트: 리모트 노트에서 의도치 않게 로컬 커스텀 이모지가 사용될 수 있는 문제
- 클라이언트: 알림상에서 로컬 리액션이 나타나지 않는 문제
- 클라이언트: 위젯을 추가할 수 없는 문제
- UI(friendly): 헤더에 타이틀이 표시되지 않는 문제
- API: 애플리케이션 알림을 가져오지 않는 문제
- MFM: 링크 레이블의 언급은 텍스트로 구문 분석함
- MFM: URL 노드에 속성을 추가하여 <>로 묶었는지 여부를 나타냄
- MFM: 해시태그에서 < 및 > 의 사용을 허용하지 않음
- ActivityPub: not reacted 한 Undo.Like 가 inbox에 잔존하는 문제
- createDeleteAccountJob 수정
- 관리자용 작업 대기열에 지연된 작업이 목록에 표시되지 않는 문제 수정
- 일부 번역 개선
- 의존 패키지 업데이트

### Changes
- 보수성 및 사용성 측면에서 CherryPick 명령줄 옵션이 제거되었습니다.
	- 필요한 경우, 환경변수로 대체할 수 있습니다.
- MFM: 성능, 보수성, 구문 오인식 억제 관점에서 구형 함수 구문의 지원을 종료했습니다.
	- 구문 (`[foo bar]`)를 사용하지 않으며, 현행 구문 (`$[foo bar]`)를 사용해 주세요.
- 모더레이터를 차단하지 못하도록 설정된 부분이 연합간에 문제를 야기할 수 있음이 확인되어, 해당 부분을 제거했습니다.
- 데이터베이스에 로그를 저장하지 않습니다.
	- 로그를 영속화 하려면 syslog를 이용해 주세요.

---

## 12.91.0-cp-2.2.2 (2021/09/23)

### Bugfixes
- UI(friendly): 헤더 디자인 버그 수정

---

## 12.91.0-cp-2.2.1 (2021/09/23)

### Bugfixes
- UI(friendly): 헤더 디자인 버그 수정

---

## 12.91.0-cp-2.2.0 (2021/09/23)

## Features
- Friendly: 계정 전환 팝업에서 현재 로그인된 계정 또는 로그인된 모든 계정을 로그아웃하는 기능 추가
- VIP 등급 추가 및 전용 기능 추가
- 팔로워의 비공개 및 다이렉트 노트를 LTL에 표시하는 기능 제거(임시)
- 고양이로 설정된 계정이면 프로필 아이콘에 마우스 오버시 고양이 귀 애니메이션을 활성화

### Improvements
- UI: 모바일 환경에서 노트 작성 폼의 해시태그 영역 여백 조정
- ActivityPub: 리모트 유저를 Delete 하는 작업 지원
- ActivityPub: 차단된 인스턴스에 대한 resolver 확인 추가
- ActivityPub: deliver 큐의 메모리 사용량 감소
- API: 관리자용 계정 삭제 API 구현(/admin/accounts/delete)
	- 리모트 유저의 삭제도 가능하도록 개선
- 계정이 정지되었을 때, 정지되었다는 내용을 표시한 후 로그아웃하도록 변경
- 정지된 계정에 로그인하고자 할 때, 정지되었다는 내용을 표시하도록 변경
- 리스트, 안테나 타임라인을 개별 페이지로 분할
- 후원자 목록 갱신
- 일부 언어 개선
- Docker 문서 개선
- 광고 제거 기능의 가독성 개선
- 클라이언트 디자인 조정
- Docker Hub에 Image push 대응
- GitLocalize 대응
- Sentry 대응
- UI 개선
- MFM에 sparkles 효과 추가
- 로그인 하지 않은 사용자는 서버 업데이트 내역을 띄우지 않도록 변경
- 클라이언트를 부팅했을 때 업데이트가 가능한 경우, 오류 표시 및 대화 상자가 나타나지 않도록 변경
- 의존 패키지 업데이트
- 일부 문서 업데이트

### Bugfixes
- UI(Friendly, Friendly-legacy): 아이 모드를 대응하지 않는 문제 수정
- UI(Friendly): 계정을 전환할 수 없던 문제 수정
- Dockerfile 수정
- 노트 번역 시 공개 범위를 고려하지 않는 문제 수정
- 노트 상세 페이지에서 구분선이 남는 문제 수정
- 팝업으로 설정 페이지를 띄우면 계정을 폐쇄할 수 없는 문제 수정
- 계정 데이터 가져오기/내보내기 처리가 안 되는 문제 수정
- 안테나를 불러올 수 없는 문제 수정
- "문제가 발생했습니다" 팝업창을 열면 X 버튼이 존재하지 않아 창을 닫을 수 없는 문제 수정

---

## 12.90.0-cp-2.1.1 (2021/09/05)

## Features
- 로그 탭 복원

### Improvements
- Friendly UI: 프로필 아이콘을 누르면 네비게이션 메뉴가 뜨도록 변경
- 클라이언트 디자인 조정
- 업데이트 내역 문서 개선
- 아이 모드, 그리고 아이 위젯
	- 클라이언트에서 아이쨩을 소환할 수 있게 되었어요.
- URL로부터 업로드, AP의 첨부파일, 외부 파일에 대한 프록시 등에서는 Private 주소 등의 요청을 거부하도록 변경했어요.
	- development에서 동작하는 경우, 이 제한이 적용되지 않아요.
	- Proxy 사용 시, 이 제한이 적용되지 않아요.
		Proxy 사용 중에도 제한을 적용하려면 Proxy 측에서 설정해야 해요.
	- `default.yml`에서 `allowedPrivateNetworks`에 CIDR를 추가함으로써, 목적지 네트워크를 지정해 이 제한을 우회할 수 있어요.
- 업로드, 다운로드 할 수 있는 파일 크기에 하드 리밋이 적용되었어요.(약 250MB)
	- `default.yml`에서 `maxFileSize`를 변경함으로써, 제한값을 변경할 수 있어요.

### Bugfixes
- Friendly UI: 홈 영역에서 헤더에 뒤로가기 버튼이 생기는 문제 수정
- Friendly UI: 계정 전환 팝업이 뜨지 않는 문제 수정
- 답글, 리노트, 삭제 후 다시 편집 및 Friendly UI 이외의 UI에서 노트 작성 폼의 디자인 문제 수정
- 모바일 환경이 아니면 노트 작성 폼에 모달 배경 뜨도록 수정
- 번역에서 DeepL Pro 계정을 지원하지 않는 문제 수정
- 인스턴스 설정에서 DeepL Auth Key가 비워지는 문제 수정
- 보안 향상
- CSS 사용자화 기능 활성화 시 에러가 발생하는 문제 수정
- 초기 설정 시 관리자가 가입 페이지에서 로그인 할 수 없는 문제 수정
- CW 유지 설정을 복원
- 클라이언트 표시 수정

---

## 12.89.0-cp-2.1.0 (2021/08/23)

### Features
- 테마 스토어
- 프로필 아이콘을 사각형으로 표시하는 옵션
- CSS 사용자화
- 노트 작성 팝업에 어시스턴트 추가
- 이모지 추가 제안
- 메뉴를 상단에 표시할 수 있는 옵션 추가
- 타임라인 추가 (고양이, 리모트 팔로잉, 팔로워)
- MFM: 무지개 효과 추가
- 노트가 보여지는 타임라인을 노트 본문에 표시
- UI 흐림 효과 전환 기능
- 해시태그를 간편하게 추가할 수 있도록 노트 작성 폼에 기능 추가
- CherryPick 디스코드 커뮤니티 추가
- 이모지 목록을 볼 수 있는 페이지 추가
- 인스턴스 목록을 볼 수 있는 페이지 추가
- 노트 번역 기능 추가
	- 사용하려면 서버 관리자가 DeepL 무료 계정을 생성하고 발급받은 인증 키를 '인스턴스 설정 > 기타 > DeepL Auth Key'에 추가해야 합니다.
- CherryPick을 업데이트 하면 대화상자를 표시하도록 추가
- 작업 대기열 위젯에 경보음을 울리는 설정 추가
- 미디어 우클릭 방지 기능 추가

### UX Improvements
- 아날로그 시계 위젯의 바늘 두께를 사용자화 할 수 있는 옵션 추가
- 팔로우 알림을 메일로 발송하는 경우, 팔로우 한 사람의 닉네임이 표시되도록 변경
- 환영 페이지의 콘텐츠를 더욱 풍부하게 표시하도록 기능 확장
- 알림으로 표시된 노트를 읽으면, 알림 페이지에서도 해당 노트를 읽음으로 표시하도록 변경
- 이메일로 발신되는 새 팔로워 알림 메시지의 내용 개선
- 도움말 문서를 전반적으로 개선

### UI Improvements
- Friendly UI: 공지사항 모달 팝업 헤더에 아이콘 추가
- 알림 내용이 너무 긴 경우, 일정 길이 이상이 되면 내용을 자르도록 개선
- 리노트 페이지에서 유저 정보가 너무 긴 경우, 일부만 표시하도록 변경
- 타임라인에 새 노트가 있으면 뜨는 인디케이터의 디자인 조정
- 프로필 페이지의 유저 상세 메뉴를 복원
- 공지사항 아이콘 변경
- 노트 작성 폼의 디자인 개선

### Improvements
- 계정 삭제 안정성 향상
- 이모지의 자동 완성 동작 개선
- localStorage의 accounts가 indexedDB로 보존되도록 변경
- ActivityPub: 작업 대기열 시행 타이밍 조정 (#7635)
- API: sw/unregister 추가
- 단어 뮤트 문서 추가
- 의존 패키지 업데이트
- 일부 언어 추가
- AP Actor 수정
- DB에 로그를 저장하지 않도록 변경
- MiAS 주소 변경
- 렌더 슬롯에 함수를 사용하여 성능 향상
- 클라이언트 업데이트시 테마 캐시를 지우도록 변경
- 이모지 자동 완성시 첫 글자는 최근에 사용한 이모지를 제안하도록 변경
- 이모지 자동 완성 성능 개선
- about-misskey 페이지에 문서 링크 추가
- Docker: Node.js를 16.6.2로 업데이트
- 차단 동작 개선
	- 차단된 유저가 차단한 유저에 대해 어떠한 행동도 할 수 없습니다. 자세한 내용은 문서를 확인해 주십시오.
- 데이터베이스 인덱스 최적화
- Proxy 사용 시 Keep-Alive 지원
- DNS 캐시에서 네거티브 캐시 지원

### Bugfixes
- Friendly UI: 공지사항 팝업창의 footer UI 오류 수정
- 일부 디자인 오류 수정
- 함수 빌더 MFM 문법 오류 수정
- API Authenticate 및 인증 방식의 일부 보안 문제 수정
- 드라이브의 기본 업로드 위치를 지정해도 반영되지 않는 문제 수정
- CORS 오류
- 스트리밍이 불안정한 문제 수정
- 암호를 재설정해도 새 암호가 표시되지 않는 문제 수정
- 채널을 생성하면 계정을 삭제할 수 없는 문제 수정
- 노트를 [삭제 후 다시 편집]하면 투표의 항목이 [object Object]가 되는 문제 수정
- 터치 조작으로 창을 닫을 수 없던 문제 수정
- 리노트한 시각이 노트를 게시한 시각으로 표시되는 문제 수정
- 제어판에서 파일 삭제 시 보기 수정
- ActivityPub: 긴 사용자 이름 및 자기소개 지원

---

## 12.83.0-cp-2.0.0 (2021/06/14)

### CherryPick
Misskey 기반의 새로운 클라이언트를 선보입니다!
CherryPick은 다른 클라이언트의 유용한 기능들을 **이식**하고 **자체 기능**을 추가하여 사용성을 높인 **개조 클라이언트** 입니다.
~ CherryPick은 좋은 것만 뽑아서 쓰는 Cherry picking의 의미를 지니고 있어요! ~


### Friendly UI
#### 완전히 새롭게 디자인된 Friendly UI를 만나보세요!

### Features
- Friendly UI: 타임라인 설정을 통해, 헤더에 타임라인을 추가하고 순서를 변경할 수 있어요!
- Friendly UI: 헤더에서 공지사항을 열람할 수 있어요!
- Friendly UI: 새 노트 알림의 디자인(4가지)을 선택할 수 있어요!
- 현재 로그인된 모든 계정을 로그아웃 할 수 있는 기능을 추가했어요!
- 인용된 노트의 미디어를 자동으로 펼치는 기능을 추가했어요! 이 옵션은 설정에서 해제할 수 있어요.
- 카오모지 뽑기가 추가됐어요!

### UX Improvements
- Friendly UI: 헤더에서 타임라인 위치를 직관적으로 알 수 있도록 새롭게 변경했어요!
- Friendly UI: 계정 전환을 보다 직관적으로 할 수 있도록 새롭게 변경했어요!
- Friendly UI: 팔로워의 비공개 노트 및 다이렉트 노트를 로컬 타임라인(LTL)에 표시하는 기능을 추가했어요.
- Friendly UI: 타임라인에 새 노트가 있을 때 내비게이션바에 인디케이터로 알려줘요.
- Friendly UI: 그룹, 채널, 안테나 페이지에도 플로팅 버튼을 추가했어요!
- 노트 페이지에서 리노트 하거나 인용한 개수를 확인할 수 있어요.
- 리노트 하거나 인용한 유저를 확인할 수 있어요.
- 인스턴스 요약 탭에 CherryPick 버전이 표시돼요.
- 노트 작성 시 보여질 내용을 미리 볼 수 있는 기능을 추가했어요!
- 노트 작성 화면에서 사용할 수 있는 각종 퀵액션을 추가했어요!
- 노트 게시 전 최종 확인(검토)하는 옵션이 추가됐어요! 설정에서 켤 수 있어요.
- 사이드바 설정을 보다 직관적으로 할 수 있도록 새롭게 변경했어요!
- 위젯 편집시 의도치 않은 이동이 발생하지 않도록, 편집 환경을 전반적으로 개선했어요!
- 모바일 환경에서 유저 프로필 프리뷰가 뜨지 않도록 조정했어요.
- 발견하기와 검색을 통합했어요! 이제 검색 기능은 여기서 이용해 주세요 :)
- 노트와 유저를 동시에 검색할 수 있게 변경했어요.
- 사이드 바와 내비게이션 바의 배치를 개선했어요.
- 더 작은 폰트(verySmail) 크기를 추가했어요!
- 프로필 페이지에 프로필 수정 버튼을 추가했어요! 이제 수정을 위해서 더 보기 버튼을 누르지 않아도 돼요.
- 프로필 페이지에서 더 보기 버튼을 하나로 줄였어요. (저도 왜 이게 2개나 있는지 모르겠어요...)

### UI Improvements
- Friendly UI: 새 노트 알림의 아이콘이 변경됐어요.
- 가독성을 위해 로고 색상을 약간 조정했어요.
- 답글 노트를 리노트 했을 때, 리노트 한 유저를 노트 영역의 맨 위에 표시하도록 변경했어요.
- 기본 테마를 변경했어요!
- 모바일 환경에서 토스트 알림 디자인을 개선했어요! 궁금하면 저를 팔로우 해보세요🙂
- 플로팅 버튼의 그림자를 조정했어요.
- 이모지 버튼의 디자인을 변경했어요.

### Improvements
- misskey.js 버전을 업데이트 했어요.
- 의존 패키지를 업데이트 했어요.
- 베젤리스 디바이스를 대응했어요!
- 클라이언트의 버전이 업데이트 되었을 때 나타나는 팝업에 한국어를 추가했어요! (펄-럭)
- 리버시에서 향후 호환성에 문제가 발생할 수 있는 부분을 업데이트 했어요!
- 플로팅 버튼의 작동 방식을 개선했어요.
- 타임라인의 노트 간격 옵션을 기본 활성화로 설정했어요.
- 테마 찾아보기 연결 주소가 변경됐어요.

### Bugfixes
- 리모트 유저 정보 갱신시 발생하는 오류가 수정됐어요.
- 리모트 유저의 프로필을 불러올 때 문제를 야기할 수 있는 부분이 수정됐어요.
- 환영 페이지에서 배너 이미지가 뜨지 않는 문제를 수정했어요!
- 비로그인 상태에서 유저 프로필의 노트를 열람하지 못하는 문제를 수정했어요.
- 환영 페이지에서 GitHub 바로가기와 더 보기 버튼이 겹쳐있는 경우 더 보기 버튼을 누를 수 없었던 문제를 수정했어요.
- 이미지가 노트 영역을 뚫고 나오는 문제를 수정했어요.
- 일본어 및 한국어를 제외한 언어에서 도움말의 API 문서의 목차가 작동하지 않는 문제를 수정했어요.
- 알림 토스트의 텍스트가 eclipse 되지 않는 문제를 수정했어요.
- 사이드바와 인스턴스 유저 관리 페이지에서 유저 닉네임이 너무 길면 overflow되는 문제를 수정했어요.
-->
