## Translations

- [简体中文](/README.md)


# PumpkinDesigner
A lightweight table data editor that serves as a core front-end editing component for **PumpkinDev** ([www.pumpkindev.com](www.pumpkindev.com)). It focuses on **data entry interface development** and **print template design**, balancing ease of use and powerful customization.

> ⚠️ Note: This component is designed for lightweight and customizable scenarios. If you need a full-featured Excel clone, this project may not meet your needs.

## 🌟 Background
Many clients work primarily with tables and strongly demand **Excel-like data entry interfaces**. However, existing solutions on the market have two major drawbacks:
- Commercial components are expensive and have fixed functions that are hard to customize;
- Native Excel-style components are too tightly coupled with Excel logic, making it difficult to extend business features such as **cell rounding** and **custom dropdown rules**.

Therefore, we built **PumpkinDesigner** — it retains Excel’s user-friendly operations while supporting highly customizable development, achieving both usability and full control.

## ✨ Core Features
### 1. Excel-like Experience (But More Flexible)
- **Full basic operations**: Font styles, cell formatting, and image insertion (supports inline cell images, floating images, and table background images. Inline images can be aligned top, bottom, left, or right — a feature not available in Excel);
- **Full shortcut support**: Arrow keys, Enter, and Tab work just like you expect;
- **Smart helpers**: Auto-fill and formula calculation (when a formula cell is selected, the formula and related cell names are clearly displayed, providing a better experience than Excel).

### 2. Optimized for Data Entry
- Two-way binding between fields and cells for efficient data linkage;
- Built-in inputs: dropdown selection, auto-complete dropdown, date picker, and checkbox;
- Support for custom rules such as cell rounding and personalized dropdown logic.

### 3. Print Template Design
- Auto field filling and automatic table body calculation for complex templates;
- Works seamlessly with report generation components to create various structured and unstructured reports quickly.

## 📸 Screenshots
> Core feature previews

| Feature Scene   | Screenshot |
|-----------------|------------|
| Table Editor    | ![Table Editor](docs/screenshots/2.png) |
| Entry Interface | ![Entry Interface](docs/screenshots/1.png) |

## 📂 Project Structure
| Directory / File       | Description |
|------------------------|-------------|
| `Code/`                | Main code directory |
| `Code/src/`            | Source code (development core) |
| `Code/dist/`           | Packaged output files |
| `Code/testEditor_design.html` | Test page for source code |
| `Code/testEditor_min.html`    | Test page for minified build |
| `Code/testFillData.html`      | Test page for data filling |
| `docs/`                | Documentation and screenshots |
| `Pack/`                | JS packaging script project |

## 🚀 Quick Start
### 1. Build & Package
Run the Python packaging script to generate production-ready JS files:
```bash
python.exe ./Pack/pack_js_cli.py ./Code
```

### 2. Development & Testing
No complex environment setup needed. Simply open the test pages in your browser:
1. `Code/testEditor_design.html` — test full source functions;
2. `Code/testEditor_min.html` — verify the minified build;
3. `Code/testFillData.html` — test data filling and field binding.

## 📄 License
This project is licensed under the **MIT License**.
You may freely use, modify, and distribute it for commercial or non-commercial purposes, as long as you keep the original copyright and license notice.

## 📞 About PumpkinDev
PumpkinDesigner is a core component of the PumpkinDev ecosystem.
For more reporting solutions, visit: [www.pumpkindev.com](www.pumpkindev.com).