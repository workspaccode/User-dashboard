import os
import re
import json
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from bs4 import BeautifulSoup
import uvicorn
import requests
from db import DatabaseManager

app = FastAPI(title="Brillance API", version="1.0.0")
db = DatabaseManager()


# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ComponentTree Schema
class Bounds(BaseModel):
    w: Optional[float] = 120.0
    h: Optional[float] = 44.0

class Styles(BaseModel):
    bg: Optional[str] = "#7C6AF7"
    radius: Optional[int] = 8
    padding: Optional[List[int]] = [12, 24]
    color: Optional[str] = "#ffffff"
    fontSize: Optional[int] = 14

class ComponentNode(BaseModel):
    id: str
    name: str
    type: str  # button | card | navbar | form | input | modal | section | custom
    children: Optional[List[Any]] = []
    styles: Optional[Styles] = Styles()
    variants: Optional[List[str]] = ["default"]
    bounds: Optional[Bounds] = Bounds()
    content: Optional[str] = ""

class GenerateFlutterRequest(BaseModel):
    component_tree: Dict[str, Any]
    options: Optional[Dict[str, Any]] = {"rtl": False, "theme": "material3"}

class DesignSystemRequest(BaseModel):
    brand_name: str
    primary_color: str
    logo_url: Optional[str] = None
    style_preset: str  # Minimal | Corporate | SaaS/Dashboard | Mobile App | AI Tool

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = ""
    color: Optional[str] = "#7C6AF7"
    user_id: Optional[str] = None


# Helper to extract style attributes from raw inline style strings
def parse_inline_styles(style_str: Optional[str]) -> Dict[str, str]:
    if not style_str:
        return {}
    styles = {}
    for pair in style_str.split(';'):
        if ':' in pair:
            key, val = pair.split(':', 1)
            styles[key.strip().lower()] = val.strip()
    return styles

# Shared helper to extract components from HTML
def extract_components_from_html(html_content: str) -> List[ComponentNode]:
    soup = BeautifulSoup(html_content, "html.parser")
    components = []
    
    # 1. Search for Navbars
    navs = soup.find_all(["nav", "header"])
    for i, nav in enumerate(navs):
        if not nav or nav.parent is None:
            continue
        styles = parse_inline_styles(nav.get("style"))
        bg = styles.get("background-color") or styles.get("background") or "#0e0e16"
        components.append(
            ComponentNode(
                id=f"nav-{i}",
                name=nav.get("id") or f"NavBar_{i+1}",
                type="navbar",
                bounds=Bounds(w=320.0, h=56.0),
                styles=Styles(bg=bg, radius=0, padding=[12, 16]),
                content=nav.get_text(strip=True)[:30] or "Brand",
                variants=["default", "sticky"]
            )
        )
        nav.decompose()

    # 2. Search for Buttons
    buttons = soup.find_all(["button", "input"])
    for i, btn in enumerate(buttons):
        if not btn or btn.parent is None:
            continue
        if btn.name == "input" and btn.get("type") not in ["button", "submit", "reset"]:
            continue
        styles = parse_inline_styles(btn.get("style"))
        bg = styles.get("background-color") or styles.get("background") or "#7C6AF7"
        radius = int(re.search(r'\d+', styles.get("border-radius", "8px")).group()) if re.search(r'\d+', styles.get("border-radius", "")) else 8
        color = styles.get("color") or "#ffffff"
        text = btn.get("value") or btn.get_text(strip=True) or "Button"
        components.append(
            ComponentNode(
                id=f"btn-{i}",
                name=btn.get("id") or f"PrimaryButton_{i+1}",
                type="button",
                bounds=Bounds(w=180.0, h=44.0),
                styles=Styles(bg=bg, radius=radius, padding=[10, 20], color=color),
                content=text[:25],
                variants=["default", "hover", "disabled"]
            )
        )
        btn.decompose()

    # 3. Search for Inputs
    inputs = soup.find_all("input")
    for i, inp in enumerate(inputs):
        if not inp or inp.parent is None:
            continue
        styles = parse_inline_styles(inp.get("style"))
        bg = styles.get("background-color") or styles.get("background") or "#1a1a28"
        radius = int(re.search(r'\d+', styles.get("border-radius", "6px")).group()) if re.search(r'\d+', styles.get("border-radius", "")) else 6
        placeholder = inp.get("placeholder") or "Enter text..."
        components.append(
            ComponentNode(
                id=f"input-{i}",
                name=inp.get("id") or f"InputField_{i+1}",
                type="input",
                bounds=Bounds(w=240.0, h=48.0),
                styles=Styles(bg=bg, radius=radius, padding=[12, 14], color="#e8e8f0"),
                content=placeholder[:30],
                variants=["default", "focused", "error"]
            )
        )
        inp.decompose()

    # 4. Search for Cards/Containers
    cards = soup.find_all(class_=re.compile(r"card|container|box|item|wrapper", re.I))
    for i, card in enumerate(cards):
        if not card or card.parent is None:
            continue
        styles = parse_inline_styles(card.get("style"))
        bg = styles.get("background-color") or styles.get("background") or "#16161f"
        radius = int(re.search(r'\d+', styles.get("border-radius", "12px")).group()) if re.search(r'\d+', styles.get("border-radius", "")) else 12
        components.append(
            ComponentNode(
                id=f"card-{i}",
                name=card.get("id") or f"CardComponent_{i+1}",
                type="card",
                bounds=Bounds(w=280.0, h=180.0),
                styles=Styles(bg=bg, radius=radius, padding=[16, 16]),
                content=card.get_text(strip=True)[:40] or "Card content description",
                variants=["default", "elevated", "outlined"]
            )
        )
        card.decompose()

    # Fallback to basic structural divs
    divs = soup.find_all("div")
    if not components and divs:
        for i, div in enumerate(divs[:5]):
            text = div.get_text(strip=True)
            if len(text) > 5:
                components.append(
                    ComponentNode(
                        id=f"custom-{i}",
                        name=f"SectionCard_{i+1}",
                        type="custom",
                        bounds=Bounds(w=300.0, h=120.0),
                        styles=Styles(bg="#111118", radius=10, padding=[14, 14]),
                        content=text[:50],
                        variants=["default"]
                    )
                )

    # Final fallback if HTML is entirely empty/generic
    if not components:
        components = [
            ComponentNode(
                id="btn-fallback",
                name="PrimaryButton",
                type="button",
                bounds=Bounds(w=200.0, h=48.0),
                styles=Styles(bg="#7C6AF7", radius=8, padding=[12, 24], color="#ffffff"),
                content="Get Started",
                variants=["default", "hover", "disabled"]
            ),
            ComponentNode(
                id="card-fallback",
                name="ProductCard",
                type="card",
                bounds=Bounds(w=260.0, h=160.0),
                styles=Styles(bg="#16161f", radius=12, padding=[16, 16], color="#e8e8f0"),
                content="Premium Product details here.",
                variants=["default", "hover"]
            )
        ]

    return components

