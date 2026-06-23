# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: a11y.spec.ts >> BitGold Accessibility Checks >> intro page should not have any automatically detectable accessibility issues
- Location: tests\a11y.spec.ts:5:3

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  -   1
+ Received  + 105

- Array []
+ Array [
+   Object {
+     "description": "Ensure the document has a main landmark",
+     "help": "Document should have one main landmark",
+     "helpUrl": "https://dequeuniversity.com/rules/axe/4.11/landmark-one-main?application=playwright",
+     "id": "landmark-one-main",
+     "impact": "moderate",
+     "nodes": Array [
+       Object {
+         "all": Array [
+           Object {
+             "data": null,
+             "id": "page-has-main",
+             "impact": "moderate",
+             "message": "Document does not have a main landmark",
+             "relatedNodes": Array [],
+           },
+         ],
+         "any": Array [],
+         "failureSummary": "Fix all of the following:
+   Document does not have a main landmark",
+         "html": "<html lang=\"en\">",
+         "impact": "moderate",
+         "none": Array [],
+         "target": Array [
+           "html",
+         ],
+       },
+     ],
+     "tags": Array [
+       "cat.semantics",
+       "best-practice",
+     ],
+   },
+   Object {
+     "description": "Ensure that the page, or at least one of its frames contains a level-one heading",
+     "help": "Page should contain a level-one heading",
+     "helpUrl": "https://dequeuniversity.com/rules/axe/4.11/page-has-heading-one?application=playwright",
+     "id": "page-has-heading-one",
+     "impact": "moderate",
+     "nodes": Array [
+       Object {
+         "all": Array [
+           Object {
+             "data": null,
+             "id": "page-has-heading-one",
+             "impact": "moderate",
+             "message": "Page must have a level-one heading",
+             "relatedNodes": Array [],
+           },
+         ],
+         "any": Array [],
+         "failureSummary": "Fix all of the following:
+   Page must have a level-one heading",
+         "html": "<html lang=\"en\">",
+         "impact": "moderate",
+         "none": Array [],
+         "target": Array [
+           "html",
+         ],
+       },
+     ],
+     "tags": Array [
+       "cat.semantics",
+       "best-practice",
+     ],
+   },
+   Object {
+     "description": "Ensure all page content is contained by landmarks",
+     "help": "All page content should be contained by landmarks",
+     "helpUrl": "https://dequeuniversity.com/rules/axe/4.11/region?application=playwright",
+     "id": "region",
+     "impact": "moderate",
+     "nodes": Array [
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "isIframe": false,
+             },
+             "id": "region",
+             "impact": "moderate",
+             "message": "Some page content is not contained by landmarks",
+             "relatedNodes": Array [],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Some page content is not contained by landmarks",
+         "html": "<div id=\"root\"><div class=\"min-h-screen flex items-center justify-center bg-deepBlack text-bitgold-lightGold\">Loading authentication...</div></div>",
+         "impact": "moderate",
+         "none": Array [],
+         "target": Array [
+           "#root",
+         ],
+       },
+     ],
+     "tags": Array [
+       "cat.keyboard",
+       "best-practice",
+       "RGAAv4",
+       "RGAA-9.2.1",
+     ],
+   },
+ ]
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - region "Notifications alt+T"
  - main [ref=e4]:
    - generic [ref=e8]:
      - img [ref=e10]
      - heading "BitGold Vault" [level=1] [ref=e12]
      - paragraph [ref=e13]: Sandbox Environment
      - generic [ref=e14]:
        - generic [ref=e15]:
          - img [ref=e17]
          - generic [ref=e22]:
            - heading "Fintech Simulator" [level=3] [ref=e23]
            - paragraph [ref=e24]: This is a financial simulator. No real money, credit cards, or actual bank accounts are linked to this platform.
        - generic [ref=e25]:
          - img [ref=e27]
          - generic [ref=e31]:
            - heading "Simulated Capital" [level=3] [ref=e32]
            - paragraph [ref=e33]: Every user is allocated a sandbox starting balance of $10,000 CAD to experiment with gold investments.
      - button "Acknowledge & Proceed" [ref=e34] [cursor=pointer]:
        - generic [ref=e35]: Acknowledge & Proceed
        - img [ref=e36]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import AxeBuilder from '@axe-core/playwright';
  3  | 
  4  | test.describe('BitGold Accessibility Checks', () => {
  5  |   test('intro page should not have any automatically detectable accessibility issues', async ({ page }) => {
  6  |     await page.goto('http://localhost:5173/');
  7  |     
  8  |     // Check for a11y violations
  9  |     const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
> 10 |     expect(accessibilityScanResults.violations).toEqual([]);
     |                                                 ^ Error: expect(received).toEqual(expected) // deep equality
  11 |   });
  12 | 
  13 |   test('auth selection page should not have any automatically detectable accessibility issues', async ({ page }) => {
  14 |     await page.goto('http://localhost:5173/');
  15 |     
  16 |     // Go to Auth selection
  17 |     await page.getByRole('button', { name: /Acknowledge & Proceed/i }).click();
  18 |     
  19 |     // Ensure it loaded
  20 |     await expect(page.getByRole('button', { name: /Instant Demo Account/i })).toBeVisible();
  21 | 
  22 |     // Check for a11y violations
  23 |     const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  24 |     expect(accessibilityScanResults.violations).toEqual([]);
  25 |   });
  26 | });
  27 | 
```