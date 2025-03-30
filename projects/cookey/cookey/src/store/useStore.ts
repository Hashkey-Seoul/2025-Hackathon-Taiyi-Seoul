import { create } from 'zustand';
import { Deck } from '../types/quiz';
import { UserData } from '../hooks/useUserData';

interface Store {
  _deck: Deck | null;
  _setDeck: (deck: Deck) => void;
  _userData: UserData | null;
  _setUserData: (data: UserData | null) => void;
}

const useStore = create<Store>((set) => ({
  _deck: null,
  _setDeck: (deck) => set({ _deck: deck }),
  _userData: null,
  _setUserData: (data) => set({ _userData: data }),
}));

export default useStore;