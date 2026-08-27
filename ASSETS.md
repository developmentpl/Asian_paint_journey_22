# Visual Asset Reference

The motorcycle + rider is now a **real photo asset** (transparent PNG or
WebP), not hand-drawn artwork — see "Motorcycle + rider" below for the
exact files this needs and where they go. Every road-scene prop (trees,
buildings, streetlights, signs, barriers, vehicles, pedestrians,
potholes) is still hand-illustrated as scalable vector artwork (inline
SVG), unchanged from before; that part of the app wasn't touched.

## How to read this document

For the road-scene props: **file path**, **what it draws**, its
**native size** (the SVG `viewBox`, i.e. the coordinate space its shapes
are drawn in), and the **recommended pixel dimensions** to use if it's
ever replaced with a raster asset (PNG/WebP) instead of vector art,
sized generously for crisp rendering on high-DPI (retina) screens.

---

## Motorcycle + rider (the main gameplay character)

**This is a real photo asset now, not drawn artwork.** Per an explicit
product decision, `frontend/src/components/MotorcycleRider.jsx` no
longer draws a bike or rider — it renders an `<img>` pointing at a real
transparent PNG/WebP photo and animates that photo with CSS/React
transforms. The old `frontend/src/components/sprites/` folder (Wheel,
RiderHelmet, RiderRaincoat) has been deleted; nothing generates a
fallback illustration if the photo is missing.

### Exact file required

Place this file in `frontend/public/bike-assets/` (the `README.txt`
there repeats this spec):

| File | Shows | Used when |
|---|---|---|
| `bike-rider.png` (or `.webp`) | Complete motorcycle + seated rider on a transparent background | All 10 scenarios |

Both images must share the same pose, crop, scale, and background
transparency so the crossfade between them doesn't jump or resize. The
component tries `.webp` first, then falls back to `.png`; if neither
file is present it renders **nothing at all** in that spot — no
placeholder box, no drawn bike — and logs a one-line console warning
naming the exact missing file, so a missing asset stays invisible in
the actual game (per an explicit product decision) while still being
obvious to whoever's developing it.

### Photo spec

- **Format:** PNG or WebP with a genuinely transparent background (no
  white/checkerboard matte).
- **Framing:** side-view (a slight 3/4 side angle is fine) of a
  complete motorcycle with a seated rider — hands on the handlebars,
  a natural riding posture, feet on the pegs. **The bike should face
  right** (front wheel on the right side of the frame) — the overlay
  effects (headlight glow, rain spray, tail-light) are anchored
  assuming that orientation.
- **Crop:** leave a little breathing room above the rider's head and
  below the tyres — the component crops to fit via `object-fit:
  contain`, anchored to the bottom, so the wheels should sit near the
  bottom edge of the image.
- **Size:** at least 1600 × 1000 px, for crisp rendering on retina
  screens. The on-screen box is responsive (`width: clamp(320px, 30vw,
  520px)`, roughly a 16:10 box) rather than a fixed pixel size, and the
  image renders with `object-fit: contain`, so it's never stretched —
  an image with a somewhat different aspect ratio just letterboxes
  cleanly inside the box instead of distorting.
- **Consistency between the two files:** same camera angle, same crop
  frame, same rider proportions — imagine the geared photo is the
  plain photo with a helmet and raincoat added, not a differently
  posed or differently cropped shot.

### If you only have a licensed Shutterstock asset in mind, not a file yet

Per your instructions, nothing gets downloaded or used from Shutterstock
without you providing the licensed file or explicitly confirming the
exact asset (a link/ID plus an explicit "yes, use that one"). Once you
share either two matching photos (plain + geared) or point to one
approved asset, they just need to be saved as the two filenames above.

### Calibrating the overlay effects to your photo

The rain spray, tyre-check pulses, headlight glow, and tail/brake-light
glow are positioned by 4 CSS custom properties on `.rider-wrapper` in
`frontend/src/index.css`:

```css
--rider-front-x: 82%;   /* front wheel's x position, as % across the box */
--rider-rear-x: 15%;    /* rear wheel's x position */
--rider-headlight-x: 80%;
--rider-taillight-x: 16%;
```

These are tuned for a roughly centred bike with typical proportions.
Once the real photo is in place, if the wheels/headlight sit at
noticeably different points, nudge these four percentages to match —
no other code needs to change.

### Animation contract (unchanged filenames, new target elements)

The bike/rider photo is animated the same way the old illustration
was — via CSS classes on wrapper `<div>`s instead of SVG groups:

