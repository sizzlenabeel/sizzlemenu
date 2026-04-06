

## Add Sizzle Homepage / Landing Page

### Overview
Create a new homepage at `/` featuring brand messaging and a chef gallery with the uploaded photos.

### Chef-to-Photo Mapping
| Chef | Photo file |
|---|---|
| Chef Cherry (Jamaica) | `faaf9ab1-9f7f-48b1-be60-306207fc46a7.png` |
| Chef Kristian & Simon (Sweden / East Asia) | `9d2a03f8-d8e0-4271-b8b0-c38d3508e3fb.png` |
| Chef Elle (Philippines) | `6a2b64a6-4fca-46b1-ab1c-9b4dd0dcd05a.png` |
| Chef Ivet (Spain / Turkey) | `4b227686-9b1d-496e-a565-6f123e6dc32c.png` |
| Chef Adam (Morocco) | `WhatsApp_Image_2026-04-06_at_6.29.23_PM.jpeg` |
| Chef Chinyere (Nigeria) | `chinyere.png` |

### Changes

**Copy 6 chef photos** to `src/assets/chefs/` and import them in the homepage component.

**Create `src/pages/Home.tsx`**
- Hero section with "Welcome to Sizzle!" heading and the brand description text
- "Our Chefs" section below with a responsive grid (2 cols mobile, 3 cols desktop)
- Each chef card: circular or rounded photo, name, and origin description
- Clean, minimal design consistent with the existing app style

**Update `src/App.tsx`**
- Add `<Route path="/" element={<Home />} />` so the root URL serves the homepage
- Keep `*` route as NotFound

### Files
| File | Action |
|---|---|
| `src/assets/chefs/*.png/jpg` | Copy 6 uploaded photos |
| `src/pages/Home.tsx` | New homepage component |
| `src/App.tsx` | Add `/` route |

