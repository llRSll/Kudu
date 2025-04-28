# Kudu Database Relationships

This document outlines the key relationships between tables in the Kudu database, focusing on Users, Roles, Families, and related entities.

## Core User and Role Management

```mermaid
erDiagram
    Users ||--o{ UserRoles : "has many"
    Roles ||--o{ UserRoles : "assigned to many"
    Roles ||--o{ RolePermissions : "has many"
    DbPermissions ||--o{ RolePermissions : "assigned to many"
    
    Users {
        uuid id PK
        string email UK
        string first_name
        string surname
        string role "deprecated"
        string status
        timestamp created_at
        timestamp updated_at
    }
    
    Roles {
        uuid id PK
        string name UK
        string description
        timestamp created_at
        timestamp updated_at
    }
    
    UserRoles {
        uuid user_id PK,FK
        uuid role_id PK,FK
        timestamp assigned_at
    }
    
    DbPermissions {
        uuid id PK
        string name UK
        string description
        timestamp created_at
        timestamp updated_at
    }
    
    RolePermissions {
        uuid role_id PK,FK
        uuid permission_id PK,FK
        timestamp created_at
    }
```

## Family Management Structure

```mermaid
erDiagram
    Users ||--o{ FamilyMembers : "belongs to many"
    Families ||--o{ FamilyMembers : "has many"
    FamilyRoles ||--o{ FamilyMembers : "assigned to many"
    
    Users {
        uuid id PK
        string email UK
        string first_name
        string surname
    }
    
    Families {
        uuid id PK
        string name
        timestamp created_at
        timestamp updated_at
    }
    
    FamilyMembers {
        uuid id PK
        uuid user_id FK
        uuid family_id FK
        uuid family_role_id FK
        timestamp created_at
        timestamp updated_at
    }
    
    FamilyRoles {
        uuid id PK
        string name UK
        string description
        timestamp created_at
        timestamp updated_at
    }
```

## Complete Entity Relationships

```mermaid
erDiagram
    Users ||--o{ UserRoles : "has many"
    Roles ||--o{ UserRoles : "assigned to many"
    Users ||--o{ FamilyMembers : "belongs to many"
    Families ||--o{ FamilyMembers : "has many"
    FamilyRoles ||--o{ FamilyMembers : "assigned to many"
    Users ||--o{ Entities : "owns"
    Families ||--o{ Entities : "owns"
    Entities ||--o{ EntityRelationships : "parent in"
    Entities ||--o{ EntityRelationships : "child in"
    Users ||--o{ Investments : "owns"
    Families ||--o{ Investments : "owns"
    Entities ||--o{ Investments : "has"
    Entities ||--o{ Properties : "owns"
    Users ||--o{ Properties : "owns"
    Investments ||--o{ Properties : "contains"
    
    Users {
        uuid id PK
        string email UK
        string first_name
        string surname
        string role "deprecated"
        string status
    }
    
    Roles {
        uuid id PK
        string name UK
        string description
    }
    
    UserRoles {
        uuid user_id PK,FK
        uuid role_id PK,FK
    }
    
    Families {
        uuid id PK
        string name
    }
    
    FamilyMembers {
        uuid id PK
        uuid user_id FK
        uuid family_id FK
        uuid family_role_id FK
    }
    
    FamilyRoles {
        uuid id PK
        string name UK
        string description
    }
    
    Entities {
        uuid id PK
        string name
        string type
        uuid user_id FK
        uuid family_id FK
    }
    
    EntityRelationships {
        uuid id PK
        uuid parent_entity_id FK
        uuid child_entity_id FK
        string relationship_type
        numeric ownership_percentage
    }
    
    Investments {
        uuid id PK
        string investment_type
        uuid user_id FK
        uuid family_id FK
        uuid entity_id FK
    }
    
    Properties {
        uuid id PK
        string name
        uuid entity_id FK
        uuid user_id FK
        uuid investment_id FK
    }
```

## Key Business Flows

### User Role Assignment Flow

```mermaid
flowchart TB
    User["User (Admin, Tax Advisor, etc.)"]
    UserRoles["User Roles Junction Table"]
    Roles["Application Roles"]
    Permissions["Permissions"]
    RolePermissions["Role Permissions Junction"]
    
    User -->|"has many"| UserRoles
    Roles -->|"assigned to many"| UserRoles
    Roles -->|"has many"| RolePermissions
    Permissions -->|"assigned to many"| RolePermissions
    
    subgraph "Effective User Permissions"
        User -->|"has through"| Permissions
    end
```

### Family Membership Flow

```mermaid
flowchart TB
    User["User"]
    FamilyMember["Family Member Junction"]
    Family["Family"]
    FamilyRole["Family Role (Parent, Child, etc.)"]
    
    User -->|"is member via"| FamilyMember
    Family -->|"has members via"| FamilyMember
    FamilyRole -->|"assigned in"| FamilyMember
    
    subgraph "Family Context"
        User -->|"belongs to"| Family
        User -->|"has role in"| FamilyRole
    end
```

### Data Ownership and Access Flow

```mermaid
flowchart TB
    User["User"]
    Role["Role"]
    Family["Family"]
    Entity["Entity (Company, Trust)"]
    Investment["Investment"]
    Property["Property"]
    
    User -->|"has"| Role
    User -->|"member of"| Family
    User -->|"owns"| Entity
    Family -->|"owns"| Entity
    Entity -->|"has"| Investment
    Entity -->|"owns"| Property
    
    subgraph "Access Control"
        Role -->|"determines access to"| Entity
        Role -->|"determines access to"| Investment
        Role -->|"determines access to"| Property
    end
    
    subgraph "Contextual Access"
        Family -->|"provides context for"| Entity
        Family -->|"provides context for"| Investment
        Family -->|"provides context for"| Property
    end
```

## Implementation Notes

1. The `role` field in the `Users` table is deprecated and will be removed in a future update. User roles are now managed entirely through the `UserRoles` junction table.

2. The `FamilyRoles` table provides a structured approach to defining family roles, replacing the previous text-based approach in the `FamilyMembers` table.

3. The diagram shows how:
   - A user can have multiple application roles (Admin, Tax Advisor, etc.)
   - A user can belong to multiple families
   - Each family membership can have a specific role (Parent, Child, etc.)
   - Entities, investments, and properties can be owned by users or families
   
4. Access control is implemented through a combination of:
   - Application roles and permissions (RBAC)
   - Family membership (contextual access)
   - Entity, investment, and property ownership (data association)
