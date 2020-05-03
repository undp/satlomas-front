#!/bin/bash
I18N_ID=1WMKf6iBm7iMDqOcDUkrXMm2KaMGazK9Z7HTITJ4TR9I
wget "https://docs.google.com/spreadsheets/d/${I18N_ID}/export?format=csv" -O i18n.csv
script/gen_locales.py
git add i18n.csv public/static/locales
