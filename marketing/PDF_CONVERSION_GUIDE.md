# PDF Conversion Guide
## Creating Professional PDFs from Tech Stack Documents

This guide shows you how to convert the markdown tech stack review documents into professional PDFs for client sharing.

---

## Quick Start (Recommended)

### Option 1: Visual Studio Code + Markdown PDF Extension

**Best for**: Windows users, quick conversions, maintaining formatting

1. **Install VS Code** (if not already installed)
   - Download: https://code.visualstudio.com/

2. **Install Markdown PDF Extension**
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X)
   - Search for "Markdown PDF" by yzane
   - Click Install

3. **Configure PDF Settings** (optional)
   - Open VS Code Settings (Ctrl+,)
   - Search for "markdown-pdf"
   - Customize:
     - Page format: A4 or Letter
     - Header/Footer: Add company name, date
     - Margins: 1cm default (adjust if needed)
     - CSS: Custom styling (see below)

4. **Convert to PDF**
   - Open `TECH_STACK_REVIEW.md` in VS Code
   - Right-click in editor
   - Select "Markdown PDF: Export (pdf)"
   - PDF will be saved in same directory

5. **Repeat for Summary**
   - Open `TECH_STACK_SUMMARY.md`
   - Right-click → "Markdown PDF: Export (pdf)"

---

## Option 2: Pandoc (Command Line)

**Best for**: Advanced users, automation, custom templates

### Installation

**Windows**:
```bash
# Using Chocolatey
choco install pandoc

# Or download installer
# https://pandoc.org/installing.html
```

**Mac**:
```bash
brew install pandoc
brew install basictex  # For LaTeX (required for PDFs)
```

### Basic Conversion

```bash
# Navigate to project directory
cd C:\projects\mobileApps\manifest-the-unseen-ios

# Convert full review to PDF
pandoc TECH_STACK_REVIEW.md -o TECH_STACK_REVIEW.pdf --pdf-engine=xelatex

# Convert summary to PDF
pandoc TECH_STACK_SUMMARY.md -o TECH_STACK_SUMMARY.pdf --pdf-engine=xelatex
```

### Advanced Conversion (With Styling)

```bash
# With custom margins and metadata
pandoc TECH_STACK_REVIEW.md -o TECH_STACK_REVIEW.pdf \
  --pdf-engine=xelatex \
  -V geometry:margin=1in \
  -V fontsize=11pt \
  -V colorlinks=true \
  -V linkcolor=blue \
  --metadata title="Tech Stack Review: Manifest the Unseen" \
  --metadata author="Your Company Name" \
  --metadata date="$(date +'%Y-%m-%d')" \
  --toc \
  --toc-depth=2
```

**Options Explained**:
- `--pdf-engine=xelatex` - Better Unicode support
- `-V geometry:margin=1in` - Set margins
- `--toc` - Include table of contents
- `--toc-depth=2` - TOC shows H1 and H2 headings
- `--metadata` - Add PDF metadata

---

## Option 3: Online Converters

**Best for**: No installation, quick one-off conversions

### Recommended Services:

