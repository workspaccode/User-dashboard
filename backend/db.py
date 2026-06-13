import os
import sqlite3
import json
import uuid
from typing import List, Dict, Any, Optional
import requests

class DatabaseManager:
    def __init__(self, db_path: str = "brillance.db"):
        # Look for env vars in environment
        self.supabase_url = os.environ.get("SUPABASE_URL") or os.environ.get("VITE_SUPABASE_URL")
        self.supabase_key = os.environ.get("SUPABASE_KEY") or os.environ.get("VITE_SUPABASE_ANON_KEY")
        self.use_supabase = bool(self.supabase_url and self.supabase_key)
        
        # In Windows, we make sure db_path is in the backend/ folder
        script_dir = os.path.dirname(os.path.abspath(__file__))
        self.db_path = os.path.join(script_dir, db_path)
        
        if self.use_supabase:
            print("DatabaseManager: [CLOUD] Connected to Supabase DB via PostgREST Client")
            self.supabase_url = self.supabase_url.rstrip('/')
            self.base_url = f"{self.supabase_url}/rest/v1"
            self.headers = {
                "apikey": self.supabase_key,
                "Authorization": f"Bearer {self.supabase_key}",
                "Content-Type": "application/json",
                "Prefer": "return=representation"
            }
        else:
            print(f"DatabaseManager: [LOCAL] Connected to SQLite database ({self.db_path})")
            self._init_sqlite()

    def _init_sqlite(self):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Create projects table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS projects (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            color TEXT DEFAULT '#7C6AF7',
            components_count INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            user_id TEXT
        )
        """)
        
        # Create components table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS components (
            id TEXT PRIMARY KEY,
            project_id TEXT,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            styles TEXT, -- JSON String
            bounds TEXT, -- JSON String
            content TEXT,
            variants TEXT, -- JSON String
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
        )
        """)
        conn.commit()
        conn.close()

    def get_projects(self) -> List[Dict[str, Any]]:
        if self.use_supabase:
            try:
                url = f"{self.base_url}/projects?select=*"
                res = requests.get(url, headers=self.headers, timeout=10)
                if res.status_code == 200:
                    projects = res.json()
                    # Re-map components key for frontend compatibility
                    for p in projects:
                        p["components"] = p.get("components_count", 0)
                    return projects
                else:
                    print(f"Supabase GET projects error: {res.status_code} - {res.text}")
                    return []
            except Exception as e:
                print(f"Supabase GET projects exception: {str(e)}")
                return []
        else:
            try:
                conn = sqlite3.connect(self.db_path)
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                cursor.execute("SELECT * FROM projects ORDER BY created_at DESC")
                rows = cursor.fetchall()
                projects = []
                for r in rows:
                    p = dict(r)
                    cursor.execute("SELECT COUNT(*) FROM components WHERE project_id = ?", (p["id"],))
                    count = cursor.fetchone()[0]
                    p["components"] = count
                    projects.append(p)
                conn.close()
                return projects
            except Exception as e:
                print(f"SQLite GET projects exception: {str(e)}")
                return []

    def get_project(self, project_id: str) -> Optional[Dict[str, Any]]:
        if self.use_supabase:
            try:
                url = f"{self.base_url}/projects?id=eq.{project_id}&select=*"
                res = requests.get(url, headers=self.headers, timeout=10)
                if res.status_code == 200 and res.json():
                    p = res.json()[0]
                    p["components"] = p.get("components_count", 0)
                    return p
                return None
            except Exception as e:
                print(f"Supabase GET project exception: {str(e)}")
                return None
        else:
            try:
                conn = sqlite3.connect(self.db_path)
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                cursor.execute("SELECT * FROM projects WHERE id = ?", (project_id,))
                row = cursor.fetchone()
                if row:
                    p = dict(row)
                    cursor.execute("SELECT COUNT(*) FROM components WHERE project_id = ?", (project_id,))
                    count = cursor.fetchone()[0]
                    p["components"] = count
                    conn.close()
                    return p
                conn.close()
                return None
            except Exception as e:
                print(f"SQLite GET project exception: {str(e)}")
                return None

    def create_project(self, name: str, description: str = "", color: str = "#7C6AF7", user_id: str = None) -> Dict[str, Any]:
        project_id = str(uuid.uuid4())
        project_data = {
            "id": project_id,
            "name": name,
            "description": description,
            "color": color,
            "components_count": 0,
            "user_id": user_id
        }
        
        if self.use_supabase:
            try:
                url = f"{self.base_url}/projects"
                res = requests.post(url, headers=self.headers, json=project_data, timeout=10)
                if res.status_code in [200, 201]:
                    inserted = res.json()[0] if res.json() else project_data
                    inserted["components"] = inserted.get("components_count", 0)
                    return inserted
                else:
                    raise Exception(f"Supabase POST project error: {res.status_code} - {res.text}")
            except Exception as e:
                print(f"Supabase CREATE project exception: {str(e)}")
                raise e
        else:
            try:
                conn = sqlite3.connect(self.db_path)
                cursor = conn.cursor()
                cursor.execute("""
                INSERT INTO projects (id, name, description, color, components_count, user_id)
                VALUES (?, ?, ?, ?, ?, ?)
                """, (project_id, name, description, color, 0, user_id))
                conn.commit()
                conn.close()
                project_data["components"] = 0
                return project_data
            except Exception as e:
                print(f"SQLite CREATE project exception: {str(e)}")
                raise e

    def delete_project(self, project_id: str) -> bool:
        if self.use_supabase:
            try:
                # PostgREST cascade handles components if foreign key has ON DELETE CASCADE
                url = f"{self.base_url}/projects?id=eq.{project_id}"
                res = requests.delete(url, headers=self.headers, timeout=10)
                return res.status_code in [200, 204]
            except Exception as e:
                print(f"Supabase DELETE project exception: {str(e)}")
                return False
        else:
            try:
                conn = sqlite3.connect(self.db_path)
                cursor = conn.cursor()
                cursor.execute("DELETE FROM components WHERE project_id = ?", (project_id,))
                cursor.execute("DELETE FROM projects WHERE id = ?", (project_id,))
                conn.commit()
                conn.close()
                return True
            except Exception as e:
                print(f"SQLite DELETE project exception: {str(e)}")
                return False

    def get_project_components(self, project_id: str) -> List[Dict[str, Any]]:
        if self.use_supabase:
            try:
                url = f"{self.base_url}/components?project_id=eq.{project_id}&select=*"
                res = requests.get(url, headers=self.headers, timeout=10)
                if res.status_code == 200:
                    components = res.json()
                    for c in components:
                        if isinstance(c.get("styles"), str):
                            try:
                                c["styles"] = json.loads(c["styles"])
                            except:
                                pass
                        if isinstance(c.get("bounds"), str):
                            try:
                                c["bounds"] = json.loads(c["bounds"])
                            except:
                                pass
                        if isinstance(c.get("variants"), str):
                            try:
                                c["variants"] = json.loads(c["variants"])
                            except:
                                pass
                    return components
                else:
                    print(f"Supabase GET components error: {res.status_code} - {res.text}")
                    return []
            except Exception as e:
                print(f"Supabase GET components exception: {str(e)}")
                return []
        else:
            try:
                conn = sqlite3.connect(self.db_path)
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                cursor.execute("SELECT * FROM components WHERE project_id = ?", (project_id,))
                rows = cursor.fetchall()
                components = []
                for r in rows:
                    c = dict(r)
                    c["styles"] = json.loads(c["styles"]) if c["styles"] else {}
                    c["bounds"] = json.loads(c["bounds"]) if c["bounds"] else {}
                    c["variants"] = json.loads(c["variants"]) if c["variants"] else []
                    components.append(c)
                conn.close()
                return components
            except Exception as e:
                print(f"SQLite GET components exception: {str(e)}")
                return []

    def create_components(self, project_id: str, components: List[Dict[str, Any]]):
        if not components:
            return
            
        formatted_components = []
        for i, c in enumerate(components):
            c_id = c.get("id") or f"{c.get('type', 'comp')}-{i}-{str(uuid.uuid4())[:8]}"
            
            db_c = {
                "id": c_id,
                "project_id": project_id,
                "name": c.get("name", f"Component_{i+1}"),
                "type": c.get("type", "custom"),
                "content": c.get("content", ""),
            }
            
            if self.use_supabase:
                db_c["styles"] = c.get("styles") or {}
                db_c["bounds"] = c.get("bounds") or {}
                db_c["variants"] = c.get("variants") or []
            else:
                db_c["styles"] = json.dumps(c.get("styles") or {})
                db_c["bounds"] = json.dumps(c.get("bounds") or {})
                db_c["variants"] = json.dumps(c.get("variants") or [])
                
            formatted_components.append(db_c)
            
        if self.use_supabase:
            try:
                # Bulk insert components to Supabase
                url = f"{self.base_url}/components"
                res = requests.post(url, headers=self.headers, json=formatted_components, timeout=10)
                if res.status_code not in [200, 201, 204]:
                    print(f"Supabase POST components error: {res.status_code} - {res.text}")
                
                # Sync project components count
                res_count = requests.get(f"{self.base_url}/components?project_id=eq.{project_id}&select=id", headers=self.headers, timeout=10)
                if res_count.status_code == 200:
                    count = len(res_count.json())
                    requests.patch(f"{self.base_url}/projects?id=eq.{project_id}", headers=self.headers, json={"components_count": count}, timeout=10)
            except Exception as e:
                print(f"Supabase CREATE components exception: {str(e)}")
        else:
            try:
                conn = sqlite3.connect(self.db_path)
                cursor = conn.cursor()
                for c in formatted_components:
                    cursor.execute("""
                    INSERT OR REPLACE INTO components (id, project_id, name, type, styles, bounds, content, variants)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    """, (c["id"], c["project_id"], c["name"], c["type"], c["styles"], c["bounds"], c["content"], c["variants"]))
                
                cursor.execute("SELECT COUNT(*) FROM components WHERE project_id = ?", (project_id,))
                count = cursor.fetchone()[0]
                cursor.execute("UPDATE projects SET components_count = ? WHERE id = ?", (count, project_id))
                
                conn.commit()
                conn.close()
            except Exception as e:
                print(f"SQLite CREATE components exception: {str(e)}")