| Motion | How it's triggered | CSS class(es) |
|---|---|---|
| Continuous suspension bounce + gentle rock | Always running | `.rider-photo-suspension` (`photoSuspensionBob` keyframes) |
| Acceleration (surge after braking ends) | Automatic, right after a braking action ends | `.rider-accelerate` (`accelerateSurge` keyframes) |
| Deceleration / braking | `reduceSpeed`, `brakeSmooth` actions | `.rider-slow`, `.rider-braking` (`brakeDive` keyframes) |
| Lane change / swerve | `avoidHazard` action | `.rider-swerve` (`riderSwerve` keyframes) |
| Turning / leaning | `slowTurn` action | `.rider-lean` (`riderLean` keyframes) |
| Skid | `lowVisSkid`, `wobble`, `skid`, `skidTurn` actions | `.rider-skid` (`riderSkid` keyframes) |
| Jerk / near-miss | `closeCall`, `nearMissPedestrian`, `shakyArrival` actions | `.rider-jerk` (`riderJerk` keyframes) |
| Pothole bump | `potholeHit` action | `.rider-bump` (`riderBump` keyframes) |
| Rain splash | Puddle/pothole scenarios, or a bigger splash on `splashHit` | `.water-splash`, `.water-splash-big` |
| Continuous rain spray off both tyres | Always running | `.wheel-spray-front`, `.wheel-spray-rear` |
| Headlight glow | `headlightOn` action, or low-visibility scenarios | `.headlight-beam`, `.headlight-beam-bright` |
| Brake/tail-light glow | Any braking/stopping action | `.rear-light-glow-on` |

Because a single photo can't reveal a helmet and a raincoat
independently the way two separate SVG layers could, both the
`wearHelmet` and `wearRaincoat` scenario steps now trigger the same
crossfade to the geared photo — gear appears as one moment instead of
two. Everything else above behaves the same as before.

## Road scene props

| Asset | File | Draws | Native size (viewBox) | Recommended raster size |
|---|---|---|---|---|
| Streetlight | `frontend/src/components/StreetLight.jsx` | Pole, curved arm, and glowing lamp head with a ground light-pool. | 30 × 110 | 150 × 550 px PNG/WebP |
| Road sign | `frontend/src/components/RoadSign.jsx` | Yellow warning-triangle sign (slippery-road / general-caution variants) on a post. | ~40 × 60 | 200 × 300 px PNG/WebP |
| Ambient traffic car | `frontend/src/components/AmbientTraffic.jsx` | Small background car silhouette used for passing traffic. | ~60 × 30 | 300 × 150 px PNG/WebP |
| Foreground traffic vehicle | `frontend/src/components/TrafficVehicle.jsx` | Larger, detailed car/vehicle used as a scenario hazard (e.g. following-distance, close-call scenarios). | see file | 600 × 400 px PNG/WebP |
| Pedestrian | `frontend/src/components/Pedestrian.jsx` | Pedestrian figure for the crossing scenario. | see file | 200 × 400 px PNG/WebP |
| Pothole | `frontend/src/components/Pothole.jsx` | Road pothole with water pooling. | see file | 300 × 150 px PNG/WebP |
| Water puddle | `frontend/src/components/WaterPuddle.jsx` | Standing water / waterlogging overlay. | see file | 400 × 150 px PNG/WebP |
| Traffic signal | `frontend/src/components/TrafficSignal.jsx` | Traffic light pole + signal head. | see file | 150 × 400 px PNG/WebP |
| Trees / buildings / barriers | `frontend/src/components/RoadEnvironment.jsx` | Background scenery layers (looping, evenly spaced). Currently inline within the environment component rather than split into separate files, since they're simple repeating silhouettes rather than a single detailed illustration. | see file | 400 × 600 px (tree), 500 × 800 px (building), 200 × 60 px (barrier segment) |

## Per-scenario camera views

Each of the 10 scenarios in `frontend/src/data/roadSceneConfig.js` has a
`view` field (`side`, `wide`, `hazard`, `cinematic`, or `top`) that picks
a distinct camera treatment, applied in `RoadEnvironment.jsx` as a CSS
class on a `.scene-camera` wrapper around the whole scene, with the
actual transforms defined in `frontend/src/index.css` (search for
`.scene-camera`). This is purely a composited transform on top of the
existing scene — no per-layer positioning/animation logic was touched:

| View | Used for | Effect |
|---|---|---|
| `side` | Default riding/preparation scenarios | No transform — the clear, standard side-on shot. |
| `wide` | Traffic / following-distance scenarios | Zooms out (`scale(0.8)`) so the rider and the vehicle ahead are both comfortably in frame. |
| `hazard` | Puddle / pothole scenarios | Zooms in (`scale(1.22)`) and pushes down slightly so the road hazard right in front of the rider reads clearly. |
| `cinematic` | Intro and arrival/closing beats | Slight zoom, a desaturated/darker grade, plus soft letterbox bars and a vignette (defined via `.road-scene-view-cinematic`) for a more graded, cinematic framing. |
| `top` | Turn scenarios | A tilted, semi top-down perspective (`rotateX(20deg)` combined with a scale-up) so the turn geometry is easier to read than a flat side view. |

To change which view a scenario uses, edit that scenario's `view` value
in `roadSceneConfig.js`. To change how a view actually looks, edit its
`.scene-camera-<name>` rule in `index.css` — no component logic needs to
change either way.

## Why the road-scene props are still vector, and the rider isn't

Photoreal photography can't be generated directly in this environment,
and per an explicit product decision the bike/rider must be a real
licensed photo, not another drawn illustration — so `MotorcycleRider.jsx`
now waits for that file instead of drawing a placeholder character (see
above). The surrounding road-scene props (trees, buildings, vehicles,
signs, etc.) don't carry that requirement, so they're left as they were:
hand-tuned vector illustration, each one a small, independently
swappable component if you ever want to replace those too.
