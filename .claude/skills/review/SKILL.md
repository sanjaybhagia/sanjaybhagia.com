---
name: review
description: Turn a raw braindump about something Sanjay read, watched, ate, visited, or bought into a published review on sanjaybhagia.com. Fires on unstructured dumps of opinion — "ate at X, the Y was great", "finished <book>, loved it", "that film was a waste of two hours", voice-note transcripts, photos with a caption. Handles drafting, canonical-link lookup, images, and the PR.
---

# Publishing a review

Sanjay dumps; you draft; he approves on his phone. The dump arrives with no structure —
often from a voice note, often while walking out of the place. Your job is to turn it into
a review that sounds like him, and to be honest about what he didn't tell you.

## Does this dump *want* to be a review?

He uses one always-on session for everything, so most of what he sends is **not** a review.

**It is a review** when he expresses a judgement about a specific thing he personally
consumed — a book, film, TV series, restaurant, place, or product. Past tense, first
person, an opinion attached.

**It is not a review** when it's:
- a blog post idea, or a paragraph he wants published as writing → that's a post, not a review
- a bug, a task, a "remind me to…" → do the thing, don't file a review
- a recommendation he received from someone else ("Priya says I should try X") → not his opinion
- something he's *about to* try → at most a `shelf: reading` entry with no verdict
- a link with no opinion attached → ask before assuming

**Ambiguous?** Ask, in one short question. Guessing wrong here means either a fabricated
opinion on his site or a lost thought — both worse than a five-second question.

**Multiple things in one dump** is normal ("book was great, the film adaptation was not").
Create one file per thing, one PR for the batch.

## Check for an existing entry first

**Always `ls src/content/reviews/` before writing anything.** Shelf items get filed long
before they're reviewed, so the thing he's reviewing very often already has a file — a book
he logged as `shelf: reading` weeks ago, now finished.

When a file for it exists, **edit that file in place**: add the `verdict`, the `oneLiner`,
any body, move `shelf` to `finished`, fill in facts he's now supplied. Keep its slug, its
`url`, and its original `date` unless he says when he actually finished it. Never create a
second file, never a `-2` slug. Match loosely — punctuation, subtitles and articles differ
("The Odyssey" vs "Odyssey"; "Maintenance" vs the full subtitle) — and if two candidates
look plausible, ask instead of guessing.

## The pipeline

1. Decide `kind` and `verdict` from what he actually said.
2. Look up the canonical link and any *verifiable* facts (see below).
3. Write the file to `src/content/reviews/<slug>.md`.
4. Handle any images.
5. Branch, commit, open a PR. Never commit to `master` — push to `master` deploys to production.
6. Reply with one line: what you filed, and the PR link.

## Schema

Full definition in `src/content.config.ts` — read it rather than trusting this summary.

```yaml
title: Ester                     # required
kind: restaurant                 # book | film | tv | restaurant | place | product
verdict: loved                   # loved | liked | fine | nope — omit if he didn't say
date: 2026-07-28                 # when he consumed it, not when he dumped it, if he said
creator: Andy Weir               # author / director / chef / maker — omit if n/a
location: Chippendale, Sydney    # "Suburb, City" — the suburb becomes a filter facet
url: https://…                   # canonical link, see below
oneLiner: …                      # the whole review for short entries
tags: [sydney, dinner]           # lowercase, hyphenated, reuse existing tags where possible
facts:                           # kind-specific, ordered, see below
  Where: Meagher St, Chippendale
images: []                       # see below
shelf: finished                  # books only: reading | listening | finished
draft: false
```

### Verdicts

Four words, no numbers: **loved / liked / fine / nope**. Map from his language, don't
invent precision he didn't offer. "Would go back" → liked at minimum. "Best thing I've
eaten this year" → loved. "It was alright" → fine. "Waste of money" → nope.

If he genuinely didn't render a verdict, **omit it**. That's a valid state, not a gap to fill.

**The verdict is the switch between a shelf item and a review.** With no verdict, an entry
appears only on `/reading` (books with a `shelf`), has no page of its own, and stays out of
`/reviews` and the reviews feed — `/reading` links it straight to its canonical page. Add a
verdict later and it gains a page, joins `/reviews` and the feed, and `/reading` flips its
link inward. So a half-read book is a one-line entry now and a review when he finishes it;
never invent a verdict to make it "complete".

A non-book with no verdict is invisible on the site — no shelf to sit on. Only file one if
he'll add a verdict soon; otherwise ask.

### Facts, by kind

Three or four per kind, all optional. Only include a row he gave you or that you verified.

| Kind | Facts keys, in this order |
|---|---|
| book | `Author`, `Finished`, `Format` (paper / ebook / audio — add `Narrator` for audio), `Publisher` |
| film | `Director`, `Year`, `Watched` (cinema / streaming service) |
| tv | `Creator`, `Season`, `Platform` |
| restaurant | `Where`, `Went`, `Order`, `Damage` |
| place | `Where`, `When`, `Effort` |
| product | `What`, `Since`, `Price` |

`Order` is the highest-value row on a restaurant review — it's the thing he'll re-read
before going back. Pull it from the dump whenever he named a dish.

## Links: canonical first

Primary link is the **canonical, official page** — publisher, studio, restaurant's own
site, manufacturer's product page. This matches what he already chose for `/reading`
(Stripe Press, navalmanack.com, W. W. Norton) and keeps readers out of storefronts.

Fallbacks when there is no usable canonical page:
- **Books** → Goodreads
- **Films and TV** → IMDb
- **Restaurants and places** → a Google Maps link built from the name + suburb
- **Products** → the manufacturer's page; if it's dead, omit rather than link a retailer

