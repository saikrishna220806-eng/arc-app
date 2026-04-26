# Design System Strategy: The Ethereal Intelligence

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Ethereal Intelligence."** 

We are moving away from the "SaaS-dashboard" aesthetic and toward a high-end editorial experience that feels like light trapped in obsidian. This system is designed to evoke absolute precision and futuristic trust. By utilizing intentional asymmetry, we break the rigid 12-column grid to create a sense of organic movement. Elements should feel like they are floating in a deep, pressurized void, using luminescence and glass-refraction rather than physical borders to define space.

## 2. Colors
Our palette is rooted in the deep space of the `background` (#0e1320), punctuated by high-energy pulses of light.

*   **Primary & Secondary Roles:** `primary` (#adc6ff) and `secondary` (#a4c9ff) act as our "active light" sources. Use these for interactive states and focus indicators.
*   **The "No-Line" Rule:** We strictly prohibit the use of 1px solid borders to section off content. Boundaries must be defined through background color shifts. For example, a `surface_container_low` section sitting on a `surface` background provides all the separation needed. If the eye cannot distinguish the shift, increase the tonal gap between containers rather than adding a line.
*   **Surface Hierarchy & Nesting:** Depth is achieved by "stacking" surface tiers.
    *   `surface_container_lowest`: The deepest void, used for the main background.
    *   `surface_container_low`: Used for large secondary panels.
    *   `surface_container_high`: Used for interactive cards or active chat bubbles.
*   **The "Glass & Gradient" Rule:** To achieve a bespoke feel, use the `surface_tint` at low opacities (5–12%) with a `backdrop-blur` of 20px–40px. 
*   **Signature Textures:** Main CTAs should never be flat. Use a linear gradient transitioning from `primary` (#adc6ff) to `primary_container` (#4d8eff) at a 135-degree angle to provide a sense of "liquid light."

## 3. Typography
The system uses a high-contrast pairing to balance technical precision with human-centric legibility.

*   **Display & Headlines (Space Grotesk):** This is our "Editorial Voice." Space Grotesk’s geometric quirks provide a futuristic, bespoke character. Use `display-lg` for impactful data points (like the Trust Score value) and `headline-md` for section titles.
*   **Body & Labels (Inter):** Inter provides the "Functional Voice." It is highly legible at small sizes, ensuring that complex AI-generated text is easy to digest.
*   **Hierarchy as Identity:** Use extreme scale differences. A `display-lg` headline paired with a `label-md` secondary text creates an authoritative, modern layout that feels curated rather than templated.

## 4. Elevation & Depth
In "The Ethereal Intelligence," depth is a product of light and layering, not shadows and lines.

*   **The Layering Principle:** Stacking determines importance. A floating chat input should be `surface_container_highest` set against a `surface_container_low` background to create a natural, soft lift.
*   **Ambient Shadows:** Traditional drop shadows are forbidden. When a "floating" effect is required, use extra-diffused shadows with a blur value of 40px+ and an opacity of 6% using the `on_surface` color. This mimics natural ambient light occlusion rather than a "pasted on" effect.
*   **The "Ghost Border" Fallback:** If a container requires further definition (e.g., for accessibility), use a "Ghost Border." This is a 1px stroke using `outline_variant` at 15% opacity. It should feel like a faint reflection on the edge of a glass pane.
*   **Glassmorphism:** Apply to any element that sits "above" the main content flow, such as tooltips, dropdowns, or the Trust Meter card. Use `surface_bright` at 10% opacity with a heavy background blur.

## 5. Components

### The Trust Meter (Core Element)
*   **Visuals:** A progress ring using a gradient from `tertiary` (#4edea3) to `primary` (#adc6ff). 
*   **Backdrop:** Place the ring on a `surface_container_high` card with a glass effect.
*   **Typography:** The score itself should be `display-lg` in `on_surface`.

### Buttons
*   **Primary:** A "Liquid Light" gradient from `primary` to `primary_container`. No border. `xl` (1.5rem) roundedness for a pill shape.
*   **Secondary:** Ghost style. No background fill, only a 1px "Ghost Border" (`outline_variant` at 20%) and `on_surface` text.
*   **Tertiary:** Text-only in `primary` with a 0.5rem padding.

### Input Fields
*   **Base:** `surface_container_lowest` with a subtle `outline_variant` (10% opacity) border.
*   **Focus State:** A 2px outer glow (box-shadow) using the `primary` color at 30% opacity. This creates a "neon focus" effect.

### Chips
*   **Design:** `surface_container_highest` background with `on_surface_variant` text. Use `full` roundedness.
*   **Selection:** On selection, transition the background to `secondary_container` and text to `on_secondary_container`.

### Lists & Cards
*   **Constraint:** Forbid divider lines. Use `spacing.xl` (vertical white space) to separate list items. 
*   **Interactions:** On hover, a card should shift from `surface_container_low` to `surface_container_high`.

## 6. Do's and Don'ts

### Do
*   **Embrace Negative Space:** Allow elements to breathe. Use the `xl` spacing scale between major sections.
*   **Use Intentional Asymmetry:** Align the Trust Meter to the right while keeping the chat stream focused on the left to create a dynamic, editorial feel.
*   **Layer with Purpose:** Always ensure an inner container is a higher "surface" tier than its parent.

### Don't
*   **Don't use pure black (#000):** It kills the depth. Always use the specified `surface` and `background` tokens.
*   **Don't use 100% opaque borders:** These create "visual noise" and break the glassmorphism illusion.
*   **Don't mix font families:** Stick strictly to Space Grotesk for headers and Inter for data/body. Mixing these incorrectly will degrade the premium feel.