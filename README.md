# 🎭 หลุดปาก (Loodpak) — The Forbidden Word Social Game

[![Next.js 16](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase Realtime](https://img.shields.io/badge/Supabase-Realtime-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![LiveKit WebRTC](https://img.shields.io/badge/LiveKit-WebRTC-brightgreen?style=for-the-badge&logo=livekit)](https://livekit.io/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

**หลุดปาก (Loodpak)** is a high-octane, real-time voice chat social game where conversation is your weapon—and your biggest weakness. Players must engage in natural dialogue while avoiding a secret "forbidden word" assigned to them by their rivals. 

---

## ✨ Premium Features

- **🎙️ Crystal Clear Voice Chat**: Sub-millisecond latency voice communication powered by LiveKit WebRTC infrastructure.
- **⚡ Instantaneous Sync**: Every "GOTCHA!" and word submission is broadcasted in real-time across all clients using Supabase CDC.
- **🧠 Fair-Play Algorithm**: Implements a robust **Derangement Shuffle** to ensure no player ever receives their own word.
- **🔇 Smart Orchestration**: Automated game state management, including auto-muting for eliminated players.
- **🎨 Comic-Style UI**: A vibrant, high-fidelity interface with fluid animations and custom "comic-shadow" effects.

---

## 🎮 How to Play

1. **The Lobby**: Create/Join a room with a 6-character code.
2. **The Draft**: Every player submits one "forbidden word" for someone else.
3. **The Assignment**: The system shuffles words. You see everyone's word except your own (`???`).
4. **The Game**: Talk naturally. Try to bait others into saying their word.
5. **GOTCHA!**: If someone slips up, hit the button! Last survivor wins.

---

## 🏗️ Technical Architecture

### 1. System Infrastructure
Loodpak uses a "State-as-a-Service" model where Supabase acts as the single source of truth for game state, and LiveKit manages high-concurrency media streams.

```mermaid
graph TD
    classDef frontend fill:#0070f3,stroke:#fff,stroke-width:2px,color:#fff;
    classDef logic fill:#7c3aed,stroke:#fff,stroke-width:2px,color:#fff;
    classDef infrastructure fill:#10b981,stroke:#fff,stroke-width:2px,color:#fff;

    subgraph "Application Layer (Next.js 16)"
        A[App Router]:::frontend
        B[useRoom Hook]:::logic
        C[LiveKit Components]:::frontend
    end
    
    subgraph "Service Layer"
        D[Supabase Database]:::infrastructure
        E[LiveKit SFU]:::infrastructure
        F[Edge Functions]:::logic
    end
    
    subgraph "Communication Fabric"
        G[Postgres Realtime]:::infrastructure
        H[WebRTC Voice/Data]:::logic
    end
    
    A -->|Action| D
    B -->|Subscribe| G
    G -->|Broadcast| B
    C -->|Stream| E
    E -->|Broadcast| H
    H -->|Deliver| C
    F -->|Auth/Logic| E
```

### 2. Game Lifecycle (State Transitions)
The game moves through strictly controlled states to ensure data integrity during word assignment and elimination.

```mermaid
stateDiagram-v2
    direction LR
    [*] --> Lobby: Create Room
    Lobby --> Drafting: Start Game
    Drafting --> Playing: Words Assigned (Derangement)
    Playing --> Finished: Winner Decided
    Finished --> Lobby: Reset Room
    
    state Lobby {
        [*] --> Waiting
        Waiting --> Ready: N > 1 Player
    }
    
    state Drafting {
        [*] --> Submitting
        Submitting --> Assigning: All Words In
        Assigning --> [*]: Success
    }
    
    state Playing {
        [*] --> Chatting
        Chatting --> Eliminated: "GOTCHA!"
        Eliminated --> Chatting: Auto-Muted
    }
```

### 3. Real-time Data Flow (Sequence)
How the "GOTCHA!" moment works across the stack:

```mermaid
sequenceDiagram
    autonumber
    participant P as Player A (Observer)
    participant S as Supabase (State)
    participant L as LiveKit (Voice)
    participant T as Player B (Target)
    
    P->>S: Click "GOTCHA!" (Update is_eliminated: true)
    S-->>P: Broadcast Sync (Real-time)
    S-->>T: Broadcast Sync (Real-time)
    
    Note over T: Client recognizes elimination
    T->>L: Close Mic Stream
    L-->>P: Audio Stream Terminated for T
```

### 4. Database Entity Relationship (ERD)
Our schema is optimized for Postgres replication and cascading deletions.

```mermaid
erDiagram
    ROOMS ||--o{ PLAYERS : "contains"
    
    ROOMS {
        uuid id PK
        string code "Unique Code"
        string status "lobby/drafting/playing/finished"
        timestamp created_at
    }
    
    PLAYERS {
        uuid id PK
        uuid room_id FK
        string name "Display Name"
        string submitted_word "Secret"
        string assigned_word "Target"
        boolean is_eliminated "State"
        timestamp created_at
    }
```

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19 + Next.js 16 (App Router) |
| **Styling** | Tailwind CSS 4.0 + Lucide Icons |
| **Realtime** | Supabase (Postgres + Realtime CDC) |
| **Voice** | LiveKit (SFU / WebRTC) |
| **Logic** | Derangement Shuffle Algorithm |

---

## 🚀 Quick Start

1. **Install**
   ```bash
   npm install
   ```
2. **Environment**
   Setup `.env.local` with your **Supabase** and **LiveKit** credentials.
3. **Database**
   Run `setup.sql` in your Supabase SQL editor.
4. **Run**
   ```bash
   npm run dev
   ```

---

## 📄 License
Distributed under the MIT License.

<p align="center">Made with ❤️ for party lovers everywhere.</p>
