#!/bin/bash

# Website Validation Script for Veronica's Portfolio
# This script verifies the key components of the website

echo "🧪 Website Validation Script"
echo "================================"
echo ""

# Check if all required files exist
echo "📁 Checking file structure..."
files=(
    "index.html"
    "styles/main.css"
    "styles/responsive.css"
    "js/main.js"
    "data/projects.json"
    "data/blog-articles.json"
)

all_files_exist=true
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file - MISSING"
        all_files_exist=false
    fi
done

echo ""

# Check HTML structure
echo "🔍 Validating HTML structure..."
if grep -q "<!DOCTYPE html>" index.html && \
   grep -q "</html>" index.html && \
   grep -q "Veronica Putri Anggraini" index.html; then
    echo "✅ HTML structure is valid"
else
    echo "❌ HTML structure has issues"
fi

echo ""

# Check CSS files
echo "🎨 Checking CSS files..."
if grep -qi "terminal" styles/main.css; then
    echo "✅ Main CSS has terminal aesthetic"
else
    echo "❌ Main CSS missing required styles"
fi

if grep -qi "responsive\|mobile" styles/responsive.css; then
    echo "✅ Responsive CSS is properly configured"
else
    echo "❌ Responsive CSS has issues"
fi

echo ""

# Check JavaScript file
echo "⚡ Checking JavaScript file..."
if grep -q "initMobileMenu" js/main.js && \
   grep -q "loadPortfolioData" js/main.js && \
   grep -q "loadBlogData" js/main.js; then
    echo "✅ JavaScript has all required functions"
else
    echo "❌ JavaScript missing required functions"
fi

echo ""

# Check data files
echo "📊 Checking data files..."
if jq empty data/projects.json 2>/dev/null; then
    echo "✅ projects.json is valid JSON"
    project_count=$(jq '. | length' data/projects.json)
    echo "   Found $project_count projects"
else
    echo "❌ projects.json has JSON syntax errors"
fi

if jq empty data/blog-articles.json 2>/dev/null; then
    echo "✅ blog-articles.json is valid JSON"
    article_count=$(jq '. | length' data/blog-articles.json)
    echo "   Found $article_count articles"
else
    echo "❌ blog-articles.json has JSON syntax errors"
fi

echo ""

# Check for key sections in HTML
echo "📋 Checking HTML sections..."
sections=(
    "hero"
    "about"
    "skills"
    "experience"
    "education"
    "portfolio"
    "blog"
    "contact"
)

all_sections_exist=true
for section in "${sections[@]}"; do
    if grep -q "id=\"$section\"" index.html; then
        echo "✅ $section section"
    else
        echo "❌ $section section - MISSING"
        all_sections_exist=false
    fi
done

echo ""

# Summary
echo "================================"
echo "📊 Validation Summary"
echo "================================"

if [ "$all_files_exist" = true ] && [ "$all_sections_exist" = true ]; then
    echo "✅ All validations passed!"
    echo "🎉 Website is ready to use!"
    echo ""
    echo "To view the website:"
    echo "1. Open 'index.html' in your web browser"
    echo "   - Double-click the file"
    echo "   - Or: xdg-open index.html"
    echo ""
    echo "2. Or use a local web server:"
    echo "   - Python 3: python3 -m http.server 8000"
    echo "   - Node.js: npx http-server"
    echo "   - Then open http://localhost:8000"
else
    echo "❌ Some validations failed"
    echo "Please review the issues above"
fi

echo ""
echo "Testing completed!"