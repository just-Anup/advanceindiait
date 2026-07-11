# TeamSection Slider - Implementation Steps

- [x] Inspect existing TeamSection.jsx slider block boundaries.

- [ ] Replace only carousel/slider logic between `/* ================= SLIDER ================= */` and its closing div.

- [ ] Ensure card JSX remains byte-for-byte unchanged.
- [ ] Keep Appwrite fetching logic and `getImageUrl()` unchanged.
- [ ] Implement:
  - [ ] Responsive visible cards: 4/3/2/1
  - [ ] Infinite looping without flicker (duplicate items + index wrapping)
  - [ ] Smooth Framer Motion animation with snap-to-card
  - [ ] Left/right arrows centered vertically, floating over slider
  - [ ] Mouse drag + touch swipe
  - [ ] Auto-slide every 3–4s
  - [ ] Pause auto-slide while dragging and on hover
  - [ ] Resume after hover/drag end
  - [ ] Prevent accidental clicks while dragging
- [ ] Run lint/build if available.

