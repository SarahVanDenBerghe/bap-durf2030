import { makeObservable, observable, action } from 'mobx';
import ProjectService from '../services/ProjectService';
import RequirementService from '../services/RequirementService';
import { getCurrenTimeStamp, getArrayUnion, removeFromArray } from './';
import Project from '../models/Project';

class ProjectStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
    this.projects = [];
    this.projectService = new ProjectService({
      firebase: this.rootStore.firebase,
    });
    this.requirementService = new RequirementService({
      firebase: this.rootStore.firebase,
    });

    makeObservable(this, {
      loadAllProjects: action,
      loadProject: action,
      projects: observable,
      updateProject: action,
      loadProjectLikesById: action,
      removeProject: action,
      addProject: action,
    });
  }

  addProject = (project) => {
    this.projects.push(project);
  };

  removeProject = (index) => {
    this.projects.splice(index, 1);
  };

  loadProject = async (id) => {
    const jsonProject = await this.projectService.getById(id);
    const project = this.updateProjectFromServer(jsonProject);
    return project;
  };

  createProject = async (project) => {
    project.timestamp = getCurrenTimeStamp();
    project.state = 0;
    if (project.image.enabled) {
      const imageURL = await this.createImageForProject(project.image, projectId);
      project.image.url = imageURL;
    }
    const projectId = await this.projectService.create(project);
    return projectId;
  };

  updateImageForProject = async (image, projectId) => {
    const imageURL = await this.createImageForProject(image, projectId);
    image.url = imageURL;
    this.projectService.updateImageURL(image, projectId);
    return imageURL;
  };

  createRequirementsForProject = async ({ requirements, info, projectId }) => {
    if (info.materialsRequired) {
      this.requirementService.createItems(requirements.materials, projectId, 'material');
    }
    if (info.servicesRequired) {
      this.requirementService.createItems(requirements.services, projectId, 'service');
    }
    this.requirementService.createInfo(info, projectId);
  };

  createRequirementItem = (item, projectId, type) => {
    this.requirementService.createItem(item, projectId, type);
  };

  createProjectOwner = (owner, projectId) => {
    this.projectService.createOwner(owner, projectId);
  };

  createUpdate = (newUpdate, projectId) => {
    const updates = {
      updates: getArrayUnion(newUpdate),
    };
    this.projectService.updateProjectUpdates(updates, projectId);
  };

  deleteUpdate = (deletedUpdate, projectId) => {
    const updates = { updates: removeFromArray(deletedUpdate) };
    this.projectService.updateProjectUpdates(updates, projectId);
  };

  deleteProjectOwner = (ownerId, projectId) => {
    this.projectService.removeOwner(ownerId, projectId);
  };

  deleteRequirementItem = (itemId, projectId) => {
    this.requirementService.deleteItem(itemId, projectId);
  };

  deleteProject = (projectId) => {
    this.projectService.deleteProject(projectId);
    this.requirementService.deleteProjectRequirements(projectId);
  };

  updateRequirementItem = (item, itemId, projectId) => {
    this.requirementService.updateItem(item, itemId, projectId);
  };

  updateItemStatus = (itemId, status, projectId) => {
    this.requirementService.updateItemStatus(itemId, status, projectId);
  };

  updateRequirementDetails = (project) => {
    this.requirementService.updateDetails(project);
  };

  createDurver = (durver, project) => {
    durver.timestamp = getCurrenTimeStamp();
    this.requirementService.createDurver(durver, project.id);

    project.owners.forEach((owner) => {
      if (owner.email) {
        let offerTypes = [];
        durver.materialsOffered && offerTypes.push('material');
        durver.servicesOffered && offerTypes.push('service');
        durver.fundingOffered && offerTypes.push('funding');

        let notification = {
          type: 'offer',
          timestamp: getCurrenTimeStamp(),
          read: false,
          info: {
            project: { id: project.id, title: project.title },
            user: { name: durver.user.name, avatar: durver.user.avatar },
            offers: offerTypes,
          },
        };

        this.rootStore.userStore.createNotificationForUser(notification, owner.email);
      }
    });
  };

  createImageForProject = (image, projectId) => {
    return this.projectService.uploadImage(image.file, image.file.name, projectId);
  };

  getProjectById = (id) => this.projects.find((project) => project.id === id);

  loadAllProjects = async () => {
    const jsonProjects = await this.projectService.getAll();
    jsonProjects.forEach((json) => this.updateProjectFromServer(json));
  };

  updateProjectFromServer = (json) => {
    let project = this.projects.find((project) => project.id === json.id);
    if (!project) {
      project = new Project({
        id: json.id,
        title: json.title,
        intro: json.intro,
        about: json.about,
        contact: json.contact,
        description: json.description,
        isKnownPlace: json.isKnownPlace,
        themes: json.themes,
        categories: json.categories,
        city: json.city,
        street: json.street,
        number: json.number,
        userId: json.userId,
        state: json.state,
        updates: json.updates,
        image: json.image,
        impact: json.impact,
        date: json.date,
        timestamp: json.timestamp,
        highlight: json.highlight,
        store: this.rootStore.projectStore,
      });
    }
    return project;
  };

  loadProjectLikesById = async (id) => {
    return await this.projectService.getLikesById(id);
  };

  loadProjectOwnersById = async (id) => {
    return await this.projectService.getOwners(id);
  };

  loadRequirementListById = async (id) => {
    return await this.requirementService.getList(id);
  };

  loadRequirementListInfoById = async (id) => {
    return await this.requirementService.getListInfo(id);
  };

  loadProjectDurversById = async (id) => {
    return await this.requirementService.getDurvers(id);
  };

  loadProjectCommentsById = async (id) => {
    return await this.projectService.getComments(id, this.onCommentChanged);
  };

  sendComment = async (comment) => {
    comment.timestamp = getCurrenTimeStamp();
    return await this.projectService.createComment(comment);
  };

  onCommentChanged = (id, comment) => {
    const project = this.getProjectById(id);
    project.linkComment(comment);
  };

  updateState = (state, projectId) => {
    this.projectService.updateState(state, projectId);
  };

  updateProject = async (newValues, projectId) => {
    await this.projectService.updateProject(newValues, projectId);
  };

  updateContact = (email, projectId) => {
    this.projectService.updateProjectContact(email, projectId);
  };

  uploadImage = (image) => {
    this.projectService.uploadImage(image.file, image.name, 'testid');
  };

  addLikeToProject = (projectId, userId) => {
    this.projectService.addLike(projectId, userId);
  };

  removeLikeFromProject = (projectId, userId) => {
    this.projectService.removeLike(projectId, userId);
  };
}

export default ProjectStore;
