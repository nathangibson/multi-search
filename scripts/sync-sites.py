import json
import os

sites_dir = '/Users/nathan/Github/nathangibson/multi-search/sites'
target_file = '/Users/nathan/Github/nathangibson/multi-search/utils/sites.js'

all_data = {}
for filename in sorted(os.listdir(sites_dir)):  # sorted for determinism
    if not filename.endswith('.json'):
        continue
    with open(os.path.join(sites_dir, filename), 'r') as f:
        data = json.load(f)
    mode_id = data.get('modeId')
    if not mode_id:
        continue
    # Conflict resolution: bibliography.json wins over bibliography-ubffm.json
    # (both claim modeId 'bibliography'); user chose the WorldCat/IA/Scholar set
    if mode_id in all_data and filename != 'bibliography.json':
        print(f"Skipping {filename} — {mode_id} already loaded from an earlier file")
        continue
    all_data[mode_id] = data

# Deterministic mode order: Art & Objects, Bibliography, Images, Manuscripts, Shopping
mode_order = ['art-objects', 'bibliography', 'images', 'manuscripts', 'shopping']
modes = [{'id': mid, 'name': all_data[mid].get('modeName', mid.capitalize())}
         for mid in mode_order if mid in all_data]

default_sites_by_mode = {mid: all_data[mid].get('sites', []) for mid in mode_order if mid in all_data}
default_groups_by_mode = {mid: all_data[mid].get('groups', []) for mid in mode_order if mid in all_data}

bib_sites = default_sites_by_mode.get('bibliography', [])

js_content = "// Generated from sites/*.json — do not edit by hand; edit the JSON and re-sync.\n\n"
js_content += f"export const MODES = {json.dumps(modes, indent=2, ensure_ascii=False)};\n\n"
js_content += f"export const DEFAULT_SITES = {json.dumps(bib_sites, indent=2, ensure_ascii=False)};\n\n"
js_content += f"export const DEFAULT_SITES_BY_MODE = {json.dumps(default_sites_by_mode, indent=2, ensure_ascii=False)};\n\n"
js_content += f"export const DEFAULT_GROUPS_BY_MODE = {json.dumps(default_groups_by_mode, indent=2, ensure_ascii=False)};\n"

with open(target_file, 'w') as f:
    f.write(js_content)

# Summary
for mid in mode_order:
    if mid in all_data:
        print(f"{mid}: {len(default_sites_by_mode[mid])} sites, {len(default_groups_by_mode[mid])} groups")
print("\nutils/sites.js regenerated deterministically (bibliography.json wins the conflict).")
