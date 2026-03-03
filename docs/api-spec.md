# API Spec - Travel Booking Site （API仕様書）

## Overview 前提ルールまとめ
- Base URL : `/api`
- Auth : JWT (Bearer)
  - Header : `Authorization: Bearer <token>`
- Date format : `YYYY-MM-DD`

## Search Rule　検索ルール
<!-- 完全一致が必要 -->
- `prefecture` filter is **exact match** (e.g `大阪府`)

## Endpoints

### Public 認証不要
- `GET /hotels?prefecture=大阪府`
  - Description: List hotels (prefecture exact match)　ホテル検索（都道府県完全一致）
  -　Auth: Not required

- `GET /hotels/:hotelId`
  - Description: Get hotel detail  ホテル情報取得（ID検索）
  - Auth: Not requred

- `GET /hotels/:hotelId/rooms`
  - Description: Get rooms for a specific hotel 特定のホテルの部屋情報取得
  - Auth: Not requred