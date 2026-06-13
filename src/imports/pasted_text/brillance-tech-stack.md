You are building "Brillance" — a full-stack SaaS web application for Flutter developers
and product teams. The product converts design files (.fig / .html) into production-ready
Flutter widget code, and includes a built-in Design System Generator and a visual canvas
editor with 2D/3D drawing support.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TECH STACK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Frontend  : Next.js 14 (App Router) + TypeScript + Tailwind CSS
Canvas    : Fabric.js (2D drawing) + Three.js via three_js Dart pkg (3D shapes)
3D Flutter: three_js (pub.dev) — same engine, works on Flutter Web/Mobile via WebView
Backend   : FastAPI (Python) — handles file parsing, AI code generation, user auth
AI Engine : OpenAI GPT-4o / Claude 3.5 Sonnet — generates Flutter widget code
Database  : Supabase (auth + storage + postgres)
Auth      : Supabase Auth (email + Google OAuth)
Payments  : Stripe (Free / Pro $19 / Team $49)
Deploy    : Vercel (frontend) + Railway (FastAPI backend)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CORE MODULES — BUILD ALL OF THESE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

──────────────────────────────────────
MODULE 1: AUTH & ONBOARDING
──────────────────────────────────────
- Sign up / Login with email or Google (Supabase Auth)
- Onboarding wizard (3 steps):
    Step 1 → Choose role: Developer / Designer / Team Lead
    Step 2 → Choose primary use: Convert Files / Generate Design System / Draw Components
    Step 3 → Optionally import a first file to see value immediately
- Dashboard home after onboarding showing recent projects and quick actions

──────────────────────────────────────
MODULE 2: FILE IMPORT & PARSER
──────────────────────────────────────
Supported inputs:
  A) .fig file (Figma export)     → Parse via Figma REST API (token-based) or
                                    accept raw .fig ZIP extraction + JSON parse
  B) .html file                   → Parse DOM tree, detect reusable UI blocks:
                                    navbars, cards, buttons, forms, modals, sections
  C) .svg file                    → Parse as vector shapes → convert to Flutter CustomPaint

Parser pipeline (FastAPI backend):
  1. Receive file via multipart upload
  2. Extract components: name, type, bounding box, styles (color, font, radius, spacing)
  3. Serialize to internal ComponentTree JSON schema:
     {
       "id": "uuid",
       "name": "PrimaryButton",
       "type": "button | card | navbar | form | input | modal | section | custom",
       "children": [...],
       "styles": { "bg": "#7C6AF7", "radius": 8, "padding": [12,24], "font": {...} },
       "variants": ["default", "hover", "disabled"],
       "bounds": { "w": 200, "h": 48 }
     }
  4. Store ComponentTree in Supabase under the user's project

──────────────────────────────────────
MODULE 3: COMPONENT GALLERY
──────────────────────────────────────
- Grid view of all parsed components with:
    • Live visual preview (render via HTML snapshot or iframe)
    • Component name, type badge, variant count
    • Light / Dark mode toggle per component
    • RTL / LTR toggle (critical for Arabic apps)
    • Search bar + filter by type (button, card, form, etc.)
- Click any component → open Component Detail View:
    • Large preview panel (left)
    • Flutter code panel (right) — syntax highlighted, copy button
    • Tabs: Widget Code | Theme Tokens | Usage Example
    • "Edit in Canvas" button → opens Module 5

──────────────────────────────────────
MODULE 4: FLUTTER CODE GENERATOR (AI ENGINE)
──────────────────────────────────────
Input: ComponentTree JSON for one component
Output: Production-ready Flutter widget code

Rules the AI must follow:
  1. Generate StatelessWidget by default, StatefulWidget only if interaction exists
  2. Use ThemeData tokens: Theme.of(context).colorScheme.primary (not hardcoded colors)
  3. Respect spacing scale (4, 8, 12, 16, 20, 24, 32, 48px)
  4. Use const constructors wherever possible
  5. Support RTL with Directionality widget
  6. Generate responsive layout using LayoutBuilder / MediaQuery
  7. Add /// doc comments to every widget class
  8. Export as: single file widget | pub package snippet | full screen example

FastAPI endpoint:
  POST /generate/flutter
  Body: { component_tree: {...}, options: { rtl: bool, theme: "material3|cupertino" } }
  Response: { code: "...", tokens: {...}, imports: [...] }

──────────────────────────────────────
MODULE 5: VISUAL CANVAS EDITOR (2D)
──────────────────────────────────────
Built with Fabric.js on Next.js. Users can draw and design components from scratch.

Tools panel:
  • Select / Move / Resize
  • Rectangle, Circle, Rounded Rect, Line, Arrow
  • Text (with font size, weight, color)
  • Image upload (drag & drop)
  • Container (box with padding + child slot)
  • Component slot (drop a saved component inside another)

