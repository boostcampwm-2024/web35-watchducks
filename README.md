# WatchDucks 🐥

<img width="1063" alt="image" src="https://github.com/user-attachments/assets/3845c953-5d2a-4c95-9610-14a67ce85d38">

<div align="center">

## "캠퍼들만을 위한, 설치가 필요 없는 트래픽 분석 플랫폼"

와치덕스 (WatchDucks)는 모니터링 한다는 의미의 Watch와 부스트 캠프의 마스코트 부덕(Duck)이의 합성어입니다.

**DNS 서비스와 네임서버**의 동작 원리에서 착안, **프록시 서버**를 도입하여 설치가 필요없는 트래픽 분석 서비스를 제공합니다.

자신의 프로젝트는 물론, 다양한 캠퍼들의 프로젝트 현황을 비교·분석할 수 있습니다. 또한, 기수별 프로젝트 현황을 제공해 부스트캠프의 역사를 기록합니다.

[🌐 배포 링크 바로가기](https://watchducks.netlify.app/)         |          [📚 프로젝트 위키 바로가기](https://github.com/boostcampwm-2024/web35-WatchDucks/wiki) 

</div>

## 📌 목차
  * [🚀 주요 기능](#-주요-기능)
    * [1. 프로젝트 등록](#1-프로젝트-등록)
    * [2. 기수별 전체 프로젝트 메트릭 확인](#2-기수별-전체-프로젝트-메트릭-확인)
    * [3. 개별 프로젝트 메트릭 확인](#3-개별-프로젝트-메트릭-확인)
    * [4. 기수별 프로젝트 순위 확인](#4-기수별-프로젝트-순위-확인)
  * [📃 프로젝트 설계](#-프로젝트-설계)
    * [📈 아키텍처](#-아키텍처)
    * [📈 시퀀스 다이어그램](#-시퀀스-다이어그램)
    * [📈 동작 원리 흐름도](#-동작-원리-흐름도)
  * [🙇 팀원소개](#-팀원소개)


## 🚀 사용 방법

### 1. 프로젝트 등록
<img width="1624" alt="Screenshot 2024-12-02 at 5 50 54 PM" src="https://github.com/user-attachments/assets/30eb60a9-92aa-4282-8361-d4224361ae7f">
- 프로젝트 정보를 작성해 등록합니다.
- 중복된 도메인은 작성할 수 없습니다.
- 유효성 검사 후, 사용자에게 왓치덕스의 네임서버 주소를 메일로 전송합니다.
- 상용 DNS 서비스의 기본제공 네임서버를 ➡️ 왓치덕스가 제공한 네임서버로 변경합니다.

### 2. 기수별 전체 프로젝트 메트릭 확인
<img width="1624" alt="Screenshot 2024-12-02 at 5 54 32 PM" src="https://github.com/user-attachments/assets/a669aed5-3556-4920-a9e7-ace933034167">
- 사이드바에서 기수를 선택할 수 있습니다.
- 선택한 기수의 전체 프로젝트와 관련된 메트릭을 확인합니다.
    - 등록 프로젝트 수
    - 총 트래픽
    - 전일 대비 트래픽
    - 평균 응답 시간
    - 응답 성공률 (500번대만을 실패로 처리합니다)
    - 개별 프로젝트 평균 응답 속도
    - Top5 트래픽

### 3. 개별 프로젝트 메트릭 확인
![image](https://github.com/user-attachments/assets/c9960482-05f6-4e30-9f8d-a52d44349c4b)
- 사이드바에서 개별 프로젝트를 선택할 수 있습니다.
- 선택한 프로젝트와 관련된 메트릭을 확인합니다.
    - 경로별(`/project`, `/login`, `...`) 응답 시간
    - 평균 응답 시간
    - DAU(Daily Active Uesrs; 일일 활성 유저)
    - 응답 성공률
    - 단위별(월/일/시간/분) 실시간 트래픽

### 4. 기수별 프로젝트 순위 확인
<img width="1624" alt="Screenshot 2024-12-02 at 5 54 03 PM" src="https://github.com/user-attachments/assets/ec62ba84-513e-4703-88d1-3f84d35d90e2">
- 사이드바에서 기수를 선택할 수 있습니다.
- 선택한 기수의 등록된 프로젝트 관련 메트릭을 토대로 전체 순위를 표시합니다.
    - 총 트래픽, 요청 성공률, 평균 응답 시간, DAU를 선택해 기준으로 확인할 수 있습니다.

## 📃 프로젝트 설계

### 📈 아키텍처
![WatchDucks Architecture Page 1](https://github.com/user-attachments/assets/16ecd233-6081-40f1-8041-939dfaa9c0f5)

### 📈 시퀀스 다이어그램
<img width="960" alt="스크린샷 2024-11-21 오후 10 10 05" src="https://github.com/user-attachments/assets/fe264935-df48-417f-89be-7f1c08ec44ed">

### 📈 동작 원리 흐름도 
![image](https://github.com/user-attachments/assets/141cd28d-f5c5-4df8-bf2e-4b2a45ab2800)

#### 용어 설명
`Client` : ‘WatchDucks‘서비스를 이용하는 고객이자 서비스를 제공하는 캠퍼
`User` : Client가 제공하는 서비스 사용자

#### 사전 조건
- `Client`는 상용 DNS 서비스 (Cloudflare, Gabia 등)을 사용해야 합니다.
- `Client`는 HTTPS 통신을 사용해야 합니다.

#### 0. Client의 프로젝트 등록 (0)
- `Client`의 서버 도메인네임과 IP, 메일 주소를 WatchDucks에 등록합니다.
- 유효한 프로젝트 정보라면(도메인네임 중복이 없다면) 메일 주소로 WatchDucks의 네임서버 주소를 전송합니다.
---
- Client는 발급받은 네임서버를 본인이 사용하는 DNS에 네임서버로 등록합니다. (기본 제공 네임서버에서 와치덕스의 네임서버로 변경)

#### 1. User가 Client에 서비스 요청 

- `User`가 `Client`의 서비스를 사용하고자 해당 도메인네임으로 요청을 보내면, DNS는 매핑되어있는 NameServer에 DNS Query를 전송합니다. (UDP 통신) (1), (2)
- WatchDucks의 `Name Server`는 등록되어 있는 도메인네임인지 확인하고, WatchDucks의 `Proxy Server` IP를 응답으로 전송합니다. (3)
- DNS애 의해 `User`의 요청이 응답 받은 `Proxy Server` IP로 전송됩니다. (4)

#### 2. Proxy Server (4), (5)

1. `User`의 요청 헤더에서 Host값(요청 도메인네임)을 통해 매핑된 `Client` 서버 IP로 요청을 전달합니다.
2. 응답받은 `Client`서버의 응답을 `User`에게 전달합니다.
3. 이 과정에서 트래픽, 요청 성공 여부, 응답 소요 시간 등의 로그를 수집하여 컬럼 기반 DB에 영속화합니다.

#### 3. WatchDucks 콘솔

1. 대시보드에서 `Client` 서버들로부터 수집된 로그를 확인할 수 있습니다.
2. 다른 `Client`(캠퍼)들의 현황을 실시간으로 모니터링 가능



## 🙇 팀원소개

<table>
    <tr align="center">
        <td style="min-width: 150px;">
            <a href="https://github.com/hyo-limilimee">
              <img src="https://github.com/hyo-limilimee.png" width="100">
              <br />
              <b>강효림(BE)</b>
            </a>
        </td>
        <td style="min-width: 150px;">
            <a href="https://github.com/EnvyW6567">
              <img src="https://github.com/EnvyW6567.png" width="100">
              <br />
              <b>노병우(BE)</b>
            </a>
        </td>
        <td style="min-width: 150px;">
            <a href="https://github.com/Hosung99">
              <img src="https://github.com/Hosung99.png" width="100">
              <br />
              <b>손성호(FE)</b>
            </a>
        </td>
        <td style="min-width: 150px;">
            <a href="https://github.com/sjy2335">
              <img src="https://github.com/sjy2335.png" width="100">
              <br />
              <b>윤상진(BE)</b>
            </a>
        </td>
    </tr>
      <tr align="center">
        <td>
            ISTJ
        </td>
        <td>
            ENFP
        </td>
        <td>
            ISFP
        </td>
        <td>
            INFP
        </td>
    </tr>
</table>

<hr/>
