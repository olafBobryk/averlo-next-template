# Folder: `src/components/mount`

Client-only singleton mounts for global hosts and app-level browser
coordination. They are infrastructure, not public catalogue owners.

## Structure

- Global hosts mount once, high in the app tree. Feature code does not recreate
  modal, toast, loading, validation or scroll host boundaries; use host
  configuration or a portal target for exceptional placement.
- `LoadingScreenMount` is the sole owner of the app-ready signal; overlay focus
  restoration depends on the shared host model staying intact.
