---
description: Security assessment for Python package installs and imports
applyTo: "**/*.py,**/requirements*.txt,**/pyproject.toml,**/setup.py,**/Pipfile"
---

# Python Package Security Assessment

Whenever you install a Python package (e.g., via `pip install`, adding to `requirements.txt`, `pyproject.toml`, etc.) or add a new `import` or `from ... import` statement in a Python file, provide a **security assessment** the **first time** that package is encountered in the session.

## Assessment format

For each new package, briefly cover:

1. **Package legitimacy** – Is this a well-known, widely-used package? Does the name look like a typosquat or close misspelling of a popular package (e.g., `reqeusts` vs `requests`, `numpay` vs `numpy`)?
2. **PyPI existence check** – Flag if the package name is unusual, obscure, or could be hallucinated. When in doubt, note that the user should verify it exists on https://pypi.org before installing.
3. **Maintainer & popularity signals** – Mention download counts, GitHub stars, or known maintainers if known from training data.
4. **Known vulnerabilities** – Note any well-known CVEs or security issues if applicable.
5. **Supply-chain risk** – Flag any concerns about the package being a likely target for dependency confusion, typosquatting, or malicious takeover.

## Example

> 📦 **Security assessment for `httpx`**
> - ✅ Legitimate, widely-used HTTP client library (encode/httpx on GitHub, millions of weekly downloads)
> - ✅ No known critical CVEs at time of training
> - ✅ Low supply-chain risk; well-maintained by a reputable team
> - ⚠️ Verify the exact spelling (`httpx`, not `http-x` or `htpx`) on PyPI before installing

Always err on the side of caution — if a package name seems unusual or you're not confident it exists, say so explicitly.
