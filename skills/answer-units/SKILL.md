# Structure content as answer units

> AIPUSH agent skill · Category: Structured Data · Slug: `answer-units`

Question-style headings followed by concise, direct answers are the format AI engines quote most. Walls of prose are harder to extract and cite.

## Why it matters

Question-style headings followed by concise, direct answers are the format AI engines quote most. Walls of prose are harder to extract and cite.

## How to detect

Look for multiple question-style `<h2>`/`<h3>` headings each followed by a short direct answer.

## How to implement

Structure key content as Q→A units:

```html
<h2>What is answer engine optimization?</h2>
<p>Answer engine optimization (AEO) is the practice of structuring a site so AI assistants can read and cite it. It focuses on machine-readable signals and concise answers.</p>

<h2>How long does it take?</h2>
<p>Most fixes are technical and can ship in a day; citation improvements typically appear over a few weeks.</p>
```

Lead each answer with the direct response in the first sentence.

## How to verify

Page has ≥2 question-style headings each followed by a concise answer paragraph.

## References

- https://schema.org/Question

---

Part of the [AIPUSH agent skills catalog](https://aipush.app/.well-known/agent-skills/index.json). Scan your site free at https://aipush.app.