**Verify every link before writing it.** Search for it and confirm the page exists and is
the right thing. Never assemble a URL from a guessed ID — a fabricated IMDb `tt` number or
Goodreads book ID that 404s is worse than no link at all. If you cannot verify it, omit
`url` and say so in the PR body.

## Never fabricate

You may add facts that are **public, stable, and verifiable**: an author, a director, a
release year, a publisher, a restaurant's street and suburb, a narrator.

You may **never** invent facts about his experience:

- what he paid (`Damage`, `Price`)
- how many times he's been (`Went`)
- when he went, if he didn't say — use the dump's date
- who he was with
- dishes he didn't name
- an opinion, caveat, or recommendation he didn't express

If a fact isn't in the dump and isn't publicly verifiable, **the row just disappears.** A
review with four facts and a gap is honest; one with an invented price is a lie in his
voice on his domain. When something matters and is missing, ask in the PR body rather than
filling it.

## Voice

This is the part that decides whether the section is any good. The default failure of
agent-drafted content is inflating two honest sentences into three flabby paragraphs.

- **Keep his words.** If the dump is already a decent sentence, that sentence *is* the
  `oneLiner`. Tidy grammar, fix transcription noise, cut filler ("um", "like", "I dunno").
- **Keep his length.** A two-sentence dump becomes a two-sentence review. Do not write a
  body. Do not write a concluding paragraph. Do not write "Overall, …".
- **Never add opinions.** Not a hedge he didn't hedge, not a compliment he didn't pay, not
  a "though your mileage may vary".
- **No marketing register.** No "a masterclass in", "elevates", "a must-try", "hidden gem",
  "nestled in". If the dump says the bread was good, the review says the bread was good.
- **Write a body only when the dump is long enough to need one** — roughly, when he gave you
  more than one distinct thought. Then use his structure, not a template.
- Australian spelling and his register: plain, dry, a bit understated. Read two or three
  files in `src/content/reviews/` and a recent post in `src/content/blog/` before writing.

## Images

Photos usually arrive attached to the dump.

- Write them to `src/assets/reviews/<slug>/01.jpg`, `02.jpg`, … in the order he sent them.
  **Never** `public/images/` — those paths are load-bearing for SEO on old posts.
- Compress before committing: `sips -Z 2000 <file>` and re-encode to JPEG at ~80% quality.
  Screenshots and phone photos are routinely 5 MB and should land nearer 300 KB.
- Every image needs real `alt` text describing what's in it. If you can't tell what a photo
  shows, ask rather than writing "a photo of food".
- The first image becomes the index thumbnail — pick the most representative one if he
  didn't imply an order.
- Add a caption line only if he said something about the photos.

## Output: branch and PR

```bash
git checkout -b review/<slug>
# write files
git add src/content/reviews src/assets/reviews
git commit -m "Review: <Title>"
git push -u origin review/<slug>
gh pr create --title "Review: <Title>" --body "<see below>"
```

PR body must contain:
- the drafted `oneLiner` so it's readable from a phone notification
- **Assumptions** — anything you inferred rather than were told
- **Gaps** — facts you left out because he didn't provide them, phrased as questions he can
  answer by replying to the PR
- **Unverified** — any link you couldn't confirm

Then stop. He merges — merging to `master` is what publishes. Do not merge for him, and do
not push to `master`.

If he replies with changes ("shorter", "drop the wine line", "it was liked not loved"),
amend on the same branch and force-push; don't open a second PR.

## Worked examples

**1. Short restaurant dump, one photo**

> ate at ester in chippendale tonight, that blistered corn bread is worth the trip on its
> own. wine list a bit too clever. would definitely go back

```yaml
---
title: Ester
kind: restaurant
verdict: loved
date: 2026-07-28
location: Chippendale, Sydney
url: https://ester-restaurant.com.au/
oneLiner: The blistered corn bread alone is worth the trip. Wine list is a touch too clever, but I'll be back.
tags: [sydney, dinner]
facts:
  Where: Meagher St, Chippendale
  Order: Blistered corn bread
images:
  - src: ./../../assets/reviews/ester/01.jpg
    alt: Blistered corn bread, torn open
---
```

No body — he gave one thought. No `Damage` row, no `Went` row: he didn't say. `Order` holds
only the bread, because that's the only dish he named.

**2. Verdict-free book mention**

> started the stewart brand maintenance book

```yaml
---
title: "Maintenance: Of Everything, Part One"
kind: book
creator: Stewart Brand
shelf: reading
date: 2026-07-30
url: https://press.stripe.com/maintenance-part-one
tags: [non-fiction]
facts:
  Publisher: Stripe Press
---
```

No `verdict`, no `oneLiner` — he hasn't formed one. Shows on `/reading`, not in the
reviewed feed.

**3. Voice-note transcript, negative**

> um so we went to that place in newtown, casa verde i think, and honestly like four small
> plates ninety minutes and I still stopped for a kebab on the way home. room was so loud.
> not going back

```yaml
---
title: Casa Verde
kind: restaurant
verdict: nope
date: 2026-07-05
location: Newtown, Sydney
oneLiner: Four small plates, ninety minutes, and I still stopped for a kebab on the way home. The room sounds like an airport. Not going back.
tags: [sydney]
facts:
  Where: Newtown, Sydney
---
```

Filler stripped, his three complaints kept in his order, nothing added. `url` omitted — the
restaurant's own site could not be verified. Flag that in the PR.
