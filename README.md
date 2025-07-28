# 💬 Chatterbox Frontend
The real-time chat UI for Chatterbox — built with Next.js (App Router), TailwindCSS, Zustand, and Socket.IO. Deployed on Vercel and powered by a Render-hosted Express + Socket.IO backend.

Key Features:

-  Authentication (Login / Auto-redirect if logged in)
-  Authenticated Layout with Sidebar
-  Real-time messaging via Socket.IO
-  Notification toasts with sound
-  Room-based chat UI
-  Responsive & mobile-friendly
-  Background animation with floating bubbles
-  Zustand-based global toast store
-  Fully modular structure (contexts, hooks, UI, routes)



## Tech Stack

## 🧩 Tech Stack

| Layer         | Tech               |
|--------------|--------------------|
| Framework     | [Next.js 15](https://nextjs.org/) (App Router) |
| Styling       | [TailwindCSS](https://tailwindcss.com/)       |
| State Mgmt    | [Zustand](https://zustand-demo.pmnd.rs/)       |
| Realtime      | [Socket.IO](https://socket.io/)                |
| Deployment    | Vercel / Custom Node backend                   |



## Folder Structure

```

app/
│
├── layout.js                  # Root layout 
├── page.js                    # Root page
├── loading.js                 # Global fallback spinner
│
├── (main)/                   # Main authenticated layout wrapper
│   ├── layout.js             # Background layout 
│   └── chat/                 # Chat route
│       └── page.js           # Authenticated chat page
│
├── auth/                     # Public auth route
│   └── page.js               # Renders login/signup
│
├── contexts/
│   ├── AuthContext.js        # Auth lifecycle + current user context
│   └── SocketContext.js      # Socket.io connection + listeners
│
├── hooks/
│   ├── useRoom.js            # Room-specific logic (fetching, sending, seen)
│   └── useRooms.js           # User’s room list logic
│
├── Pages/
│   ├── AuthPage.js           # UI logic for auth route
│   └── ChatPage.js           # UI logic for chat route
│
├── components/
│   ├── FloatingBackground.js # Bubble animation background
│   ├── Logo.js               # Chatterbox branding
│   ├── SideBar.js            # Responsive sidebar toggle
│   ├── NotificationToaster.js# Toast portal
│   ├── newRoomModal.js       # Modal to start a new chat
│   │
│   ├── auth/                 # Auth-specific components
│   │   ├── InputField.js
│   │   ├── AuthButton.js
│   │   └── LoadingSpinner.js
│   │
│   └── chat/                 # Chat feature UI components
│       ├── Icons.tsx
│       ├── Message.tsx
│       ├── MessageInput.tsx
│       ├── MessageList.tsx
│       ├── RoomItem.tsx
│       ├── RoomList.tsx
│       └── TypingIndicator.tsx
│
├── store/
│   └── notificationStore.js  # Toast state with optional sound
│
└── public/
    └── Notification_sound.mp3



```


## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/atiwari-0/Chatterbox-Frontend.git
cd Chatterbox-Frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a .env.local file in root:

```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

### 4. Start the server

```bash
npm run dev
```


## Real-time Flow

 - Socket connection is established in SocketContext
 - Rooms are synced via useRooms and useRoom
 - Events such as message:receive, room:update, typing:start are handled
 - UI auto-renders updates based on state from these contexts and hooks


## Developer Notes

- Originally a monorepo → split into frontend/backend
- All routing uses Next.js App Router (app/ directory)
- Auth redirect logic is handled inside auth/page.js using useAuth
- UI for routes (auth/chat) is separated in Pages/ for readability
- FloatingBackground adds animated bubbles (via absolute div layers)
- Notification system uses Zustand + NotificationToaster

### Notable Commits:
- `feat: handle multi-user seen/delivered updates`
- `fix(cors): enable Vercel frontend domain in Render backend CORS config`
- `refactor: split repo + flatten server structure`


## Credits

Built by [Akshat Tiwari](https://github.com/atiwari-0)
Part of the Chatterbox Fullstack project (see [Chatterbox-Backend](https://github.com/atiwari-0/Chatterbox-Backend))