Properties panel (right sidebar):
  • Fill color (with opacity)
  • Border (color, width, radius)
  • Shadow (x, y, blur, spread)
  • Typography (font, size, weight, line-height, letter-spacing)
  • Spacing (padding, margin)
  • Flex layout toggle (row/column, gap, alignment)

Canvas features:
  • Grid snapping (8px grid)
  • Alignment guides (smart snap lines)
  • Layer panel (z-order, show/hide, lock)
  • Undo / Redo (Ctrl+Z / Ctrl+Y)
  • Export canvas selection as:
      → PNG / SVG
      → ComponentTree JSON (→ feeds Module 4)
      → Flutter code (direct)

──────────────────────────────────────
MODULE 6: 3D CANVAS (Three.js / three_js)
──────────────────────────────────────
When user switches to "3D Mode" on the canvas:

Web side (Three.js inside iframe/WebGL):
  • 3D primitives: Box, Sphere, Cylinder, Plane, Torus, custom GLB/GLTF import
  • Orbit controls (rotate, zoom, pan)
  • Lighting: Ambient + Directional + Point lights
  • Materials: MeshStandardMaterial with color, roughness, metalness
  • Shadows toggle
  • Grid helper overlay
  • Axes helper
  • Screenshot / export as PNG

Flutter side (three_js package — pub.dev):
  • The same scene definition (JSON) created on Web is sent to Flutter
  • Flutter renders it using three_js Dart package (WebGL via FlutterGL)
  • Works on: Flutter Web, Android, iOS, Desktop
  • Bridge: scene JSON → parsed by three_js Dart → identical render
  • Use case: 3D product mockups, app icons, UI illustrations inside Flutter apps

Integration point:
  • "View in Flutter" button on 3D canvas → generates Flutter widget with three_js
    that embeds the exact same 3D scene → copy-paste ready

──────────────────────────────────────
MODULE 7: DESIGN SYSTEM GENERATOR
──────────────────────────────────────
Inspired by: Figma plugins (Kigen, Figr Identity, Atomic by Subframe)
Build this as a dedicated flow inside Brillance.

Step 1 — Brand Input:
  • Enter brand name
  • Pick primary color (color picker or hex input)
  • Upload logo (optional)
  • Select style preset: Minimal | Corporate | SaaS/Dashboard | Mobile App | AI Tool

Step 2 — Auto-Generation:
  Generate the full design token set:
  ┌─────────────────────────────────────────┐
  │ Colors                                  │
  │  • Primary scale (50–900, like Tailwind)│
  │  • Secondary, Accent, Neutral scales    │
  │  • Semantic: success, error, warning,   │
  │    info (each with light/dark variant)  │
  │  • Surface, Background, On-* colors     │
  │                                         │
  │ Typography                              │
  │  • Display, Heading (H1-H6), Body,      │
  │    Label, Caption                       │
  │  • Font size scale (12/14/16/18/20/24/  │
  │    28/32/40/48/56/64px)                 │
  │  • Font weight: 400/500/600/700/800     │
  │  • Line height & letter spacing tokens  │
  │                                         │
  │ Spacing                                 │
  │  • Scale: 4/8/12/16/20/24/32/40/48/64px │
  │                                         │
  │ Border Radius                           │
  │  • none/sm/md/lg/xl/full                │
  │                                         │
  │ Elevation / Shadows                     │
  │  • 5 levels (xs → xl)                  │
  │                                         │
  │ Components (auto-styled)                │
  │  • Buttons (Primary/Secondary/Outline/  │
  │    Ghost/Destructive × Small/Med/Large  │
  │    × Enabled/Hover/Pressed/Disabled)    │
  │  • Input fields, Badges, Alerts, Cards, │
  │    Modals, Tooltips, NavBar, Tabs,      │
  │    Dropdowns, Toggles, Checkboxes,      │
  │    Radio buttons, Avatars               │
  └─────────────────────────────────────────┘

Step 3 — Preview:
  • Live preview canvas showing all tokens + components
  • Light / Dark mode toggle
  • RTL toggle
  • Edit any token inline

Step 4 — Export:
  A) Flutter ThemeData file (Dart)
      → ColorScheme, TextTheme, ButtonThemeData, InputDecorationTheme, etc.
  B) CSS Variables file
  C) JSON Tokens (Style Dictionary compatible)
  D) Figma Plugin Script (paste in Figma console → creates variables in Figma file)
  E) Tailwind config (tailwind.config.js with all tokens)

──────────────────────────────────────
MODULE 8: PROJECT MANAGEMENT
──────────────────────────────────────
- Projects dashboard: create, rename, delete, duplicate projects
- Each project contains:
    • Source files (uploaded .fig / .html)
    • Parsed component library
    • Generated design system (if created)
    • Canvas saves (2D + 3D scenes)
- Share project: generate public link → read-only gallery view
- Version history: auto-save every 5 min, restore previous versions

