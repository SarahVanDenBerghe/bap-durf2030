import styles from './ProjectRequirements.module.scss';
import { useState, useEffect } from 'react';
import { ProjectRequirementsServices, ProjectRequirementsMaterials, ProjectRequirementsFunding } from '../../Project';

const ProjectRequirements = ({ project }) => {
  const [servicesCount, setServicesCount] = useState(0);
  const [materialsCount, setMaterialsCount] = useState(0);
  const [fundingCount, setFundingCount] = useState(0);

  useEffect(() => {
    let materialsCountNew = 0;
    let servicesCountNew = 0;
    let fundingCountNew = 0;

    project.materials.forEach((item) => {
      if (item.completed === true) {
        materialsCountNew++;
      }
    });

    project.services.forEach((item) => {
      if (item.completed === true) {
        servicesCountNew++;
      }
    });

    project.durvers.forEach((item) => {
      if (item.fundingOffered === true) {
        const number = parseInt(item.fundingAmount);
        fundingCountNew = fundingCountNew + number * 2;
      }
    });

    setMaterialsCount(materialsCountNew);
    setServicesCount(servicesCountNew);
    setFundingCount(fundingCountNew);
  }, [project.materials, project.services, project.durvers]);

  return (
    <>
      <article className={styles.requirements}>
        <h2 className="hidden">Nodige hulp</h2>
        {/* CROWDFUNDING */}
        {project.fundingRequired && (
          <ProjectRequirementsFunding
            project={project}
            funding={fundingCount}
            progress={fundingCount < project.FundingAmount ? (fundingCount / project.fundingAmount) * 100 : 100}
          />
        )}

        {/* VRIJWILLIGERS */}
        {project.servicesRequired && (
          <ProjectRequirementsServices project={project} progress={(servicesCount / project.services.length) * 100} />
        )}

        {/* MATERIAAL */}
        {project.materialsRequired && (
          <ProjectRequirementsMaterials
            project={project}
            progress={(materialsCount / project.materials.length) * 100}
          />
        )}
      </article>
    </>
  );
};

export default ProjectRequirements;
