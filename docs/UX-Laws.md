---
name: laws-of-ux
description: Reference and teaching guide for 36 laws, principles, and effects of UX and interface design (Gestalt, Hick's, Fitts's, Jakob's, Miller's, Tesler's, Peak-End, Doherty, and more). Use whenever the user asks about UX laws, design principles, or psychology of design, wants a law explained or compared, wants flashcards or a quiz on them, or wants a UI, flow, wireframe, or screen reviewed or designed against these principles, even if they never say "laws of UX."
---

# Laws of UX

A reference of 36 laws, grouped by theme. Each entry gives the core idea and what to do with it in a design.

## How to use this skill

- **Explaining a law:** Give the definition, one concrete UI example, and a "so what" for designers. Keep it short unless asked to go deeper.
- **Reviewing a design:** Pick only the 3 to 6 laws that actually apply. For each, say what the design does, whether it helps or hurts, and one specific fix. Do not run through all 36.
- **Quizzing or flashcards:** Use the entries below. Mix definition-to-name and scenario-to-law questions.
- **Comparing laws:** Many overlap (Hick's vs. Choice Overload, Miller's vs. Working Memory, Proximity vs. Common Region). Say where they differ.
- **Misattribution:** These are heuristics, not strict scientific laws. Some, like Miller's 7 ± 2, are often oversimplified. Mention that when it matters.
- The list is not official or complete. If the user names a law not listed (e.g. Anchoring Effect, Zipf's Law), treat it normally.

## Gestalt / perception

1. **Law of Proximity**: Objects close together are perceived as a group. *Use:* Use spacing to group related fields and separate unrelated ones.
2. **Law of Similarity**: Elements that look alike (color, shape, size) are seen as related. *Use:* Style same-function elements consistently, like all links or all primary buttons.
3. **Law of Uniform Connectedness**: Elements visually linked by lines, colors, or frames are seen as more related than unlinked ones. *Use:* Connect steps in a stepper or items in a timeline.
4. **Law of Common Region**: Elements inside a shared boundary are perceived as a group. *Use:* Cards, panels, and boxes group content without extra labels.
5. **Law of Closure**: The mind fills in gaps to perceive a complete shape. *Use:* Simplified logos and partial progress rings still read clearly; carousels peeking at the next item signal scrollability.
6. **Figure/Ground**: People separate a scene into a focal object (figure) and its background (ground). *Use:* Modals dim the background so the dialog is the clear figure.
7. **Law of Prägnanz**: Ambiguous or complex shapes are perceived in their simplest form. *Use:* Prefer simple, clean shapes and layouts that need little processing.

## Attention and memory

8. **Von Restorff Effect**: When several similar items are present, the one that differs is remembered. *Use:* Make the primary CTA visually distinct, but do not make everything stand out.
9. **Serial Position Effect**: People remember the first and last items in a series best. *Use:* Put key navigation items at the start and end of a menu.
10. **Zeigarnik Effect**: People remember unfinished or interrupted tasks better than completed ones. *Use:* Progress indicators and "complete your profile" prompts.
11. **Chunking**: Breaking information into meaningful groups makes it easier to process and remember. *Use:* Phone numbers, card numbers, sectioned forms.
12. **Working Memory**: Short-term memory holds a small amount of information for a short time. *Use:* Do not make users remember information from one screen to use on the next.
13. **Miller's Law**: The average person can hold about 7 ± 2 items in working memory. *Use:* Do not use "7 items" as a hard rule for menus; use it as a reminder to chunk and limit.
14. **Cognitive Load**: The mental resources needed to understand an interface are limited. *Use:* Remove unnecessary elements, steps, and decisions.
15. **Selective Attention**: Users focus on stimuli relevant to their goals and filter out the rest. *Use:* Keep goal-relevant content prominent; expect users to miss irrelevant elements.
16. **Banner Blindness**: Users ignore content that looks like advertising. *Use:* Do not style important content like an ad or place it in typical ad positions.

## Interaction and performance

17. **Fitts's Law**: Time to reach a target depends on its distance and size. *Use:* Make important touch targets large and close; put them at screen edges or corners on desktop.
18. **Steering Law**: Time to move through a constrained path depends on its length and width. *Use:* Make nested dropdowns and slider tracks forgiving and wide.
19. **Hick's Law**: Decision time grows with the number and complexity of choices. *Use:* Reduce options, progressively disclose, highlight a recommended choice.
20. **Doherty Threshold**: Productivity soars when the system responds in under about 400ms. *Use:* Use skeleton screens, optimistic UI, and progress feedback when work takes longer.
21. **Flow**: Users are most immersed when challenge and skill are balanced and feedback is clear. *Use:* Avoid interruptions; scale difficulty gradually.

## Decisions and behavior

22. **Choice Overload**: Too many options lead to paralysis, regret, or abandonment. *Use:* Curate, filter, and set sensible defaults. Related to Hick's Law but about satisfaction and abandonment, not only speed.
23. **Default Effect**: People tend to stick with preselected options. *Use:* Choose defaults that serve users' interests; be careful with dark patterns.
24. **Cognitive Bias**: Mental shortcuts systematically distort perception and decisions. *Use:* Test with real users; do not assume users decide rationally.
25. **Peak-End Rule**: People judge an experience by its most intense moment and its end, not the average. *Use:* Invest in confirmation screens, success moments, and graceful error recovery.
26. **Goal-Gradient Effect**: Motivation increases as people get closer to a goal. *Use:* Show progress, and give a head start (e.g. pre-filled steps).
27. **Sunk Cost Fallacy**: People keep investing in something because of what they have already put in. *Use:* Be aware it can keep users engaged, but do not exploit it.

## Expectations and design principles

28. **Jakob's Law**: Users spend most of their time on other sites and expect yours to work the same way. *Use:* Follow familiar conventions unless there is a strong reason not to.
29. **Mental Model**: Users carry assumptions about how a system works, based on prior experience. *Use:* Close the gap between the user's model and the system's real behavior.
30. **Paradox of the Active User**: Users skip manuals and start using the product immediately, even if learning first would help. *Use:* Provide contextual, in-flow guidance instead of up-front tutorials.
31. **Aesthetic-Usability Effect**: Users perceive attractive designs as more usable. *Use:* Polish matters, but beauty can mask real usability problems in testing.
32. **Postel's Law**: Be liberal in what you accept and conservative in what you send. *Use:* Accept varied input formats (phone numbers, dates) and output consistent, clean data.
33. **Tesler's Law**: Every system has irreducible complexity that someone must handle. *Use:* Absorb complexity in the system rather than pushing it to the user, within reason.
34. **Occam's Razor**: Among competing solutions, the simplest that works is usually best. *Use:* Remove elements until nothing essential is lost.
35. **Pareto Principle**: Roughly 80% of effects come from 20% of causes. *Use:* Focus design effort on the few features and flows users rely on most.
36. **Parkinson's Law**: Tasks expand to fill the time available. *Use:* Set reasonable time limits, autofill, and shortcuts to speed up tasks.

## Common overlaps to watch for

| Pair | Difference |
|---|---|
| Hick's Law vs. Choice Overload | Hick's is about decision *time*; Choice Overload is about *satisfaction and abandonment*. |
| Working Memory vs. Miller's Law | Working Memory is the concept; Miller's Law is a specific (often oversimplified) capacity claim. |
| Proximity vs. Common Region | Proximity groups by spacing; Common Region groups by an enclosing boundary. |
| Common Region vs. Uniform Connectedness | Common Region uses a shared boundary; Uniform Connectedness uses a visible link or shared visual property. |
| Fitts's Law vs. Steering Law | Fitts's is point-and-click to a target; Steering is moving along a path. |
| Jakob's Law vs. Mental Model | Jakob's is about conventions across products; Mental Model is the user's internal picture of one system. |
