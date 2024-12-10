# WatchDucks <img width=30px height=30px alt="logo" src="https://github.com/user-attachments/assets/6eaa5168-266f-4b47-bd0b-0d8205a2a4ae">

<img width="922" alt="image" src="https://github.com/user-attachments/assets/a4fd17d7-8a66-4b21-a0a8-f8ec9c7763fb">

<div align="center">

## "캠퍼들만을 위한, 설치가 필요 없는 트래픽 분석 서비스"

와치덕스 (WatchDucks)는 모니터링 한다는 의미의 Watch와 부스트 캠프의 마스코트 부덕(Duck)이의 합성어입니다.

**DNS 서비스와 네임서버**의 동작 원리에서 착안, **프록시 서버**를 도입하여 설치가 필요없는 트래픽 분석 서비스를 제공합니다.

자신의 프로젝트는 물론, 다양한 캠퍼들의 프로젝트 현황을 비교·분석할 수 있습니다. 또한, 기수별 프로젝트 현황을 제공해 부스트캠프의 역사를 기록합니다.

[🌐 배포 링크 바로가기](https://watchducks.netlify.app/)         |          [📚 프로젝트 위키 바로가기](https://github.com/boostcampwm-2024/web35-WatchDucks/wiki) 

</div>

## 🎯 Watchducks의 차별점
### 1. Watchducks는 다른 로그 분석 시스템과 다르게 설치할 필요가 없습니다.
- 기존 서비스들(Google Analytics, Amplitude 등)은 SDK 설치나 스크립트 삽입이 필요한 반면, 와치덕스는 네임서버 변경만으로도 즉시 사용 가능합니다.
- 프로젝트 코드 수정이나 추가 설정 없이 트래픽 분석을 시작할 수 있습니다

### 2. BoostCamp 캠퍼들을 위한, '맞춤형 로그 분석 사이트' 입니다.
- 기수별, 팀별 비교 분석이 가능한 유일한 서비스입니다.
- 부스트캠프 생태계 내 프로젝트들의 히스토리를 체계적으로 아카이빙합니다.
- 다른 캠퍼들의 프로젝트 트래픽을 실시간으로 비교 분석할 수 있습니다.

## 📌 목차
- [🚀 사용 방법](#-사용-방법)
- [📈 아키텍처](#-아키텍처)
- [🛠 기술 스택](#-기술-스택)
- [🏆 기술적 도전 및 핵심 경험](#-기술적-도전-및-핵심-경험)
- [🙇 팀원소개](#-팀원소개)

## 🚀 사용 방법
### 1. [프로젝트 등록페이지](https://watchducks.site/register)에서 프로젝트 정보 등록
<img width="800" src= "https://github.com/user-attachments/assets/bf043bfc-1c1b-4e9e-9966-cbaa63eeceb0">

- 그룹 프로젝트에 필요한 정보를 등록해주세요
- 유효성 검사 후, 사용자에게 왓치덕스의 네임서버 주소를 메일로 전송합니다.

### 2. 네임서버 변경하기
- 메일로 받은 네임서버로 네임서버 설정을 변경합니다. (예시 사진: 가비아)
<img width="800" src= "https://github.com/user-attachments/assets/f6198851-2dfa-4494-84e8-39610b4e9746">

### 3. 기수별, 팀별 프로젝트 트래픽 정보를 확인
**기수 별 트래픽 정보 확인**<br>
<img width="800" src= "https://github.com/user-attachments/assets/ddc2b297-7b65-4ab7-86f3-86321bb1ae7a">
<br><br>
**개별 프로젝트 메트릭 확인**<br>
<img width="800" alt="스크린샷 2024-12-04 오전 12 52 50" src="https://github.com/user-attachments/assets/eb5c38e0-6f5b-4ff8-9e40-c4986fe40998">
<br><br>
**기수별 프로젝트 순위 확인**<br>
<img width="800" alt="스크린샷 2024-12-04 오전 12 52 50" src="https://github.com/user-attachments/assets/d36a070c-1006-46f6-a31d-67c473793df1">

<br>

[🔍 자세한 가이드 ↗️](https://github.com/boostcampwm-2024/web35-watchducks/wiki/%EC%82%AC%EC%9A%A9-%EA%B0%80%EC%9D%B4%EB%93%9C) <br>
[❓ FAQ  ↗️](https://github.com/boostcampwm-2024/web35-watchducks/wiki/FAQ)

<br>

## 📈 아키텍처

<img width="800" alt="WatchDucks Architecture Page 1" src="https://github.com/user-attachments/assets/16ecd233-6081-40f1-8041-939dfaa9c0f5">


## 🛠 기술 스택

| Category | Technologies |
|:--|:--|
| Infrastructure | ![NCP](https://img.shields.io/badge/Naver_Cloud-03C75A?style=flat-square&logo=naver&logoColor=white) ![Ubuntu](https://img.shields.io/badge/Ubuntu-E95420?style=flat-square&logo=ubuntu&logoColor=white) ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=flat-square&logo=docker&logoColor=white) |
| Backend | ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat-square&logo=typescript&logoColor=white) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=flat-square&logo=node.js&logoColor=white) ![Fastify](https://img.shields.io/badge/fastify-%23000000.svg?style=flat-square&logo=fastify&logoColor=white) ![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=flat-square&logo=nestjs&logoColor=white) ![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=flat-square&logo=nginx&logoColor=white) |
| Frontend | ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat-square&logo=typescript&logoColor=white) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=flat-square&logo=react&logoColor=%2361DAFB) ![React Query](https://img.shields.io/badge/React%20Query-FF4154?style=flat-square&logo=react%20query&logoColor=white) ![Zustand](https://img.shields.io/badge/zustand-%2320232a.svg?style=flat-square&logo=react&logoColor=%2361DAFB) ![ApexCharts](https://img.shields.io/badge/ApexCharts-%23F37626.svg?style=flat-square&logo=apache&logoColor=white) |
| Database | ![ClickHouse](https://img.shields.io/badge/ClickHouse-FFCC01?style=flat-square&logo=clickhouse&logoColor=black) ![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=flat-square&logo=mysql&logoColor=white) ![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=flat-square&logo=redis&logoColor=white) |
| Monitoring | ![Prometheus](https://img.shields.io/badge/Prometheus-E6522C?style=flat-square&logo=prometheus&logoColor=white) ![Grafana](https://img.shields.io/badge/grafana-%23F46800.svg?style=flat-square&logo=grafana&logoColor=white) |
| Testing & Documentation | ![Jest](https://img.shields.io/badge/-jest-%23C21325?style=flat-square&logo=jest&logoColor=white) ![Artillery](https://img.shields.io/badge/Artillery-%23000000.svg?style=flat-square&logo=artillery&logoColor=white) ![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=flat-square&logo=swagger&logoColor=white) |
| CI/CD | ![GitHub Container Registry](https://img.shields.io/badge/GitHub%20Container%20Registry-%23121011.svg?style=flat-square&logo=github&logoColor=white) ![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=flat-square&logo=githubactions&logoColor=white) ![Netlify](https://img.shields.io/badge/netlify-%23000000.svg?style=flat-square&logo=netlify&logoColor=#00C7B7) |

[⌨️ Watchducks의 기술에 대해 더 알고 싶다면](https://github.com/boostcampwm-2024/web35-watchducks/wiki/%EA%B8%B0%EC%88%A0-%EA%B4%80%EB%A0%A8-%EC%9E%84%EC%8B%9C-%ED%8E%98%EC%9D%B4%EC%A7%80)

<br>

## 🏆 기술적 도전 및 핵심 경험
| 개발 맥락 바로가기 | 태그 |
|----------|--|
| [🤔 우리의 로그 시스템은 어떻게 구축해야 할까?](https://github.com/boostcampwm-2024/web35-watchducks/wiki/%EC%9A%B0%EB%A6%AC%EC%9D%98-%EB%A1%9C%EA%B7%B8-%EC%8B%9C%EC%8A%A4%ED%85%9C%EC%9D%80-%EC%96%B4%EB%96%BB%EA%B2%8C-%EA%B5%AC%EC%B6%95%ED%95%B4%EC%95%BC%ED%95%A0%EA%B9%8C%3F) | `기획` `프로토타입`|
| [🛠️ 개발 환경 어떻게 세팅해야 할까?](https://github.com/boostcampwm-2024/web35-watchducks/wiki/%EA%B0%9C%EB%B0%9C-%ED%99%98%EA%B2%BD-%EC%96%B4%EB%96%BB%EA%B2%8C-%EC%84%B8%ED%8C%85%ED%95%B4%EC%95%BC-%ED%95%A0%EA%B9%8C%3F) | `개발 환경` `CI/CD` |
| [🎨 프론트 박사님의 개발일지](https://github.com/boostcampwm-2024/web35-watchducks/wiki/%ED%94%84%EB%A1%A0%ED%8A%B8-%EB%B0%95%EC%82%AC%EB%8B%98%EC%9D%98-%EA%B0%9C%EB%B0%9C%EC%9D%BC%EC%A7%80) | `React` `상태관리` `차트`|
| [🏬 데이터베이스와 가까워지기](https://github.com/boostcampwm-2024/web35-watchducks/wiki/%EB%8D%B0%EC%9D%B4%ED%84%B0%EB%B2%A0%EC%9D%B4%EC%8A%A4%EC%99%80-%EA%B0%80%EA%B9%8C%EC%9B%8C%EC%A7%80%EA%B8%B0) | `ClickHouse`  |
| [👜 네임서버, 어떻게 만들어야 할까?](https://github.com/boostcampwm-2024/web35-watchducks/wiki/%EB%84%A4%EC%9E%84%EC%84%9C%EB%B2%84,-%EC%96%B4%EB%96%BB%EA%B2%8C-%EB%A7%8C%EB%93%A4%EC%96%B4%EC%95%BC-%ED%95%A0%EA%B9%8C%3F) | `Authoritative Name Server` `헬스 체크`|
| [🪄 프록시 서버, 그거 어떻게 동작해야 하는데?](https://github.com/boostcampwm-2024/web35-watchducks/wiki/%ED%94%84%EB%A1%9D%EC%8B%9C-%EC%84%9C%EB%B2%84,-%EA%B7%B8%EA%B1%B0-%EC%96%B4%EB%96%BB%EA%B2%8C-%EB%8F%99%EC%9E%91%ED%95%B4%EC%95%BC-%ED%95%98%EB%8A%94%EB%8D%B0%3F) | `Fastify` `Bulk Insert` |
| [💣 부하테스트와 성능 개선에 도전!](https://github.com/boostcampwm-2024/web35-watchducks/wiki/%EB%B6%80%ED%95%98%ED%85%8C%EC%8A%A4%ED%8A%B8%EC%99%80-%EC%84%B1%EB%8A%A5-%EA%B0%9C%EC%84%A0%EC%97%90-%EB%8F%84%EC%A0%84!) | `부하테스트` `성능 개선` |
<br>

[📝 더 많은 개발 과정을 보고 싶다면...](https://github.com/boostcampwm-2024/web35-watchducks/wiki)

<br>

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

<br>

[🧑‍🧑‍🧒‍🧒 팀 와치덕스가 궁금하다면](https://github.com/boostcampwm-2024/web35-watchducks/wiki/%08About-Team-Watchducks)
