import { makeObservable, observable, action } from 'mobx';
import UserService from '../services/UserService';
import User from '../models/User';
import { getCurrenTimeStamp, getArrayUnion, removeFromArray } from './';

class UserStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
    this.users = [];
    this.userService = new UserService(this.rootStore.firebase);

    makeObservable(this, {
      loadAllUsers: action,
      users: observable,
    });
  }

  addUser = (user) => {
    this.users.push(user);
  };

  createUser = async (user) => {
    return await this.userService.create(user);
  };

  updateAdmin = (adminState, user) => {
    this.userService.updateAdmin(adminState, user);
  };

  validateUser = (user) => {
    if (this.users.length === 0) {
      this.loadAllUsers();
    }
    let checkUser = this.users.find((existingUser) => existingUser.email === user.email);
  };

  loadAllUsers = async () => {
    const jsonUsers = await this.userService.getAllUsers();
    jsonUsers.forEach((json) => this.updateUserFromServer(json));
  };

  updateUserFromServer(json) {
    let user = this.users.find((user) => user.email === json.email);
    if (!user) {
      user = new User({
        id: json.userId,
        name: json.name,
        email: json.email,
        avatar: json.avatar,
        admin: json.admin,
        awards: json.awards,
        badges: json.badges,
        organisation: json.organisation,
        notifications: json.notifications,
        store: this.rootStore.userStore,
      });
    }
    return user;
  }

  createNotificationForUser = (newNotification, ownerEmail) => {
    const notifications = {
      notifications: getArrayUnion(newNotification),
    };
    this.userService.updateUserNotifications(notifications, ownerEmail);
  };

  updateNotifications = (notifications, userEmail) => {
    this.userService.updateUserNotifications({ notifications: notifications }, userEmail);
  };

  updateBadges = (badges, userEmail) => {
    this.userService.updateUserBadges({ badges: badges }, userEmail);
  };
}

export default UserStore;
