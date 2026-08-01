# Finance Mobile

Aplicación móvil Expo 54 + React Native + TypeScript + Expo Router.

## Desarrollo

```bash
npm run dev:mobile
```

## Estructura

```
mobile/
├── app/                 # Expo Router screens
├── components/          # Componentes reutilizables
├── hooks/               # Custom hooks
├── stores/              # Zustand stores
├── services/            # API / SecureStore / offline
├── theme/               # Design tokens
└── utils/               # Helpers internos móviles
```

## Notas

- Depende de `packages/shared` para tipos.
- Alias `@/*` apunta a `src/*`.
- Seguridad usa `expo-secure-store`, no `AsyncStorage`.
- Estilos con StyleSheet nativo + design tokens.