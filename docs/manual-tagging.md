# Manual Sub-genre Tagging

1. Start the development server with `npm run server` and open the book network page.
2. Select a book node. A **Sub-genre** field appears below the tag and author filters.
3. Enter a sub-genre and click **Save**.
   - Empty values are rejected.
   - Saving the same sub-genre twice will show a validation error.
4. The server writes your changes to `src/data/kindle/subgenre-overrides.json`.
5. Commit the updated JSON file so others receive the new tags.

This workflow allows contributors to manually curate sub-genre labels that override the default automatic tags.
