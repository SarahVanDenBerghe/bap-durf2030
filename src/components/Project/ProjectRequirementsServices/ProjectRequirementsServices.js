import styles from '../ProjectRequirements/ProjectRequirements.module.scss';
import { useEffect } from 'react';
import { useState } from 'react';
import { useStores } from '../../../hooks/useStores';
import { Container } from '../../Layout';
import { Button } from '../../UI';
import { ProjectCircle, ProjectHelp } from '../';

const ProjectRequirementsServices = ({ project, progress }) => {
  const { projectStore } = useStores();

  const [physical, setPhysical] = useState([]);
  const [creative, setCreative] = useState([]);
  const [divers, setDivers] = useState([]);

  useEffect(() => {
    let physicalArr = [];
    let creativeArr = [];
    let diversArr = [];

    const loadServices = async () => {
      project.services.forEach((service) => {
        if (service.category === 'Fysieke hulp') {
          physicalArr.push(service);
          setPhysical(physicalArr);
        } else if (service.category === 'Creatieve hulp') {
          creativeArr.push(service);
          setCreative(creativeArr);
        } else if (service.category === 'Andere') {
          diversArr.push(service);
          setDivers(diversArr);
        }
      });
    };
    loadServices();
  }, [projectStore, setPhysical, setCreative, setDivers]);

  return (
    <>
      <section className={styles.requirement}>
        <Container>
          <ProjectCircle type="service" progress={progress} large />
          <div className={styles.content}>
            <h3 className={styles.title}>Vrijwilligers</h3>
            <div className={styles.wrapper}>
              <p>{project.servicesDescription}</p>
              <div className={styles.list}>
                {physical.length != 0 && (
                  <section className={styles.list__item}>
                    <h4>Fysieke hulp</h4>
                    {physical.map((item) => (
                      <span className={item.completed ? `${styles.completed}` : ``} key={item.id}>
                        <span>
                          {item.amount} {item.name}
                        </span>
                        ,{' '}
                      </span>
                    ))}
                  </section>
                )}
                {creative.length != 0 && (
                  <section className={styles.list__item}>
                    <h4>Creatieve hulp</h4>
                    {creative.map((item) => (
                      <span className={item.completed ? `${styles.completed}` : ``} key={item.id}>
                        <span>
                          {item.amount} {item.name}
                        </span>
                        ,{' '}
                      </span>
                    ))}
                  </section>
                )}
                {divers.length != 0 && (
                  <section className={styles.list__item}>
                    <h4>Andere hulp</h4>
                    {divers.map((item) => (
                      <span className={item.completed && `${styles.completed}`} key={item.id}>
                        <span>
                          {item.amount} {item.name}
                        </span>
                        ,{' '}
                      </span>
                    ))}
                  </section>
                )}
              </div>
            </div>
            <div className={styles.footer}>
              {project.state !== 4 && <ProjectHelp text={'Hulp aanbieden'} project={project} />}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default ProjectRequirementsServices;
