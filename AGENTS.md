<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture

- The app is a single dashboard page composed at `src/routes/index.tsx` from components in `src/components/`; all DummyJSON API access goes through `src/services/postsApi.ts` using browser fetch — no server functions, no auth, no API keys.
- Draft generation is template-based logic in `src/utils/contentGenerator.ts`; the UI must never claim it uses an AI model or external AI API.
