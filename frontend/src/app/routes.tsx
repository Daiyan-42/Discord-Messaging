import { createBrowserRouter, Navigate } from "react-router";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { MainLayout } from "./components/layouts/MainLayout";
import { ChatView } from "./components/chat/ChatView";
import { AuthProvider } from "./contexts/AuthContext";
import { AppProvider } from "./contexts/AppContext";

// Root wrapper component
function RootWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppProvider>
        {children}
      </AppProvider>
    </AuthProvider>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <RootWrapper>
        <Navigate to="/app" replace />
      </RootWrapper>
    ),
  },
  {
    path: "/login",
    element: (
      <RootWrapper>
        <Login />
      </RootWrapper>
    ),
  },
  {
    path: "/register",
    element: (
      <RootWrapper>
        <Register />
      </RootWrapper>
    ),
  },
  {
    path: "/app",
    element: (
      <RootWrapper>
        <MainLayout />
      </RootWrapper>
    ),
    children: [
      {
        index: true,
        element: <ChatView />,
      },
      {
        path: ":serverId/:channelId?",
        element: <ChatView />,
      },
    ],
  },
  {
    path: "*",
    element: (
      <RootWrapper>
        <Navigate to="/app" replace />
      </RootWrapper>
    ),
  },
]);