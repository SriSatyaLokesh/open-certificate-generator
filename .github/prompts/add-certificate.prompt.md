Add a new attendee certificate JSON file in `data/` using this workflow.

## Your goals

1. Ask the user for required details.
2. Derive a valid `certificate_id` from email.
3. Create exactly one new file in `data/`.
4. Ensure JSON format and naming are valid.

## Ask these questions first (if missing)

- Full name
- Registered email
- Workshop title
- Date (human-readable, example `April 5, 2026`)
- ISO date (example `2026-04-05`)
- Description sentence

If the user gives only email + name, ask follow-up questions for missing required fields.

## Derive `certificate_id`

Transform email in this exact order:

1. lowercase
2. `+` -> `-plus-`
3. `@` -> `-at-`
4. `.` -> `-`
5. remove remaining non `[a-z0-9-]`

Use that exact value for:
- JSON `certificate_id`
- filename: `data/{certificate_id}.json`

## Validate before writing

- `certificate_id` matches filename (without `.json`)
- `date_iso` is `YYYY-MM-DD`
- JSON has valid syntax
- File does not already exist (if it exists, ask user whether to overwrite)

## File template

```json
{
  "certificate_id": "<derived-id>",
  "name": "<full-name>",
  "email": "<email>",
  "workshop": "<workshop-title>",
  "date": "<date-human>",
  "date_iso": "<date-iso>",
  "description": "<description>"
}
```

## Behavior requirements

- Keep 2-space indentation.
- Keep ASCII unless user input contains unicode.
- Do not change other files unless user asks.
- After creating the file, report:
  - filename
  - certificate URL format: `/?id=<certificate_id>`

## Context references

- `README.md`
- `data/jane-doe-at-example-com.json`
