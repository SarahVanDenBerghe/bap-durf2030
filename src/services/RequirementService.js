import 'firebase/firestore';
// import { projectConverter } from '../models/Project';

class RequirementService {
  constructor({ firebase }) {
    this.db = firebase.firestore();
  }

  createMaterials = async (materials, projectId) => {
    materials.forEach((material) => {
      this.db.collection('requirements').doc(projectId).collection('materials').doc().set({
        amount: material.amount,
        category: material.category,
        name: material.name,
        completed: false,
      });
    });
  };

  createServices = async (services, projectId) => {
    services.forEach((service) => {
      this.db.collection('requirements').doc(projectId).collection('services').doc().set({
        amount: service.amount,
        category: service.category,
        name: service.name,
        completed: false,
      });
    });
  };

  createInfo = async (info, projectId) => {
    this.db
      .collection('requirements')
      .doc(projectId)
      .set({
        materialsDetails: {
          required: info.materialsRequired,
          description: info.materialsDescription,
        },
        servicesDetails: {
          required: info.servicesRequired,
          description: info.servicesDescription,
        },
        fundingDetails: {
          required: info.fundingRequired,
          fundingAmount: info.fundingAmount,
          fundingDescription: info.fundingDescription,
        },
      });
  };
}

export default RequirementService;
