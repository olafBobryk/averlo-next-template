# Dashboard entity renderer policy

- Renderers receive resolved domain facts or presentation view models and never
  fetch sessions, organizations, capabilities, or persistence themselves.
- Import the entity-owned presentation factory directly. Do not add a global
  renderer or presentation registry.
- Loading states belong to their live component as `Component.Skeleton` and must
  preserve the live geometry.
- Entity deletion uses the shared confirmation primitive, includes impacts and
  warnings where useful, rolls optimistic state back on failure, and returns
  `false` to keep a failed confirmation open.
- Entity deletion completion declares `refresh` for collection actions or
  `navigate` for detail exits. Navigation owns one push or replacement and must
  not refresh the deleted detail route. Returned and thrown failures both roll
  optimistic state back.
- Use the shared table, detail, property-list, Markdown, selector, More-menu,
  state, toast, and modal components before creating entity-local substitutes.
