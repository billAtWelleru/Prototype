# prototype
Prototype of the WellerU app

This is the mobile-first prototype updated to show **accolade banners + confetti** when a milestone is completed (M1–M5). Runs locally as a front‑end only demo.

## Milestones that trigger celebration
- **M1**: After MFA verification (account created)
- **M2**: Confirm PCP
- **M3**: Submit HRA
- **M4**: Save appointment
- **M5**: Mark AWV completed

Each trigger displays a banner (🏆 title, reward amount, Continue button) and a brief confetti burst. Celebrations are shown **once per milestone** (prototype guard) and then remembered in `localStorage`.

## Notes
- Colors follow Serene Wellness palette with Bright Path accent (Coral) for visual pop.
- Motion respects **prefers-reduced-motion** (confetti auto-disabled).
- This is a UI demo; no data leaves your device.