──────────────────────────────────────
MODULE 9: SETTINGS & BILLING
──────────────────────────────────────
- Account settings: name, email, avatar, password
- API Keys page: generate personal API key to use /generate/flutter endpoint externally
- Billing page (Stripe):
    • Show current plan (Free / Pro / Team)
    • Upgrade / Downgrade
    • Invoice history
- Team management (Team plan only):
    • Invite by email
    • Role: Admin / Editor / Viewer

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
APP ROUTES (Next.js App Router)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/                      → Landing Page (public)
/login                 → Auth page
/signup                → Auth page
/onboarding            → Onboarding wizard (protected)
/dashboard             → Projects home (protected)
/project/[id]          → Project workspace
/project/[id]/gallery  → Component gallery
/project/[id]/canvas   → 2D canvas editor
/project/[id]/canvas/3d→ 3D canvas editor
/design-system/new     → Design system generator flow
/design-system/[id]    → Design system viewer + editor
/settings              → Account + billing + API keys
/share/[token]         → Public read-only project view

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FASTAPI BACKEND ENDPOINTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
POST   /parse/figma          → Parse .fig file → ComponentTree
POST   /parse/html           → Parse .html file → ComponentTree
POST   /parse/svg            → Parse .svg → ComponentTree
POST   /generate/flutter     → ComponentTree → Flutter code (AI)
POST   /generate/design-system → Brand input → full token set
GET    /projects             → List user projects
POST   /projects             → Create project
DELETE /projects/{id}        → Delete project
GET    /components/{id}      → Get component details
POST   /export/theme-dart    → Design system → ThemeData .dart file
POST   /export/css-vars      → Design system → CSS variables
POST   /export/figma-script  → Design system → Figma console script

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
UI/UX DESIGN RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Dark theme first (bg: #0a0a0f, surface: #111118, accent: #7C6AF7)
- Font: Inter (web) — matches Flutter's default feel
- All panels resizable (drag handle between panels)
- Keyboard shortcuts:
    Ctrl+K   → Command palette (search components, actions)
    Ctrl+Z   → Undo  |  Ctrl+Y → Redo
    Ctrl+/   → Toggle code panel
    Ctrl+D   → Duplicate selected canvas element
    Ctrl+G   → Group selected elements
    Space+drag → Pan canvas
    Scroll   → Zoom canvas
- Responsive: works on desktop (1280px+) and tablet (768px+)
- RTL layout support: all text components flip correctly for Arabic

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THREE.JS ↔ FLUTTER BRIDGE (KEY DETAIL)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
The same 3D scene must render identically on Web (Three.js) and Flutter (three_js Dart).

Scene serialization format (JSON):
{
  "scene": {
    "background": "#1a1a2e",
    "objects": [
      {
        "id": "box1",
        "type": "BoxGeometry",
        "args": [1, 1, 1],
        "position": [0, 0, 0],
        "rotation": [0.3, 0.5, 0],
        "material": {
          "type": "MeshStandardMaterial",
          "color": "#7C6AF7",
          "roughness": 0.4,
          "metalness": 0.6
        }
      }
    ],
    "lights": [
      { "type": "AmbientLight", "color": "#ffffff", "intensity": 0.5 },
      { "type": "DirectionalLight", "color": "#ffffff", "intensity": 1,
        "position": [5, 10, 5] }
    ],
    "camera": { "fov": 75, "position": [0, 0, 5] }
  }
}

Web renderer  → Three.js parses this JSON and renders via WebGL
Flutter widget → three_js Dart package parses identical JSON via FlutterGL
Result        → Pixel-perfect consistent 3D across all platforms

Generated Flutter code example:
  BrillanceScene3D(
    sceneJson: sceneData,      // same JSON from web
    width: double.infinity,
    height: 300,
    allowOrbit: true,
  )

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BUILD PRIORITY ORDER (MVP → Full)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Phase 1 — Core MVP (Weeks 1–3):
  ✦ Auth + Dashboard + Project creation
  ✦ HTML Parser → ComponentTree
  ✦ Component Gallery (view + preview)
  ✦ Flutter Code Generator (AI via GPT-4o)

Phase 2 — Design Power (Weeks 4–6):
  ✦ Figma .fig Parser (Figma API)
  ✦ 2D Canvas Editor (Fabric.js)
  ✦ Design System Generator (tokens + export)
  ✦ Flutter ThemeData export

Phase 3 — 3D & Scale (Weeks 7–10):
  ✦ 3D Canvas (Three.js web)
  ✦ Flutter three_js bridge + BrillanceScene3D widget
  ✦ Team features + Stripe billing
  ✦ Public share link + version history

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NON-FUNCTIONAL REQUIREMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- File upload max: 50MB
- Code generation response time: < 3 seconds
- Component gallery load time: < 1 second (virtualized list)
- All API calls authenticated via Supabase JWT
- CORS restricted to app domain only
- Rate limiting: Free plan 10 AI requests/day, Pro 500/day
- All user files encrypted at rest (Supabase Storage)
- WCAG AA color contrast on all UI elements