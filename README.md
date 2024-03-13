# Radio Norn (back-end) 📻

This is here that Norn's magic is made. Norn's back-end is a historical API, with a database seeded by myself.

## 🛣️ Routes 
- `GET /century` returns the list of events for any century (ex. /16 for the 16th century)

## 🏓 Format
- 📅 `Event` object : 
    - `id`: number
    - `title`: string
    - `date`: string
    - `description`: string
    - `coordinates`: string
    - `centuryId`: number
    - `countryId`: number
    - `country`: Country


- 🌍 `Country` object : 
    - `id`: number
    - `name`: string (unique)
    - `flag`: string (optional)
    - `events`: Event[]

## ⚒️ TODO
- [x] Have at least 100 events (for prod)
- [ ] `GET /country` route
- [x] Tokens (for prod)
- [ ] `POST GET /users` for authentication (v2)
- [ ] `PUT /event` route for updating existing events
- [x] `POST /event` to create new event
- [ ] Enhance country object with description for ex.