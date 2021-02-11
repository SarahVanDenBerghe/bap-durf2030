import { v4 } from 'uuid';
import { makeObservable, observable, action } from 'mobx';

class User {
  constructor({
    id = v4(),
    name,
    avatar = '',
    email,
    password,
    admin,
    organisation,
    awards = [],
    badges = [],
    store,
    notifications = [],
  }) {
    this.id = id;
    this.name = name;
    this.avatar = avatar;
    if (!avatar) {
      this.avatar = `https://avatars.dicebear.com/api/identicon/${this.id}.svg`;
    }

    this.email = email;
    this.password = password;
    this.admin = admin;
    this.awards = awards;
    this.badges = badges;
    this.organisation = organisation;
    this.comments = [];
    this.notifications = notifications;

    if (store) {
      this.store = store;
      this.store.addUser(this);
    }

    makeObservable(this, {
      name: observable,
      avatar: observable,
      email: observable,
      password: observable,
      admin: observable,
      awards: observable,
      badges: observable,
      organisation: observable,
    });
  }

  linkComment(comment) {
    !this.comments.includes(comment) && this.comments.push(comment);
  }
}

//  Server side rendering data does not accept Objects, converting to JSON instead
const convertDataUser = {
  toJSON(user) {
    return {
      userId: user.id,
      name: user.name,
      avatar: user.avatar,
      email: user.email,
      admin: user.admin,
      organisation: user.organisation,
      awards: user.awards,
      badges: user.badges,
    };
  },

  // Turn SSR data back to User model (Object)
  fromJSON(user, store) {
    return new User({
      id: user.userId,
      name: user.name,
      avatar: user.avatar,
      email: user.email,
      admin: user.admin,
      organisation: user.organisation,
      awards: user.awards,
      badges: user.badges,
      store: store,
    });
  },
};

const userConverter = {
  toFirestore: function (user) {
    console.log(user);
    return {
      userId: user.id,
      name: user.name,
      avatar: user.avatar,
      email: user.email,
      admin: user.admin,
      organisation: user.organisation,
      awards: user.awards,
      badges: user.badges,
    };
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options);
    return new User({
      name: data.name,
      email: data.email,
      avatar: data.avatar,
      id: data.userId,
      admin: data.admin,
      organisation: data.organisation,
      awards: data.awards,
      badges: data.badges,
      notifications: data.notifications,
    });
  },
};

export { userConverter, convertDataUser };
export default User;
