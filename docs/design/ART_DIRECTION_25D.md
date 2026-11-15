# Space Papers — 2.5D art direction

## Approved direction · 14 November 2026

The team's Blender room is the visual source of truth. The player is seated inside a lunar office. The user chose two camera positions, **room and desk**, and **warm, friendly science fiction**. Existing gameplay, economy, NASA references and optional incident worksheets remain intact.

### Room camera

Show the supplied room composition: entrance left, wall equipment in the middle, recessed monitor right, physical desk in the foreground. The visitor stands within this space, behind the desk. Until the team supplies engineers, use a deliberately simple neutral mannequin. It must not look like finished character art.

The monitor contains operational information. Small physical labels identify controls. The main menu lives in this room, with a restrained title and direct game options. No scrolling page, marketing hero, navigation bar or grid of application cards.

### Desk camera

Approach the desktop to provide a large reading surface. Documents, book and ledger retain their existing readable size and independent placement. Camera motion applies to environment layers; it must not distort document hit testing. Never animate a reading sheet away from the pointer during a gesture.

Switch explicitly between views and enter desk view when opening a working document. Keep the user's arrangement, selected manual page and pinned state. Reduced motion switches views without decorative travel. Pause and tab hiding freeze active game time.

### Materials and lighting

Keep the team's teal industrial room. Add restrained warm ivory/amber reading light and neutral cream paper; avoid intense bloom over text. Tools need volume through shape, edge highlights, contact shadows and consistent light direction. Use small labels, not web-style status cards. Red/green marks distinguish decisions but never reveal whether a request is correct.

### Production format

- Keep `.blend` as editable source, with camera, lights, units and render settings saved.
- Export room, door and desktop using the same camera and canvas, with transparent foreground layers as PNG.
- Supply a combined reference render for verifying registration. Preserve original files and record derivatives.
- Runtime may use compressed WebP when transparency and edge quality remain correct; PNG remains the interchange format.
- Render both camera positions if the desk close-up needs geometry that a layered camera cannot reproduce accurately.
- Engineer deliverables: transparent full upper-body render with consistent floor/contact line, framing and lighting. Neutral pose first; expressions later.
- Never bake changing text, quantities, essential labels or interactive controls into a render.

### Acceptance checks

1. Room scene visibly matches the supplied reference and assets load locally.
2. Desk view supports manual + one sheet + inventory at 1280 × 720 useful viewport.
3. Free drag, overlap, retrieval, stamps and keyboard/click alternatives remain functional.
4. Switching camera does not spend resources, submit a decision or reset documents.
5. Overlays, report and emergency remain readable with no essential controls clipped.
6. Placeholder characters are explicitly temporary; no claim of finished team art.

This is a 2.5D presentation built from the team's 3D renders, not a claim that the browser runs the complete Blender scene in real time. A Steam release/package is outside this visual pass.
