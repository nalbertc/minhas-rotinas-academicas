import { useAuth } from "../contexts/AuthContext";

export function useProfile() {
  return useAuth();
}
