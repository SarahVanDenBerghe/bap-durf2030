import { observer } from 'mobx-react-lite';
import { useState, useEffect } from 'react';
import styles from './ProjectHelpOne.module.scss';
import { FormFieldSwitch } from '../../Create';

const ProjectHelpOne = observer(
  ({
    setFundingRequired,
    fundingRequired,
    materialsRequired,
    setMaterialsRequired,
    servicesRequired,
    setServicesRequired,
    project,
  }) => {
    const [invisibleToggle, setInvisibleToggle] = useState(false);

    useEffect(() => {
      if (servicesRequired || materialsRequired || fundingRequired) {
        setInvisibleToggle(true);
      }

      if (!servicesRequired && !materialsRequired && !fundingRequired) {
        setInvisibleToggle(false);
      }
    }, [
      setInvisibleToggle,
      invisibleToggle,
      servicesRequired,
      materialsRequired,
      fundingRequired,
    ]);

    return (
      <>
        <h2 className={styles.title}>Ik help mee!</h2>
        <p>
          Help mee met realiseren van{' '}
          <span className={styles.bold}>{project.title}</span>, het uitlenen van
          je materiaal, een handje helpen of een centje doneren, alle kleine
          beetjes helpen!
        </p>
        <div className={styles.hidden}>
          <FormFieldSwitch
            name="invisibleToggle"
            label="invisibleToggle"
            setToggleValue={setInvisibleToggle}
            defaultValue={invisibleToggle}
            required
          />
        </div>

        <div className={styles.requirements}>
          <div
            className={`${styles.requirement} ${
              materialsRequired &&
              project.materialsRequired &&
              styles.requirementChecked
            }`}
            onClick={() => {
              {
                project.materialsRequired &&
                  setMaterialsRequired(!materialsRequired);
              }
            }}
          >
            <div className={`${styles.circle} ${styles.material}`} />
            <span className={styles.subtitle}>Materialen aanbieden</span>
            {project.materialsRequired && (
              <FormFieldSwitch
                name="materialsRequired"
                label="materialsRequired"
                setToggleValue={setMaterialsRequired}
                defaultValue={materialsRequired}
              />
            )}
          </div>

          <div
            className={`${styles.requirement} ${
              servicesRequired &&
              project.servicesRequired &&
              styles.requirementChecked
            }`}
            onClick={() => {
              {
                project.servicesRequired &&
                  setServicesRequired(!servicesRequired);
              }
            }}
          >
            <div className={`${styles.circle} ${styles.service}`} />
            <span className={styles.subtitle}>Als vrijwilliger aanbieden</span>
            {project.servicesRequired && (
              <FormFieldSwitch
                name="servicesRequired"
                label="servicesRequired"
                setToggleValue={setServicesRequired}
                defaultValue={servicesRequired}
              />
            )}
          </div>

          <div
            className={`${styles.requirement} ${
              fundingRequired &&
              project.fundingRequired &&
              styles.requirementChecked
            }`}
            onClick={() => {
              {
                project.fundingRequired && setFundingRequired(!fundingRequired);
              }
            }}
          >
            <div className={`${styles.circle} ${styles.money}`} />
            <span className={styles.subtitle}>Donaties maken</span>
            {project.fundingRequired && project.state != 1 && (
              <FormFieldSwitch
                name="fundingRequired"
                label="fundingRequired"
                setToggleValue={setFundingRequired}
                defaultValue={fundingRequired}
              />
            )}
          </div>
        </div>
      </>
    );
  }
);

export default ProjectHelpOne;
