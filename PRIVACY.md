# Privacy and Data Collection

This project collects a small set of information to power analytics and mapping features.

## Data Categories

### Focus Labels
Tags describing reading or activity focus are stored to highlight trends and surface relevant insights.
**Use:** These labels help the application customise charts and recommendations.
**Retention:** Entries older than the configured retention window are removed automatically.

### Location History
Latitude/longitude fixes are stored locally so the application can build visit summaries and route visualisations.
**Use:** Provides visit summaries and route visualisations.
**Retention:** Old fixes are purged automatically after the configured period. Location data never leaves the device unless exported manually.

### App Usage
Basic usage information such as chart selections or feature toggles is kept to remember preferences and improve usability.
**Use:** Remembers preferences and improves usability.
**Retention:** Preferences can be cleared at any time from the privacy dashboard.

## Retention Policy
All locally stored data is subject to a configurable retention period (30 days by default). Entries older than the selected window are purged automatically.

## Export & Deletion
The privacy dashboard provides buttons to export all stored data as a JSON file or delete it entirely. Clearing data also removes any associated history and retention timers.

