import { makeObservable, observable, action } from 'mobx';
import AuthService from '../services/AuthService';
import User from '../models/User';

class UiStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
    this.currentUser = undefined;
    this.authService = new AuthService(
      this.rootStore.firebase,
      this.onAuthStateChanged
    );

    makeObservable(this, {
      currentUser: observable,
      setCurrentUser: action,
    });
  }

  onAuthStateChanged = (user) => {
    if (user) {
      console.log(`de user is ingelogd ${user.email}`);
      this.setCurrentUser(
        new User({
          id: user.uid,
          name: user.displayName,
          email: user.email,
          store: this.rootStore.userStore,
          avatar: user.photoURL,
        })
      );
    } else {
      console.log(`de user is uitgelogd`);
      this.setCurrentUser(undefined);
    }
  };

  loginUser = async (user) => {
    //service aanspreken
    const result = await this.authService.login(user.email, user.password);
    return result;
  };

  logoutUser = async () => {
    const result = await this.authService.logout();
    return result;
  };

  registerUser = async (user) => {
    const result = await this.authService.register(
      user.name,
      user.email,
      user.password,
      user.avatar
    );
    return result;
  };

  setCurrentUser(user) {
    this.currentUser = user;
  }
}

export default UiStore;
