## Add "Buy Now" / "Köp nu" Swish Button to Dish Cards

### Rules for Showing the Button


| Page                           | Food            | Snacks          |
| ------------------------------ | --------------- | --------------- |
| `/storytel`                    | **No button**   | **Show button** |
| `/sizzle` (and any other page) | **Show button** | **Show button** |


### Swish URL Construction

Base: `https://app.swish.nu/1/p/sw/?sw=1234355145&amt={price}&cur=SEK&msg={msg}&edit=amt,msg&src=qr`

- `amt` = dish price as a number
- `msg` = `{locationName}_{dishName}` with spaces removed, truncated to 50 characters

Example: location "Sizzle", dish "Grillad Kyckling" → `msg=Sizzle_GrilladKyckling`

### Changes

`**src/components/menu/DishCard.tsx**`

Add two new props:

- `showBuyButton?: boolean` (default `false`)
- `locationName?: string`

When `showBuyButton` is true and `locationName` is provided:

- Build the Swish URL using dish price and a sanitized `{location}_{dishName}` string (no spaces, max 50 chars)
- Render a "Köp nu" / "Buy now" button (language-aware) in the card header row, next to the chevron
- Button opens the URL in a new tab (`window.open` / `<a target="_blank">`)
- The use case is in the phone and the url opens an app swish in the phone.
- Button click must stop propagation so it doesn't toggle the collapsible

`**src/pages/Storytel.tsx**`

Pass to DishCard:

- `showBuyButton={dish.category === 'snacks'}` — only snacks get the button
- `locationName="Storytel"`

`**src/pages/Sizzle.tsx**`

Pass to DishCard:

- `showBuyButton={true}` — all items get the button
- `locationName="Sizzle"`

### Files to Modify

- `src/components/menu/DishCard.tsx` — add buy button with Swish URL logic
- `src/pages/Storytel.tsx` — pass `showBuyButton` and `locationName`
- `src/pages/Sizzle.tsx` — pass `showBuyButton` and `locationName`