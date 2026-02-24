#!/usr/bin/env python3
"""
Hadith Categorization Script
Adds categories to hadiths based on content analysis and keywords
"""

import json
import re
from typing import List, Dict, Any

# Define categories and their keywords
CATEGORIES = {
    "Faith (Iman)": {
        "Tawheed": ["allah", "god", "one god", "monotheism", "shirk", "polytheism", "worship", "divine"],
        "Angels": ["angel", "jibreel", "mikail", "malak", "heavenly"],
        "Divine Decree": ["qadr", "destiny", "fate", "predestination", "divine decree"],
        "Day of Judgment": ["judgment", "resurrection", "hereafter", "akhirah", "qiyamah", "paradise", "hell"],
        "Prophets": ["prophet", "messenger", "rasul", "nabi", "muhammad", "isa", "musa", "ibrahim"]
    },
    "Worship (Ibadah)": {
        "Prayer": ["prayer", "salah", "namaz", "rakah", "sujud", "ruku", "adhan", "iqamah", "masjid", "mosque"],
        "Wudu": ["wudu", "ablution", "ghusl", "taharah", "cleanliness", "purification"],
        "Fasting": ["fasting", "sawm", "ramadan", "iftar", "suhur", "break fast"],
        "Zakat": ["zakat", "charity", "poor", "needy", "wealth", "obligatory charity"],
        "Hajj": ["hajj", "umrah", "kaaba", "mecca", "medina", "pilgrimage", "tawaf", "saee"]
    },
    "Personal Development": {
        "Manners": ["manners", "etiquette", "adab", "courtesy", "respect", "kindness"],
        "Patience": ["patience", "sabr", "endurance", "perseverance", "calm"],
        "Sincerity": ["sincerity", "ikhlas", "pure intention", "for allah"],
        "Intention": ["intention", "niyyah", "purpose", "aim", "goal"],
        "Repentance": ["repentance", "tawbah", "forgiveness", "sin", "regret", "return to allah"]
    },
    "Social Conduct": {
        "Brotherhood": ["brother", "sister", "brotherhood", "unity", "together", "muslim", "ummah"],
        "Neighbors": ["neighbor", "neighborhood", "nearby", "local"],
        "Family": ["family", "parents", "children", "wife", "husband", "mother", "father"],
        "Generosity": ["generosity", "giving", "charity", "help", "assist", "support"],
        "Forgiveness": ["forgiveness", "pardon", "excuse", "overlook", "forgive"]
    },
    "Ethics & Justice": {
        "Honesty": ["honesty", "truth", "truthful", "lie", "lying", "deceit"],
        "Justice": ["justice", "fair", "unjust", "oppression", "rights"],
        "Backbiting": ["backbiting", "gossip", "slander", "speak ill", "criticize"],
        "Oppression": ["oppression", "injustice", "wrong", "harm", "hurt"]
    },
    "Business & Wealth": {
        "Halal income": ["halal", "permissible", "income", "earn", "work", "business"],
        "Trusts": ["trust", "amanah", "deposit", "safekeeping"],
        "Debts": ["debt", "loan", "borrow", "lend", "owe"],
        "Charity": ["charity", "sadaqah", "donation", "give", "help poor"]
    },
    "Leadership & Governance": {
        "Rulers": ["ruler", "leader", "authority", "government", "caliph", "amir"],
        "Consultation": ["consultation", "shura", "advice", "counsel"],
        "Obedience": ["obedience", "follow", "listen", "command", "order"]
    },
    "Warnings": {
        "Hypocrisy": ["hypocrite", "hypocrisy", "nifaq", "double-faced"],
        "Major sins": ["major sin", "kabirah", "grave sin", "forbidden", "haram"],
        "Hellfire": ["hell", "fire", "punishment", "torment", "jahannam"]
    },
    "Paradise & Rewards": {
        "Jannah": ["paradise", "jannah", "heaven", "reward", "garden"],
        "Good deeds": ["good deed", "righteous", "virtue", "merit", "reward"],
        "Allah's mercy": ["mercy", "rahman", "rahim", "forgiveness", "pardon"]
    }
}

def categorize_hadith(hadith: Dict[str, Any]) -> List[str]:
    """Categorize a hadith based on its content"""
    text = f"{hadith['english']} {hadith['arabic']}".lower()
    categories = []
    
    for main_category, subcategories in CATEGORIES.items():
        for subcategory, keywords in subcategories.items():
            for keyword in keywords:
                if keyword in text:
                    category_name = f"{main_category}: {subcategory}"
                    if category_name not in categories:
                        categories.append(category_name)
                    break  # Found one keyword for this subcategory, move to next
    
    # If no categories found, add a general category
    if not categories:
        categories.append("General")
    
    return categories

def add_categories_to_hadiths():
    """Add categories to all hadiths in the JSON file"""
    print("Loading hadiths...")
    
    # Load the existing hadiths
    with open('minaret_hadiths_complete.json', 'r', encoding='utf-8') as f:
        hadiths = json.load(f)
    
    print(f"Processing {len(hadiths)} hadiths...")
    
    # Add categories to each hadith
    for i, hadith in enumerate(hadiths):
        hadith['categories'] = categorize_hadith(hadith)
        
        # Progress indicator
        if (i + 1) % 1000 == 0:
            print(f"Processed {i + 1}/{len(hadiths)} hadiths...")
    
    # Save the categorized hadiths
    output_file = 'minaret_hadiths_categorized.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(hadiths, f, ensure_ascii=False, indent=2)
    
    print(f"Categorization complete! Saved to {output_file}")
    
    # Generate statistics
    category_stats = {}
    for hadith in hadiths:
        for category in hadith['categories']:
            category_stats[category] = category_stats.get(category, 0) + 1
    
    print("\nCategory Statistics:")
    for category, count in sorted(category_stats.items(), key=lambda x: x[1], reverse=True):
        print(f"{category}: {count} hadiths")
    
    return hadiths

def create_category_mapping():
    """Create a mapping of main categories to subcategories for the UI"""
    mapping = {}
    for main_category, subcategories in CATEGORIES.items():
        mapping[main_category] = list(subcategories.keys())
    return mapping

if __name__ == "__main__":
    categorized_hadiths = add_categories_to_hadiths()
    
    # Create and save category mapping for the UI
    category_mapping = create_category_mapping()
    with open('category_mapping.json', 'w', encoding='utf-8') as f:
        json.dump(category_mapping, f, ensure_ascii=False, indent=2)
    
    print("\nCategory mapping saved to category_mapping.json")
    print("Ready to update the web app with categorization!") 