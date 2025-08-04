# Kindle API

All endpoints are prefixed with `/api/kindle`.

## Authentication

No authentication or special headers are required. Requests and responses use JSON; CORS is enabled on the server.

## Endpoints

### `GET /api/kindle/events`
Returns Kindle notification events.

**Response**

An array of objects with the following fields:

- `Timestamp` – ISO 8601 timestamp of the event
- `Activity` – event type
- `CampaignName` – campaign identifier, if any
- `DisplayStatus` – display status such as `displayed`

**Sample**

```json
[
  {
    "Timestamp": "2023-11-27T05:47:19Z",
    "Activity": "ACTION_TRAY_CLEARED",
    "CampaignName": "",
    "DisplayStatus": ""
  },
  {
    "Timestamp": "2024-12-20T17:18:21Z",
    "Activity": "RECEIVED",
    "CampaignName": "kindle_recommends",
    "DisplayStatus": "displayed"
  }
]
```

### `GET /api/kindle/points`
Returns the current Kindle Book Points balance.

**Response**

An object with the following fields:

- `Available Balance (Points)` – available points
- `Marketplace` – marketplace domain
- `Pending Balance (Points)` – pending points

**Sample**

```json
{
  "Available Balance (Points)": "0",
  "Marketplace": "www.amazon.com",
  "Pending Balance (Points)": "0"
}
```

### `GET /api/kindle/achievements`
Lists Kindle Book Rewards achievements.

**Response**

An array of objects with the following fields:

- `AchievementGroupName` – name of the achievement group
- `AchievementName` – achievement title
- `EarnDate` – ISO 8601 earn timestamp
- `Marketplace` – marketplace domain
- `Quantity` – quantity earned

**Sample**

```json
[
  {
    "AchievementGroupName": "2024 Year End Kindle Challenge",
    "AchievementName": "GoldReader",
    "EarnDate": "2024-12-29T06:08:28Z",
    "Marketplace": "www.amazon.com",
    "Quantity": "1"
  },
  {
    "AchievementGroupName": "2024 Year End Kindle Challenge",
    "AchievementName": "BiblioBlizzard",
    "EarnDate": "2024-12-23T06:46:54Z",
    "Marketplace": "www.amazon.com",
    "Quantity": "1"
  }
]
```
