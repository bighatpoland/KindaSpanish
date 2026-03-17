# Kinda Spanish Sprint Plan

## Sprint 1: Real Phone-Testable Session Core
- Goal: make one daily session usable on a phone from start to finish.
- Scope:
  - structured lesson audio model on `Scenario`
  - lesson audio playback helper with file-or-TTS fallback
  - explicit speech capture hook for mobile browsers
  - typed local session persistence behind a repository
  - session UI wired to the new flow
- Done when:
  - the user can play prompt audio
  - record or type a reply
  - get feedback
  - leave and come back without losing the session draft

## Sprint 2: Real Review + Stronger Session Evaluation
- Goal: turn review into a real learning loop and make session feedback less mock-like.
- Scope:
  - real review queue model
  - review outcomes: `again`, `good`, `easy`
  - recompute `nextReviewAt`
  - action-first review screen
  - stronger evaluation boundary for session attempts
  - feed review items from actual session output
- Done when:
  - `Review` stops being static
  - session attempts can create or update review items
  - the user sees phrases due now and can clear them

## Sprint 3: First Real Arcade + Shared Progress
- Goal: ship the first real game and connect it to learning progress.
- Scope:
  - implement `Catch the Chunk`
  - add score, accuracy, XP, and coins from real gameplay
  - connect arcade content to scenarios and review items
  - tighten home/review/arcade around real data
  - prepare repository boundary for Supabase-backed persistence
- Done when:
  - `Arcade` contains at least one playable game
  - rewards come from real runs
  - home screen reflects actual progress rather than only mock values
