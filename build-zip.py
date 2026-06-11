#!/usr/bin/env python3
"""
Gera um pacote (.zip) do site pronto para hospedagem.

- Cria uma versão NOVA numerada e datada em `versoes/jessica-site-vN-AAAA-MM-DD.zip`
- NUNCA apaga as versões antigas (elas ficam todas em `versoes/`)
- Atualiza também uma cópia "mais recente" em `jessica-site.zip` (raiz)

Uso:  python build-zip.py
"""
import os, re, zipfile, datetime, shutil

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, "src")
VDIR = os.path.join(ROOT, "versoes")
IGNORE_DIRS = {".git", "node_modules", "__pycache__"}

os.makedirs(VDIR, exist_ok=True)

# descobre a próxima versão
nums = []
for f in os.listdir(VDIR):
    m = re.match(r"jessica-site-v(\d+)-", f)
    if m:
        nums.append(int(m.group(1)))
ver = (max(nums) + 1) if nums else 1
date = datetime.date.today().isoformat()
name = f"jessica-site-v{ver}-{date}.zip"
out = os.path.join(VDIR, name)

# empacota o conteúdo de src/ na raiz do zip
count = 0
with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
    for root, dirs, files in os.walk(SRC):
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
        for f in files:
            full = os.path.join(root, f)
            z.write(full, os.path.relpath(full, SRC))
            count += 1

# cópia "mais recente" na raiz (conveniência)
shutil.copy(out, os.path.join(ROOT, "jessica-site.zip"))

kb = os.path.getsize(out) / 1024
print(f"OK -> versoes/{name}")
print(f"     {count} arquivos, {kb:.1f} KB")
print(f"Copia mais recente: jessica-site.zip")
print("Versoes guardadas:")
for f in sorted(os.listdir(VDIR)):
    if f.endswith(".zip"):
        print("  -", f)
