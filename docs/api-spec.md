# API Spec - Travel Booking Site （API仕様書）

## Overview 前提ルールまとめ
- Base URL : `/api`
- Auth : JWT (Bearer)
  - Header : `Authorization: Bearer <token>`
- Date format : `YYYY-MM-DD`

## Search Rule　検索ルール
<!-- 完全一致が必要 -->
- `prefecture` filter is **exact match** (e.g `大阪府`)

---
<!-- 明日、続きはendpointから -->