# Nour Eldin Khater — Portfolio

Personal portfolio site for Nour Eldin Khater, Data Analyst (Cairo, Egypt).

**Live:** https://nour2303.github.io

## Pages

- `index.html` — home: hero, key stats, featured projects
- `about.html` — background, education, experience, method
- `projects.html` — project overview, linking to three case studies:
  - `project-amazon.html` — Amazon Sales Analysis (SQL, Excel, Power BI, 130K+ rows)
  - `project-hotels.html` — Hotel Reputation Analysis (SQL, Power BI, AI text mining, 33,800 reviews)
  - `project-bikes.html` — Bike Sales Profitability Audit (Excel, 113K rows)
- `insights.html` — short written insights from the projects
- `skills.html` — grouped toolkit
- `contact.html` — email, LinkedIn, GitHub, CV download

## Stack

Plain HTML, CSS and JavaScript — no frameworks, no build step. Fonts from Google
Fonts (Inter, Space Grotesk).

The dashboard images in `assets/img/` are illustrative SVG previews; to use real
dashboard screenshots, replace them (keeping 16:9 proportions) and update the
`<img>` `src` attributes if the file extensions change.

## Local preview

Any static server works, e.g.:

```
npx http-server -p 8137 .
```

Then open http://localhost:8137
