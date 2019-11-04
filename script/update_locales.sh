#!/bin/bash
I18N_ID=1-gYnVIAIgUpjQO7vlXkkZs2FiM1jUj6sSyYaK6d8L8E
#wget "https://docs.google.com/spreadsheets/d/${I18N_ID}/export?format=csv&id=${I18N_ID}&gid=0" -O i18n.csv
wget "https://docs.google.com/spreadsheets/d/${I18N_ID}/export?format=csv" -O i18n.csv
script/gen_locales.py
git add i18n.csv static/locales
