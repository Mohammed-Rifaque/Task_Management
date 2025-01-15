import { create } from 'zustand';

interface UserStore {
  email: string;
  userName: string;
  userProfilePic: string;
  loggedIn: boolean;
  setEmail: (email: string) => void;
  setUserName: (username:string) => void;
  setUserProfilePic: (profilePic: string) => void;
  logout: () => void; 
}

const useUserStore = create<UserStore>((set) => ({
  email: "",
  userName: "",
  loggedIn: false,
  userProfilePic: "",
  setUserProfilePic: (profilePic) => set({ userProfilePic: profilePic }),
  setUserName: (username:string) => set({ userName: username }),
  setEmail: (email) => set({ email, loggedIn: true }),
  logout: () => set({ email: "", loggedIn: false }),
}));

export default useUserStore;
