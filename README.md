# Autumn Design System

A personal design system for all products and experiences built under **Autumn Alexander's** business portfolio — Evergreen Real Estate Ventures, OpsHQ, CloserDojo, ListingHawk, and beyond.

---

## Philosophy

> **"Make it feel like a decision was made."**

Every element should feel intentional. No default browser styling, no placeholder thinking, no lazy patterns. The bar is: would this ship at a Fortune-500 SaaS product? If not, we iterate.

### Influences

| System | What we take from it |
|---|---|
| [Vercel Geist](https://vercel.com/geist) | Aesthetic restraint, minimal chrome, clean typography |
| [Material Design 3](https://m3.material.io/) | Tonal color system, dynamic color, role-based palettes |
| [Atlassian Design System](https://atlassian.design) | Documentation structure, token naming, accessibility |
| [GitLab Pajama](https://design.gitlab.com) | Illustration guidelines, density, data-heavy UI patterns |

### Core principles

1. **Systematic over ad-hoc** — every color, space, and radius comes from a token, never hardcoded
2. **Dark mode is not an afterthought** — both modes are designed simultaneously
3. **Density with breathing room** — data-rich but never cramped
4. **Premium defaults** — components should look great out of the box without customization
5. **Named for what it means, not how it looks** — `danger` not `red`, `muted` not `gray-400`

---

## Structure

```
autumn-design-system/
├── foundations/          # Tokens: color, type, space, radius, shadow, motion
├── components/           # Reusable UI components with usage guidelines
├── patterns/             # Assembled patterns: cards, tables, sheets, modals
├── brand/                # Logo, wordmarks, photography direction, illustration style
└── implementations/      # App-specific overrides and component mappings
    ├── opshq/
    ├── closerdojo/
    └── listinghawk/
```

---

## Quick links

- [Color system](foundations/color.md)
- [Typography](foundations/typography.md)
- [Spacing & layout](foundations/spacing.md)
- [Elevation & shadow](foundations/elevation.md)
- [Motion](foundations/motion.md)
- [Components](components/)
- [Card patterns](patterns/cards.md)
- [Form patterns](patterns/forms.md)
- [Brand guidelines](brand/guidelines.md)
