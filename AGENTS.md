# AGENTS.md — basic_tool_web

## Project

Django 5+ monolith with 12 Django apps (`homeapp`, `calculator`, `calender`, `ctimer`, `habittracker`, `note`, `qrcode`, `randomizer`, `stopwatch`, `todolist`, `unitconvertor`, `users`). `homeapp`, `calculator`, `calender`, `qrcode`, `randomizer`, `stopwatch`, and `unitconvertor` are wired into `INSTALLED_APPS` and root URLconf; the other 5 apps (`ctimer`, `habittracker`, `note`, `todolist`, `users`) are stubs.

Note: `calender` is intentionally misspelled (not `calendar`).

## Setup

```sh
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## Key structure

| Path | Role |
|---|---|
| `basic_tool_web/` | Project package (settings, root URLconf) |
| `homeapp/` | Landing page + base template, theme toggle, Bootstrap 5 |
| `homeapp/templates/homeapp/{base,home}.html` | Base template with tools dropdown navbar; home page with 6 tool cards |
| `homeapp/static/homeapp/bootcss/` | Vendored Bootstrap 5.3 CSS |
| `homeapp/static/homeapp/bootjs/` | Vendored Bootstrap 5.3 JS |
| `calculator/`, `calender/`, `qrcode/`, `randomizer/`, `stopwatch/` | Activated with placeholder "Coming soon" pages |
| `unitconvertor/` | Active app — 12-category converter (all client-side JS) |
| `unitconvertor/templates/unitconvertor/index.html` | Converter page |
| `unitconvertor/static/unitconvertor/js/converter.js` | Conversion logic (length, weight, temp, volume, area, speed, time, data, energy, power, pressure, fuel) |
| `db.sqlite3` | Default SQLite database |

## Commands

```sh
python manage.py runserver          # dev server
python manage.py migrate            # apply migrations
python manage.py makemigrations     # create migrations
python manage.py test               # run all tests
python manage.py test <app>         # test a single app
```

## Conventions

- All apps use `default_auto_field = 'django.db.models.BigAutoField'` — match this in new models.
- AppConfig classes follow the pattern `<Name>Config` (e.g. `CalculatorConfig` in `calculator/apps.py`).

## Gotchas

- `calculator`, `calender`, `qrcode`, `randomizer`, `stopwatch` have placeholder "Coming soon" pages — replace them with real views/templates.
- `unitconvertor` serves at `/convert/`. Its conversion logic is entirely client-side in `converter.js` — no server-side computation.
- To activate a remaining stub app: add it to `basic_tool_web/settings.py:INSTALLED_APPS`, wire its URLs in `basic_tool_web/urls.py`, and implement views/urls in the app directory.
- Navbar has a **Tools** dropdown listing all 6 activated tools. No brand text in navbar.
- Theme toggle (Light/Dark/System) saved in `localStorage`, driven by Bootstrap 5.3 `data-bs-theme` attribute.
- Activate GA4 by setting `GA_MEASUREMENT_ID` env var (e.g. `G-XXXXXXXXXX`). Snippet is in `base.html` and is stripped when the env var is empty.
- For production: set `DJANGO_DEBUG=false`, `DJANGO_SECRET_KEY=<long random>`, `DJANGO_ALLOWED_HOSTS=<domain>`, then run `python manage.py collectstatic --noinput`.
- **Dev server must be restarted** after adding new static files (`StatReloader` only watches `.py` files; new JS/CSS in `static/` dirs won't be picked up until restart).
- No lint, format, typecheck, or pre-commit config exists.
- No CI workflows.
