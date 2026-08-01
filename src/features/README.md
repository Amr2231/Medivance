# Features (feature-based architecture)

Each folder is a **business domain**, not a technical layer.

```
features/<name>/
  api/          # HTTP calls only
  services/     # mapping + orchestration
  actions/      # Next.js server actions
  hooks/        # client React Query / form hooks
  components/   # UI for this feature
  validation/   # feature-specific zod (or re-export shared)
```

Routes stay in `app/<role>/` and should only compose feature exports.

| Feature        | Status                                      |
|----------------|---------------------------------------------|
| `settings`     | Complete — admin + doctor                   |
| `doctor`       | Complete — moved from `app/doctor`          |
| `admin`        | Partial — settings unified; users in `app`  |
| `receptionist` | Partial — migrate incrementally             |