1. **Markdown to PDF** (https://www.markdowntopdf.com/)
   - Free, no signup required
   - Upload markdown file or paste content
   - Download PDF

2. **CloudConvert** (https://cloudconvert.com/md-to-pdf)
   - Free tier available
   - Batch conversion
   - Custom page settings

3. **Dillinger** (https://dillinger.io/)
   - Online markdown editor
   - Preview + export to PDF
   - Cloud storage integration

**Steps**:
1. Go to chosen website
2. Upload `TECH_STACK_REVIEW.md`
3. Configure settings (page size, margins)
4. Download PDF

---

## Option 4: GitHub Actions (Automated)

**Best for**: Automatic PDF generation on every commit

Create `.github/workflows/build-pdf.yml`:

```yaml
name: Build PDFs

on:
  push:
    paths:
      - 'TECH_STACK_REVIEW.md'
      - 'TECH_STACK_SUMMARY.md'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install Pandoc
        run: |
          sudo apt-get update
          sudo apt-get install -y pandoc texlive-xetex

      - name: Convert to PDF
        run: |
          pandoc TECH_STACK_REVIEW.md -o TECH_STACK_REVIEW.pdf --pdf-engine=xelatex
          pandoc TECH_STACK_SUMMARY.md -o TECH_STACK_SUMMARY.pdf --pdf-engine=xelatex

      - name: Upload PDFs
        uses: actions/upload-artifact@v3
        with:
          name: tech-stack-pdfs
          path: |
            TECH_STACK_REVIEW.pdf
            TECH_STACK_SUMMARY.pdf
```

---

## Custom CSS for Better PDF Styling

### For VS Code Markdown PDF Extension

Create `markdown-pdf-custom.css` in project root:

```css
/* Page setup */
@page {
  margin: 2cm;
  size: A4;
}

/* Typography */
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 11pt;
  line-height: 1.6;
  color: #333;
}

h1 {
  color: #1a1a1a;
  font-size: 28pt;
  border-bottom: 3px solid #4a90e2;
  padding-bottom: 10px;
  margin-top: 30px;
}

h2 {
  color: #2c3e50;
  font-size: 20pt;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 8px;
  margin-top: 25px;
}

h3 {
  color: #34495e;
  font-size: 16pt;
  margin-top: 20px;
}

/* Code blocks */
code {
  background-color: #f4f4f4;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: 10pt;
}

pre {
  background-color: #f8f8f8;
  border: 1px solid #ddd;
  border-left: 4px solid #4a90e2;
  padding: 15px;
  overflow-x: auto;
  font-size: 9pt;
}

/* Tables */
table {
  border-collapse: collapse;
  width: 100%;
  margin: 20px 0;
}

th {
  background-color: #4a90e2;
  color: white;
  padding: 12px;
  text-align: left;
  font-weight: bold;
}

td {
  border: 1px solid #ddd;
  padding: 10px;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

/* Links */
a {
  color: #4a90e2;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

/* Blockquotes */
blockquote {
  border-left: 4px solid #4a90e2;
  padding-left: 20px;
  margin-left: 0;
  color: #666;
  font-style: italic;
}

/* Lists */
ul, ol {
  margin-left: 20px;
}

li {
  margin-bottom: 8px;
}

/* Checkboxes (for task lists) */
input[type="checkbox"] {
  margin-right: 8px;
}

/* Badges (shields.io images) */
img[alt*="badge"] {
  display: inline-block;
  margin: 5px 5px 5px 0;
}

/* Page breaks for sections */
h1 {
  page-break-before: always;
}

h1:first-child {
  page-break-before: avoid;
}
```

**To use with VS Code Markdown PDF**:
1. Save CSS above as `markdown-pdf-custom.css`
2. VS Code Settings → Search "markdown-pdf.styles"
3. Add: `["markdown-pdf-custom.css"]`
4. Convert to PDF as usual

---

## Optimizing for Print

### Before Converting:

1. **Remove excessive images** (if any)
   - Tech stack documents are mostly text, should be fine

2. **Check ASCII diagrams**
   - Use monospace font for proper alignment
   - Consider replacing with images if diagrams break

3. **Verify tables fit**
   - Wide tables may overflow on Letter/A4
   - Consider rotating page for wide tables

4. **Add page breaks** (manual, if needed)
   ```markdown
   <div style="page-break-after: always;"></div>
   ```

### After Converting:

1. **Review PDF**
   - Open in Adobe Acrobat Reader
   - Check all pages render correctly
   - Verify links work (table of contents, external links)

2. **Optimize file size** (if >5MB)
   - Adobe Acrobat: File → Save As Other → Reduced Size PDF
   - Online: https://www.ilovepdf.com/compress_pdf

3. **Add metadata** (optional)
   - Adobe Acrobat: File → Properties
   - Set Title, Author, Subject, Keywords

---

## Recommended Settings by Use Case

### For Client Emails
- **Format**: Letter (8.5×11")
- **Margins**: 1 inch
- **Font**: 11pt
- **Include**: Table of contents, page numbers
- **File size**: <2MB (compress if needed)

### For Printing
- **Format**: Letter or A4
- **Margins**: 0.75 inch (more readable)
- **Font**: 12pt (larger for readability)
- **Include**: Headers/footers with company logo

### For Online Sharing (Portfolio)
- **Format**: A4
- **Margins**: 1 inch
- **Font**: 11pt
- **Include**: Clickable TOC, hyperlinks enabled
- **Optimize**: High compression (faster download)

---

## Troubleshooting

### Issue: "Pandoc not found"
**Solution**: Add Pandoc to PATH or reinstall

### Issue: Tables overflow page
**Solution**: Use smaller font or landscape orientation
```bash
pandoc file.md -o file.pdf -V geometry:landscape
```

### Issue: Emojis don't render
**Solution**: Use XeLaTeX engine (better Unicode support)
```bash
pandoc file.md -o file.pdf --pdf-engine=xelatex
```

### Issue: Code blocks cut off
**Solution**: Use smaller code font size in CSS
```css
pre code {
  font-size: 8pt;
}
```

### Issue: Links not clickable in PDF
**Solution**: Add `-V colorlinks=true` to Pandoc command

---

## Final Checklist

Before sending PDFs to clients:

- [ ] All pages render correctly
- [ ] Table of contents works (if included)
- [ ] Links are clickable
- [ ] No overflow text/tables
- [ ] File size < 5MB
- [ ] Metadata set (title, author)
- [ ] Filename is professional (e.g., `Manifest_Tech_Stack_Review_2025.pdf`)
- [ ] PDF is not password protected (unless required)
- [ ] Tested opening in Adobe Reader

---

## Recommended Workflow

**For Regular Updates**:

1. **Edit markdown files** (TECH_STACK_REVIEW.md, TECH_STACK_SUMMARY.md)
2. **Preview in VS Code** (Ctrl+Shift+V)
3. **Convert to PDF** (right-click → Markdown PDF: Export)
4. **Review PDF** in Adobe Reader
5. **Compress if needed** (ilovepdf.com)
6. **Rename professionally**: `Manifest_Tech_Stack_Review_v1.0_2025-12-11.pdf`
7. **Store in `docs/` or `pdfs/` directory**

---

## Automation Script (PowerShell)

Save as `generate-pdfs.ps1`:

```powershell
# Generate Tech Stack PDFs
# Usage: .\generate-pdfs.ps1

$date = Get-Date -Format "yyyy-MM-dd"

# Convert full review
pandoc TECH_STACK_REVIEW.md -o "pdfs/Manifest_Tech_Stack_Review_$date.pdf" `
  --pdf-engine=xelatex `
  -V geometry:margin=1in `
  -V fontsize=11pt `
  --metadata title="Tech Stack Review: Manifest the Unseen" `
  --metadata author="Manifest the Unseen Team" `
  --metadata date="$date" `
  --toc

# Convert summary
pandoc TECH_STACK_SUMMARY.md -o "pdfs/Manifest_Tech_Stack_Summary_$date.pdf" `
  --pdf-engine=xelatex `
  -V geometry:margin=1in `
  -V fontsize=11pt `
  --metadata title="Tech Stack Summary" `
  --metadata author="Manifest the Unseen Team" `
  --metadata date="$date"

Write-Host "PDFs generated successfully in pdfs/ directory"
```

**Run**:
```powershell
.\generate-pdfs.ps1
```

---

## Resources

- **Pandoc Documentation**: https://pandoc.org/MANUAL.html
- **Markdown PDF Extension**: https://marketplace.visualstudio.com/items?itemName=yzane.markdown-pdf
- **LaTeX Installation**: https://www.latex-project.org/get/
- **PDF Compression**: https://www.ilovepdf.com/compress_pdf
- **Markdown Guide**: https://www.markdownguide.org/

---

**Created**: 2025-12-11
**Last Updated**: 2025-12-11
