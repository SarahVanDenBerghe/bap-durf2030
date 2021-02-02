import styles from '../ProjectRequirements/ProjectRequirements.module.scss';
import { useEffect } from 'react';
import { useState } from 'react';
import { useStores } from '../../../hooks/useStores';
import { Container } from '../../Layout';
import { Button } from '../../UI';
import { ProjectHelpers } from '../../Project';

const ProjectRequirementsServices = ({ services, info }) => {
  const { projectStore } = useStores();

  const [physical, setPhysical] = useState([]);
  const [creative, setCreative] = useState([]);
  const [divers, setDivers] = useState([]);

  useEffect(() => {
    let physicalArr = [];
    let creativeArr = [];
    let diversArr = [];

    const loadServices = async () => {
      services.forEach((service) => {
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
          <div className={`${styles.circle} ${styles.service}`} />
          <div className={styles.content}>
            <h2 className={styles.title}>Diensten</h2>
            <div className={styles.wrapper}>
              <p>{info.servicesDetails.description}</p>
              <div className={styles.list}>
                {physical.length != 0 && (
                  <article className={styles.list__item}>
                    <h3>Fysieke hulp</h3>
                    {physical.map((item) => (
                      <span
                        className={item.completed ? `${styles.completed}` : ``}
                        key={item.id}
                      >
                        <span>
                          {item.amount} {item.name}
                        </span>
                        ,{' '}
                      </span>
                    ))}
                  </article>
                )}
                {creative.length != 0 && (
                  <article className={styles.list__item}>
                    <h3>Creatieve hulp</h3>
                    {creative.map((item) => (
                      <span
                        className={item.completed ? `${styles.completed}` : ``}
                        key={item.id}
                      >
                        <span>
                          {item.amount} {item.name}
                        </span>
                        ,{' '}
                      </span>
                    ))}
                  </article>
                )}
                {divers.length != 0 && (
                  <article className={styles.list__item}>
                    <h3>Andere hulp</h3>
                    {divers.map((item) => (
                      <span
                        className={item.completed ? `${styles.completed}` : ``}
                        key={item.id}
                      >
                        <span>
                          {item.amount} {item.name}
                        </span>
                        ,{' '}
                      </span>
                    ))}
                  </article>
                )}
              </div>
            </div>
            <div className={styles.footer}>
              <ProjectHelpers />
              <Button text={'Hulp aanbieden'} />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default ProjectRequirementsServices;
