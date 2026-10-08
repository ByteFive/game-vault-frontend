import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { AppProvider } from "@/context/AppContext";
import { MainLayout } from "@/layouts/MainLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Home } from "@/pages/Home";
import { Explore } from "@/pages/Explore";
import { GameDetail } from "@/pages/GameDetail";
import { MyTopFive } from "@/pages/MyTopFive";
import { CompareTopFive } from "@/pages/CompareTopFive";
import { MyGames } from "@/pages/MyGames";
import { Reviews } from "@/pages/Reviews";
import { GameDNAPage } from "@/pages/GameDNAPage";
import { Profile } from "@/pages/Profile";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/registrar" element={<Register />} />
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/explorar" element={<Explore />} />
              <Route path="/jogo/:id" element={<GameDetail />} />

              <Route
                path="/meu-top-5"
                element={
                  <ProtectedRoute>
                    <MyTopFive />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/comparar"
                element={
                  <ProtectedRoute>
                    <CompareTopFive />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/meus-jogos"
                element={
                  <ProtectedRoute>
                    <MyGames />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/avaliacoes"
                element={
                  <ProtectedRoute>
                    <Reviews />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/game-dna"
                element={
                  <ProtectedRoute>
                    <GameDNAPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/perfil"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Home />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}
