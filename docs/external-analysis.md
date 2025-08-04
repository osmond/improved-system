# External Analysis

Advanced users can pull good-day running sessions for offline study using the `getGoodDaySessions` helper.

```ts
import { getGoodDaySessions } from "@/lib/api";

const sessions = await getGoodDaySessions({ tags: ["race"] });
```

The function returns sessions where actual pace beat the expected baseline and excludes any marked false positives. Optional `tags`
restrict results to sessions containing all provided labels.

Returned fields:
- `id` – unique session identifier.
- `start` – ISO timestamp when the session began.
- `pace` – recorded pace in minutes per mile.
- `paceDelta` – difference between expected and actual pace.
- `tags` – user-supplied labels from the session store.
- `confidence` – 0–1 score reflecting data completeness and weather accuracy.
