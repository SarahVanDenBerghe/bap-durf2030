import { makeObservable, observable, action } from 'mobx';
import { getCurrenTimeStamp } from '../stores';

class Project {
  constructor({
    about,
    fundingAmount,
    fundingDescription,
    fundingRequired,
    categories,
    city,
    contact,
    description,
    durvers = [],
    image = {},
    intro,
    isKnownPlace,
    materials = [],
    materialsDescription,
    materialsRequired,
    number,
    owners = [],
    services = [],
    servicesDescription,
    servicesRequired,
    street,
    themes,
    timestamp = '',
    title,
    state = 0,
    impact = '',
    date = {},
    highlight = false,

    updates = [],
    id,
    userId,
    store,
  }) {
    this.about = about;
    this.fundingAmount = fundingAmount;
    this.fundingDescription = fundingDescription;
    this.fundingRequired = fundingRequired;
    this.categories = categories;
    this.city = city;
    this.contact = contact;
    this.description = description;
    this.durvers = durvers;
    this.image = image.enabled ? image : { enabled: false, url: 'placeholder.png' };
    this.intro = intro;
    this.isKnownPlace = isKnownPlace;
    this.materials = materials;
    this.materialsDescription = materialsDescription;
    this.materialsRequired = materialsRequired;
    this.number = number;
    this.owners = owners;
    this.services = services;
    this.servicesDescription = servicesDescription;
    this.servicesRequired = servicesRequired;
    this.street = street;
    this.themes = themes;
    this.title = title;
    this.timestamp = timestamp;
    this.state = state;

    this.updates = updates;
    this.id = id;
    this.userId = userId;
    this.likes = [];
    this.liked = false;
    this.comments = [];
    this.impact = impact;
    this.date = date;
    this.highlight = highlight;
    this.containsAllData = false;

    if (store) {
      this.store = store;
      this.store.addProject(this);
    }

    makeObservable(this, {
      title: observable,
      intro: observable,
      description: observable,
      services: observable,
      materials: observable,
      fundingAmount: observable,
      fundingDescription: observable,
      fundingRequired: observable,
      materialsRequired: observable,
      materialsDescription: observable,
      servicesRequired: observable,
      servicesDescription: observable,
      updateProject: action,
      containsAllData: observable,
      setAllDataLoaded: action,

      owners: observable,
      durvers: observable,
      likes: observable,
      liked: observable,
      addLike: action,
      removeLike: action,
      setLiked: action,
      createDurver: action,
      setOwners: action,

      comments: observable,
      linkComment: action,
      getComments: action,

      impact: observable,
      date: observable,

      updateRequirementDetails: action,
      getRequirementsList: action,
      getRequirementsInfo: action,

      contact: observable,
      updateProjectContact: action,

      updates: observable,
      setUpdates: action,
      createUpdate: action,
      removeUpdate: action,

      state: observable,
      updateState: action,

      image: observable,
      updateImage: action,
    });
  }

  getComments() {
    this.store.loadProjectCommentsById(this.id);
  }

  getLikes() {
    this.store.loadProjectLikesById(this.id).then(
      action('fetchSuccess', (likes) => {
        this.likes = likes;
      })
    );
  }

  getOwners() {
    this.store.loadProjectOwnersById(this.id).then(
      action('fetchSuccess', (owners) => {
        this.owners = owners;
      })
    );
  }

  getDurvers() {
    this.store.loadProjectDurversById(this.id).then(
      action('fetchSuccess', (durvers) => {
        this.durvers = durvers;
      })
    );
  }

  deleteProject() {
    this.store.deleteProject(this.id);
  }

  createDurver(durver) {
    this.store.createDurver(durver, this);
    this.durvers.push(durver);
  }

  getRequirementsInfo() {
    this.store.loadRequirementListInfoById(this.id).then(
      action('fetchSuccess', (info) => {
        this.fundingAmount = info.fundingDetails.fundingAmount;
        this.fundingDescription = info.fundingDetails.fundingDescription;
        this.fundingRequired = info.fundingDetails.required;
        this.materialsRequired = info.materialsDetails.required;
        this.materialsDescription = info.materialsDetails.description;
        this.servicesRequired = info.servicesDetails.required;
        this.servicesDescription = info.servicesDetails.description;
      })
    );
  }

  getRequirementsList = () => {
    this.store.loadRequirementListById(this.id).then(
      action('fetchSuccess', (list) => {
        let listMaterials = [];
        let listServices = [];
        list.forEach((item) => {
          if (item.type === 'material') {
            listMaterials.push(item);
          } else if (item.type === 'service') {
            listServices.push(item);
          }
        });
        this.materials = listMaterials;
        this.services = listServices;
      })
    );
  };

  createRequirementItem = (item, type) => {
    this.store.createRequirementItem(item, this.id, type);
  };

  createProjectOwner = (owner) => {
    this.store.createProjectOwner(owner, this.id);
  };

  createUpdate = (update) => {
    const timestamp = getCurrenTimeStamp();
    update.timestamp = timestamp;
    this.store.createUpdate(update, this.id);
    this.updates.push(update);
  };

  removeUpdate = (update) => {
    this.store.deleteUpdate(update, this.id);
    const updates = this.updates.filter((currUpdate) => {
      return currUpdate !== update;
    });
    this.updates = updates;
  };

  removeProjectOwner = (ownerId) => {
    this.store.deleteProjectOwner(ownerId, this.id);
  };