# Parse HTML and extract ComponentTree (Stateless API)
@app.post("/parse/html")
async def parse_html(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        html_content = contents.decode("utf-8")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read file: {str(e)}")

    components = extract_components_from_html(html_content)
    return [c.model_dump() for c in components]

# --- Database Persistence Routes ---

@app.get("/api/projects")
async def get_projects():
    return db.get_projects()

@app.post("/api/projects")
async def create_project(project: ProjectCreate):
    try:
        return db.create_project(
            name=project.name,
            description=project.description,
            color=project.color,
            user_id=project.user_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/projects/{project_id}")
async def get_project(project_id: str):
    p = db.get_project(project_id)
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")
    return p

@app.delete("/api/projects/{project_id}")
async def delete_project(project_id: str):
    success = db.delete_project(project_id)
    if not success:
        raise HTTPException(status_code=404, detail="Project not found or failed to delete")
    return {"success": True}

@app.get("/api/projects/{project_id}/components")
async def get_project_components(project_id: str):
    return db.get_project_components(project_id)

@app.post("/api/projects/{project_id}/components")
async def save_project_components(project_id: str, components: List[Dict[str, Any]]):
    try:
        db.create_components(project_id, components)
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/projects/import-html")
async def import_html(
    file: UploadFile = File(...),
    name: Optional[str] = Form(None),
    description: Optional[str] = Form(""),
    color: Optional[str] = Form("#7C6AF7"),
    user_id: Optional[str] = Form(None)
):
    try:
        contents = await file.read()
        html_content = contents.decode("utf-8")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read file: {str(e)}")

    components = extract_components_from_html(html_content)
    
    # Resolve project name (cleanup filename)
    p_name = name or os.path.splitext(file.filename)[0]
    p_name = p_name.replace("-", " ").replace("_", " ").title()
    
    try:
        # Create Project
        proj = db.create_project(
            name=p_name,
            description=description or f"Imported components from {file.filename}",
            color=color,
            user_id=user_id
        )
        
        # Save Components to project
        comp_list = [c.model_dump() for c in components]
        db.create_components(proj["id"], comp_list)
        
        proj["components"] = len(comp_list)
        return proj
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



# Generate Flutter widget code from ComponentTree
@app.post("/generate/flutter")
async def generate_flutter(request: GenerateFlutterRequest):
    tree = request.component_tree
    options = request.options or {}
    rtl = options.get("rtl", False)
    theme = options.get("theme", "material3")
    
    # Try calling OpenAI / Gemini if environment API keys are available
    openai_key = os.environ.get("OPENAI_API_KEY")
    if openai_key:
        try:
            headers = {
                "Authorization": f"Bearer {openai_key}",
                "Content-Type": "application/json"
            }
            prompt = f"""
            You are an expert Flutter Developer. Generate a highly polished, responsive Flutter widget class using Material 3 guidelines.
            
            Component Name: {tree.get('name', 'CustomWidget')}
            Component Type: {tree.get('type', 'custom')}
            Content: {tree.get('content', '')}
            Styles: {json.dumps(tree.get('styles', {}))}
            Bounds: {json.dumps(tree.get('bounds', {}))}
            RTL Support: {rtl}
            Theme Choice: {theme}
            
            Follow these rules:
            1. Generate StatelessWidget by default, StatefulWidget only if interaction exists.
            2. Use ThemeData tokens: Theme.of(context).colorScheme.primary instead of hardcoded colors where applicable.
            3. Respect sizing, padding, and constraints.
            4. Use const constructors wherever possible.
            5. Support RTL with Directionality widget.
            6. Add doc comments to the widget class.
            7. Return ONLY the code block of the class without markdown markers.
            """
            
            data = {
                "model": "gpt-4o",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.2
            }
            
            response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=data, timeout=8)
            if response.status_code == 200:
                result = response.json()
                code = result["choices"][0]["message"]["content"]
                # Clean up any potential markdown wraps
                code = re.sub(r"^```dart\n|```$", "", code, flags=re.MULTILINE)
                return {"code": code.strip(), "tokens": tree.get("styles", {}), "imports": ["package:flutter/material.dart"]}
        except Exception as e:
            # Fallback to compiler below on API failure
            pass

    # High fidelity rule-based compiler (default fallback)
    code = compile_tree_to_flutter(tree, rtl, theme)
    return {
        "code": code,
        "tokens": tree.get("styles", {}),
        "imports": ["package:flutter/material.dart"]
    }


def compile_tree_to_flutter(tree: Dict[str, Any], rtl: bool, theme: str) -> str:
    name = tree.get("name", "CustomWidget")
    type_ = tree.get("type", "custom")
    content = tree.get("content", "Content")
    styles = tree.get("styles", {})
    bounds = tree.get("bounds", {})
    
    bg = styles.get("bg", "#7C6AF7")
    color = styles.get("color", "#ffffff")
    radius = styles.get("radius", 8)
    padding = styles.get("padding", [12, 24])
    h = bounds.get("h", 48.0)
    w = bounds.get("w", 200.0)

    # Setup colors based on theme tokens
    bg_hex = bg.replace("#", "0xFF") if bg.startswith("#") else "0xFF7C6AF7"
    color_hex = color.replace("#", "0xFF") if color.startswith("#") else "0xFFFFFFFF"
    
    body_widget = ""
    
    if type_ == "button":
        body_widget = f"""ElevatedButton(
        onPressed: () {{}},
        style: ElevatedButton.styleFrom(
          backgroundColor: const Color({bg_hex}),
          foregroundColor: const Color({color_hex}),
          elevation: 2,
          padding: const EdgeInsets.symmetric(
            horizontal: {padding[1] if len(padding) > 1 else padding[0]},
            vertical: {padding[0]},
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular({radius}),
          ),
        ),
        child: const Text('{content}'),
      )"""

    elif type_ == "input":
        body_widget = f"""TextFormField(
        decoration: InputDecoration(
          hintText: '{content}',
          filled: true,
          fillColor: const Color({bg_hex}),
          contentPadding: const EdgeInsets.symmetric(
            horizontal: {padding[1] if len(padding) > 1 else padding[0]},
            vertical: {padding[0]},
          ),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular({radius}),
            borderSide: BorderSide.none,
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular({radius}),
            borderSide: BorderSide(color: Colors.white.withOpacity(0.08)),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular({radius}),
            borderSide: const BorderSide(color: Color(0xFF7C6AF7), width: 1.5),
          ),
        ),
        style: const TextStyle(color: Color({color_hex}), fontSize: 14),
      )"""

    elif type_ == "card":
        body_widget = f"""Container(
        width: {w},
        height: {h},
        padding: const EdgeInsets.all({padding[0]}),
        decoration: BoxDecoration(
          color: const Color({bg_hex}),
          borderRadius: BorderRadius.circular({radius}),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.15),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              '{content}',
              style: const TextStyle(
                color: Color({color_hex}),
                fontWeight: FontWeight.bold,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Dynamic parsed component child text details.',
              style: TextStyle(
                color: const Color({color_hex}).withOpacity(0.7),
                fontSize: 13,
              ),
            ),
          ],
        ),
      )"""

    elif type_ == "navbar":
        body_widget = f"""Container(
        height: {h},
        padding: const EdgeInsets.symmetric(horizontal: 16),
        decoration: BoxDecoration(
          color: const Color({bg_hex}),
          border: Border(
            bottom: BorderSide(
              color: Colors.white.withOpacity(0.06),
              width: 1.0,
            ),
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Icon(Icons.menu, color: Colors.white),
            Text(
              '{content}',
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 18,
              ),
            ),
            const Icon(Icons.notifications_none, color: Colors.white),
          ],
        ),
      )"""

    else:
        # Custom section / fallback
        body_widget = f"""Container(
        width: {w},
        padding: const EdgeInsets.all({padding[0]}),
        decoration: BoxDecoration(
          color: const Color({bg_hex}),
          borderRadius: BorderRadius.circular({radius}),
        ),
        child: Text(
          '{content}',
          style: const TextStyle(color: Color({color_hex}), fontSize: 14),
        ),
      )"""

    # Apply RTL wrapper if specified
    if rtl:
      body_widget = f"""Directionality(
      textDirection: TextDirection.rtl,
      child: {body_widget},
    )"""

    flutter_class = f"""/// {name} widget parsed and generated by Brillance.
///
/// Follows Material 3 guidelines and supports adaptive dimensions.
class {name} extends StatelessWidget {{
  const {name}({{super.key}});

  @override
  Widget build(BuildContext context) {{
    return {body_widget};
  }}
}}"""
    return flutter_class


# Generate Design Token sets from configuration
@app.post("/generate/design-system")
async def generate_design_system(request: DesignSystemRequest):
    brand = request.brand_name
    hex_color = request.primary_color.replace("#", "")
    preset = request.style_preset
    
    # Simple color scale generator (Tailwind style)
    # We will generate mock 50-900 palettes based on the primary color
    color_scale = {
        "50": f"#f3f0ff",
        "100": f"#e8e2fe",
        "200": f"#d2c6fe",
        "300": f"#b29dfd",
        "400": f"#8f6cfc",
        "500": f"#{hex_color}",
        "600": f"#6c4ee6",
        "700": f"#553bb8",
        "800": f"#453194",
        "900": f"#3b2a7a"
    }
    
    theme_dart = f"""// {brand} ThemeData - Material 3 Design Tokens
// Generated by Brillance Design System Generator ({preset} preset)

import 'package:flutter/material.dart';

final ThemeData {brand.lower().replace(" ", "_")}_theme = ThemeData(
  useMaterial3: true,
  colorScheme: ColorScheme.fromSeed(
    seedColor: const Color(0xFF{hex_color}),
    primary: const Color(0xFF{hex_color}),
    secondary: const Color(0xFF6C4EE6),
    surface: const Color(0xFF0A0A0F),
    background: const Color(0xFF0A0A0F),
    brightness: Brightness.dark,
  ),
  textTheme: const TextTheme(
    displayLarge: TextStyle(fontSize: 57, fontWeight: FontWeight.w400, letterSpacing: -0.25),
    headlineMedium: TextStyle(fontSize: 28, fontWeight: FontWeight.w600, letterSpacing: 0),
    bodyLarge: TextStyle(fontSize: 16, fontWeight: FontWeight.w400, letterSpacing: 0.5),
    labelMedium: TextStyle(fontSize: 12, fontWeight: FontWeight.w500, letterSpacing: 0.5),
  ),
  cardTheme: CardTheme(
    color: const Color(0xFF111118),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(12),
    ),
  ),
);"""

    css_vars = f"""/* {brand} Design Tokens - CSS Variables */
:root {{
  --brand-name: "{brand}";
  --color-primary-500: #{hex_color};
  --color-primary-50: {color_scale["50"]};
  --color-primary-100: {color_scale["100"]};
  --color-primary-200: {color_scale["200"]};
  --color-primary-300: {color_scale["300"]};
  --color-primary-400: {color_scale["400"]};
  --color-primary-600: {color_scale["600"]};
  --color-primary-700: {color_scale["700"]};
  --color-primary-800: {color_scale["800"]};
  --color-primary-900: {color_scale["900"]};

  --radius-none: 0px;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-6: 24px;
  --spacing-8: 32px;
}}"""

    return {
        "brand_name": brand,
        "primary_scale": color_scale,
        "style_preset": preset,
        "theme_dart": theme_dart,
        "css_variables": css_vars
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
