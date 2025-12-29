- In all interactions and commit messages, be extremely concise and sacrifice grammar for the sake of concision.

## PR Guidelines
Title: <type>: <short desc> (max 50 chars)
Types: feat, fix, refactor, docs, test, chore
Description:
- Concise summary
- Bullet changes if multiple

## Commit Guidelines
Format: <type>: <what> (imperative, max 50 chars)

Examples:
- feat: add user auth endpoint
- fix: null check on profile load
- refactor: extract validation util
- docs: update readme setup steps

Rules:
- Atomic commits—1 logical change each
- No "WIP" or "fix stuff" msgs
- Body optional, use for *why* not *what*

## PR Comments

<pr-comment-rule>
When I say to add a comment to a PR with a TODO in it, use "checkbox" markdown format to add the TODO. For instance:

<example>
- [ ] A description of the to-do goes here
</example>
</pr-comment-rule>

## GitHub

- Your primary method for interacting with GitHub should be the GitHub CLI.

## Plans

- At the end of each plan, give me a list of unresolved questions to answer, if any. Make the questions extremely concise. Sacrifice grammar for the sake of concision.
