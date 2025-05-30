# Drizzle ORM Types

This directory contains TypeScript interfaces for the Drizzle ORM schema defined in `/lib/drizzle/schema.ts`.

The types are organized into logical groups:
- `user-types.ts` - User authentication and permission types
- `family-types.ts` - Family structure and member types
- `entity-types.ts` - Entity and investment types
- `property-types.ts` - Property and property-related types
- `financial-types.ts` - Financial types like credit facilities, cash flows, etc.
- `document-types.ts` - Document types

All types are re-exported from the `index.ts` file, so you can import them from:

```typescript
import { User, Property, CreditFacility } from '@/lib/drizzle/types';
```

Or import all types:

```typescript
import * as DrizzleTypes from '@/lib/drizzle/types';
```
