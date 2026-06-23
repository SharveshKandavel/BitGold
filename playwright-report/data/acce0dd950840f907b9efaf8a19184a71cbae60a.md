# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: a11y.spec.ts >> BitGold Accessibility Checks >> auth selection page should not have any automatically detectable accessibility issues
- Location: tests\a11y.spec.ts:13:3

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  -   1
+ Received  + 181

- Array []
+ Array [
+   Object {
+     "description": "Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds",
+     "help": "Elements must meet minimum color contrast ratio thresholds",
+     "helpUrl": "https://dequeuniversity.com/rules/axe/4.11/color-contrast?application=playwright",
+     "id": "color-contrast",
+     "impact": "serious",
+     "nodes": Array [
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#0d0d0d",
+               "contrastRatio": 4.02,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#6b7280",
+               "fontSize": "8.3pt (11px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.02 (foreground color: #6b7280, background color: #0d0d0d, font size: 8.3pt (11px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<button class=\"w-full text-left card-secondary hover:border-[#D4AF37]/40 hover:bg-white/[0.04] transition-all duration-300 group flex items-center justify-between\">",
+                 "target": Array [
+                   ".text-left.card-secondary.hover\\:border-\\[\\#D4AF37\\]\\/40:nth-child(1)",
+                 ],
+               },
+               Object {
+                 "html": "<div class=\"min-h-screen w-full flex items-center justify-center bg-[#050505] text-white relative overflow-hidden\">",
+                 "target": Array [
+                   ".min-h-screen",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.02 (foreground color: #6b7280, background color: #0d0d0d, font size: 8.3pt (11px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<p class=\"label-meta mt-1 text-gray-400\">One-click simulated access. Starts with $10,000 CAD.</p>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".text-left.card-secondary.hover\\:border-\\[\\#D4AF37\\]\\/40:nth-child(1) > .gap-5.items-center.flex > div:nth-child(2) > .label-meta.mt-1",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#0d0d0d",
+               "contrastRatio": 4.02,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#6b7280",
+               "fontSize": "8.3pt (11px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.02 (foreground color: #6b7280, background color: #0d0d0d, font size: 8.3pt (11px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<button class=\"w-full text-left card-secondary hover:border-[#D4AF37]/40 hover:bg-white/[0.04] transition-all duration-300 group flex items-center justify-between\">",
+                 "target": Array [
+                   ".text-left.card-secondary.hover\\:border-\\[\\#D4AF37\\]\\/40:nth-child(2)",
+                 ],
+               },
+               Object {
+                 "html": "<div class=\"min-h-screen w-full flex items-center justify-center bg-[#050505] text-white relative overflow-hidden\">",
+                 "target": Array [
+                   ".min-h-screen",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.02 (foreground color: #6b7280, background color: #0d0d0d, font size: 8.3pt (11px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<p class=\"label-meta mt-1 text-gray-400\">Access your existing gold portfolio and settings.</p>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".text-left.card-secondary.hover\\:border-\\[\\#D4AF37\\]\\/40:nth-child(2) > .gap-5.items-center.flex > div:nth-child(2) > .label-meta.mt-1",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#0f0f0f",
+               "contrastRatio": 3.96,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#6b7280",
+               "fontSize": "8.3pt (11px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.96 (foreground color: #6b7280, background color: #0f0f0f, font size: 8.3pt (11px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<button class=\"w-full text-left card-secondary hover:border-[#D4AF37]/40 hover:bg-white/[0.04] transition-all duration-300 group flex items-center justify-between\">",
+                 "target": Array [
+                   ".text-left.card-secondary.hover\\:border-\\[\\#D4AF37\\]\\/40:nth-child(3)",
+                 ],
+               },
+               Object {
+                 "html": "<div class=\"min-h-screen w-full flex items-center justify-center bg-[#050505] text-white relative overflow-hidden\">",
+                 "target": Array [
+                   ".min-h-screen",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.96 (foreground color: #6b7280, background color: #0f0f0f, font size: 8.3pt (11px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<p class=\"label-meta mt-1 text-gray-400\">Create a new cloud profile to save your progress.</p>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".text-left.card-secondary.hover\\:border-\\[\\#D4AF37\\]\\/40:nth-child(3) > .gap-5.items-center.flex > div:nth-child(2) > .label-meta.mt-1",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#050505",
+               "contrastRatio": 4.21,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#6b7280",
+               "fontSize": "7.5pt (10px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.21 (foreground color: #6b7280, background color: #050505, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"min-h-screen w-full flex items-center justify-center bg-[#050505] text-white relative overflow-hidden\">",
+                 "target": Array [
+                   ".min-h-screen",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.21 (foreground color: #6b7280, background color: #050505, font size: 7.5pt (10px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span>Back to disclaimer</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".label-overline > span",
+         ],
+       },
+     ],
+     "tags": Array [
+       "cat.color",
+       "wcag2aa",
+       "wcag143",
+       "TTv5",
+       "TT13.c",
+       "EN-301-549",
+       "EN-9.1.4.3",
+       "ACT",
+       "RGAAv4",
+       "RGAA-3.2.1",
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
      - generic [ref=e11]: B
      - heading "BitGold" [level=1] [ref=e12]
      - paragraph [ref=e13]: Securely invest your spare change into 99.9% physical gold. Please choose your access method below.
      - generic [ref=e14]:
        - button "Instant Demo Account One-click simulated access. Starts with $10,000 CAD." [ref=e15] [cursor=pointer]:
          - generic [ref=e16]:
            - img [ref=e18]
            - generic [ref=e22]:
              - heading "Instant Demo Account" [level=2] [ref=e23]
              - paragraph [ref=e24]: One-click simulated access. Starts with $10,000 CAD.
          - img [ref=e25]
        - button "Log In to Cloud Access your existing gold portfolio and settings." [ref=e27] [cursor=pointer]:
          - generic [ref=e28]:
            - img [ref=e30]
            - generic [ref=e33]:
              - heading "Log In to Cloud" [level=2] [ref=e34]
              - paragraph [ref=e35]: Access your existing gold portfolio and settings.
          - img [ref=e36]
        - button "Register Cloud Account Create a new cloud profile to save your progress." [ref=e38] [cursor=pointer]:
          - generic [ref=e39]:
            - img [ref=e41]
            - generic [ref=e46]:
              - heading "Register Cloud Account" [level=2] [ref=e47]
              - paragraph [ref=e48]: Create a new cloud profile to save your progress.
          - img [ref=e49]
      - button "Back to disclaimer" [ref=e51] [cursor=pointer]:
        - img [ref=e52]
        - generic [ref=e54]: Back to disclaimer
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
  10 |     expect(accessibilityScanResults.violations).toEqual([]);
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
> 24 |     expect(accessibilityScanResults.violations).toEqual([]);
     |                                                 ^ Error: expect(received).toEqual(expected) // deep equality
  25 |   });
  26 | });
  27 | 
```