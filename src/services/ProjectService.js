import 'firebase/firestore';
import 'firebase/storage';
// import firebase from 'firebase/app';
import { projectConverter } from '../models/Project';
import { userConverter } from '../models/User';
import { commentConverter } from '../models/Comment';

class ProjectService {
  constructor({ firebase }) {
    this.db = firebase.firestore();
    this.storage = firebase.storage();
  }

  getAll = async () => {
    const snapshot = await this.db.collection('projects').withConverter(projectConverter).get();
    return snapshot.docs.map((project) => project.data());
  };

  getById = async (id) => {
    const project = await this.db.collection('projects').doc(id).withConverter(projectConverter).get();
    // project = await user.project();
    return project.data();
  };

  getLikesById = async (id) => {
    const snapshot = await this.db.collection('projects').doc(id).collection('likes').get();
    return snapshot.docs.map((like) => like.data());
  };

  deleteProject = async (id) => {
    await this.db
      .collection('projects')
      .doc(id)
      .collection('owners')
      .get()
      .then((subcoll) => {
        if (subcoll.docs.length > 0) {
          subcoll.forEach((doc) => {
            doc.ref.delete();
          });
        }
      });
    await this.db
      .collection('projects')
      .doc(id)
      .collection('likes')
      .get()
      .then((subcoll) => {
        if (subcoll.docs.length > 0) {
          subcoll.forEach((doc) => {
            doc.ref.delete();
          });
        }
      });
    await this.db
      .collection('projects')
      .doc(id)
      .collection('comments')
      .get()
      .then((subcoll) => {
        if (subcoll.docs.length > 0) {
          subcoll.forEach((doc) => {
            doc.ref.delete();
          });
        }
      });

    await this.db.collection('projects').doc(id).delete();
    return;
  };

  addLike = async (projectId, userId) => {
    this.db.collection('projects').doc(projectId).collection('likes').doc(userId).set({ userId: userId });
  };

  removeLike = async (projectId, userId) => {
    this.db.collection('projects').doc(projectId).collection('likes').doc(userId).delete();
  };

  getProjectsForUser = async (userId) => {
    const snapshot = await this.db
      .collectionGroup('owners')
      .where('userId', '==', userId)
      .withConverter(userConverter)
      .get();

    return snapshot.docs.map((doc) => doc.ref.parent.parent.id);
  };

  getLikedProjectsByUser = async (userId) => {
    const snapshot = await this.db
      .collectionGroup('likes')
      .where('userId', '==', userId)
      .withConverter(userConverter)
      .get();

    return snapshot.docs.map((doc) => doc.ref.parent.parent.id);
  };

  create = async (project) => {
    const ref = await this.db.collection('projects').doc();
    ref.withConverter(projectConverter).set(project);
    project.owners.forEach((owner) => {
      ref.collection('owners').doc(owner.id).set({
        userId: owner.id,
        name: owner.name,
        avatar: owner.avatar,
        email: owner.email,
      });
    });

    return ref.id;
  };

  createComment = async (comment) => {
    return await this.db
      .collection('projects')
      .doc(comment.project.id)
      .collection('comments')
      .doc()
      .withConverter(commentConverter)
      .set(comment);
  };

  createOwner = (owner, projectId) => {
    this.db
      .collection('projects')
      .doc(projectId)
      .collection('owners')
      .doc(owner.id)
      .set({ userId: owner.id, avatar: owner.avatar, name: owner.name, email: owner.email });
  };

  updateProjectUpdates = (updates, projectId) => {
    this.db.collection('projects').doc(projectId).update(updates);
  };

  removeOwner = (ownerId, projectId) => {
    this.db.collection('projects').doc(projectId).collection('owners').doc(ownerId).delete();
  };

  getOwners = async (projectId) => {
    const snapshot = await this.db
      .collection('projects')
      .doc(projectId)
      .collection('owners')
      .withConverter(userConverter)
      .get();
    const result = snapshot.docs.map((user) => user.data());
    return result;
  };

  updateProjectContact = (email, projectId) => {
    this.db.collection('projects').doc(projectId).update({ contact: email });
  };

  getComments = async (projectId, onChange) => {
    await this.db
      .collectionGroup('comments')
      .where('projectId', '==', projectId)
      .orderBy('timestamp')
      .withConverter(commentConverter)
      .onSnapshot(async (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === 'added') {
            const commentObj = change.doc.data();
            onChange(projectId, commentObj);
          }
        });
      });
  };

  updateProject = async (newValues, projectId) => {
    await this.db.collection('projects').doc(projectId).update(newValues);
  };

  updateState = (state, projectId) => {
    this.db.collection('projects').doc(projectId).update({ state: state });
  };

  uploadImage = async (file, name, projectId) => {
    let imageRef = this.storage.ref().child(`images/${projectId}/${name}`);
    await imageRef.put(file);
    return imageRef.getDownloadURL();
  };

  updateImageURL = (image, projectId) => {
    this.db
      .collection('projects')
      .doc(projectId)
      .update({
        image: {
          enabled: image.enabled,
          name: image.name,
          url: image.url,
        },
      });
  };
}

export default ProjectService;