  getReadableDate = (timestamp) => {
    const months = [
      'januari',
      'februari',
      'maart',
      'april',
      'mei',
      'juni',
      'juli',
      'augustus',
      'september',
      'oktober',
      'november',
      'december',
    ];

    const date = timestamp.toDate();
    const today = new Date();
    const seconds = Math.abs(today - date) / 1000;
    const days = Math.floor(seconds / 86400);

    if (days < 1) {
      return `${date.getHours()}:${date.getMinutes() < 10 ? 0 : ''}${date.getMinutes()}`;
    } else if (days < 7) {
      return `${days} dag${days > 1 ? 'en' : ''} geleden`;
    } else {
      return `${date.getDate()} ${months[date.getMonth()]}`;
    }
  };

  removeRequirementItem = (item) => {
    this.store.deleteRequirementItem(item.id, this.id);
  };

  updateRequirementItem = (item, itemId) => {
    this.store.updateRequirementItem(item, itemId, this.id);
  };

  updateRequirementDetails = (newValues) => {
    Object.keys(newValues).forEach((key) => {
      if (this[key] !== newValues[key]) {
        this[key] = newValues[key];
        this.store.updateRequirementDetails(this);
      }
    });
  };

  updateState = (state) => {
    this.store.updateState(state, this.id);
    this.state = state;
  };

  updateProjectContact = (email) => {
    this.store.updateContact(email, this.id);
    this.contact = email;
  };

  setLiked = (bool) => {
    this.liked = bool;
  };

  addLike = (userId) => {
    this.store.addLikeToProject(this.id, userId);
    this.likes.push({ userId: userId });
    this.setLiked(true);
  };

  removeLike = (userId) => {
    this.store.removeLikeFromProject(this.id, userId);

    this.likes = this.likes.filter((like) => {
      return like.userId !== userId;
    });

    this.setLiked(false);
  };

  linkComment(comment) {
    !this.comments.includes(comment) && this.comments.push(comment);
  }

  getAllDynamicContent() {
    this.getLikes();
    this.getRequirementsList();
    this.getRequirementsInfo();
    this.getDurvers();
    this.getComments();
  }

  updateProject(newValues) {
    let updatedValues = {};

    Object.keys(newValues).forEach((key) => {
      this[key] = newValues[key];

      if (key !== 'isKnownPlace' && key !== 'number' && key !== 'city' && key !== 'street') {
        updatedValues[key] = newValues[key];
      }
    });

    if (newValues.isKnownPlace) {
      updatedValues.location = {
        isKnownPlace: this.isKnownPlace,
        city: this.city,
        number: this.number,
        street: this.street,
      };
    }

    this.store.updateProject(newValues, this.id); // this
  }

  updateImage = async (image) => {
    const imageURL = await this.store.updateImageForProject(image, this.id);
    this.image.url = imageURL;
  };

  updateItemStatus = async (itemId, status, type) => {
    if (type === 'material') {
      const newMaterials = this.materials.map((material) => {
        if (material.id === itemId) {
          material.completed = status;
          return material;
        } else {
          return material;
        }
      });
      this.materials = newMaterials;
    } else if (type === 'service') {
      const newServices = this.services.map((service) => {
        if (service.id === itemId) {
          service.completed = status;
          return service;
        } else {
          return service;
        }
      });
      this.services = newServices;
    }
    this.store.updateItemStatus(itemId, status, this.id);
  };

  setOwners = (owners) => {
    this.owners = owners;
  };

  setUpdates = (updates) => {
    this.updates = updates;
  };

  setAllDataLoaded = (bool) => {
    this.containsAllData = bool;
  };
}

//  Server side rendering data does not accept Objects, converting to JSON instead
const convertData = {
  toJSON(project) {
    return {
      id: project.id,
      title: project.title,
      intro: project.intro,
      about: project.about,
      contact: project.contact,
      description: project.description,
      isKnownPlace: project.isKnownPlace,
      city: project.city,
      street: project.street,
      number: project.number,
      state: project.state,
      themes: project.themes,
      categories: project.categories,
      image: project.image,
      impact: project.impact,
      highlight: project.highlight,
    };
  },

  fromJSON(project, store) {
    // Turn SSR data back to a Project model (object), loop over each possible key
    let projectData = {};
    Object.keys(project).forEach((key) => {
      projectData[key] = project[key];
    });
    projectData['store'] = store;
    return new Project(projectData);
  },
};

// From and to firebase data
const projectConverter = {
  toFirestore: function (project) {
    return {
      about: project.about,
      categories: project.categories,
      contact: project.contact,
      description: project.description,
      intro: project.intro,
      location: {
        isKnownPlace: project.isKnownPlace,
        city: project.city,
        street: project.street,
        number: project.number,
      },
      themes: project.themes,
      title: project.title,
      userId: project.userId,
      state: project.state,
      timestamp: project.timestamp,
      image: {
        enabled: project.image.enabled ?? false,
        name: project.image.name ?? '',
        url: project.image.url ?? '',
      },
    };
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      title: data.title,
      intro: data.intro,
      about: data.about,
      contact: data.contact,
      description: data.description,
      userId: data.userId,
      isKnownPlace: data.location.isKnownPlace,
      city: data.location.city,
      street: data.location.street,
      number: data.location.number,
      state: data.state,
      themes: data.themes,
      categories: data.categories,
      image: data.image,
      updates: data.updates,
      impact: data.impact,
      date: data.date,
      timestamp: data.timestamp,
      highlight: data.highlight,
    };
  },
};

export { projectConverter, convertData };

export default Project;
