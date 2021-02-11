import styles from '../ProjectRequirements/ProjectRequirements.module.scss';
import { useEffect, useState } from 'react';
import { useStores } from '../../../hooks/useStores';
import { Container } from '../../Layout';
import { Button } from '../../UI';
import { ProjectCircle, ProjectHelp } from '../';

const ProjectRequirementsMaterials = ({ project, progress }) => {
  const { projectStore } = useStores();

  const [bouw, setBouw] = useState([]);
  const [art, setArt] = useState([]);
  const [infra, setInfra] = useState([]);
  const [food, setFood] = useState([]);
  const [toys, setToy] = useState([]);
  const [divers, setDivers] = useState([]);

  useEffect(() => {
    let bouwArr = [];
    let artArr = [];
    let infraArr = [];
    let foodArr = [];
    let toyArr = [];
    let diversArr = [];

    const loadMaterial = async () => {
      project.materials.forEach((material) => {
        if (material.category === 'Bouwmateriaal') {
          bouwArr.push(material);
          setBouw(bouwArr);
        } else if (material.category === 'Eten & Drinken') {
          foodArr.push(material);
          setFood(foodArr);
        } else if (material.category === 'Infrastructuur') {
          infraArr.push(material);
          setInfra(infraArr);
        } else if (material.category === 'Knutselmateriaal') {
          artArr.push(material);
          setArt(artArr);
        } else if (material.category === 'Speelgoed') {
          toyArr.push(material);
          setToy(toyArr);
        } else if (material.category === 'Andere') {
          diversArr.push(material);
          setDivers(diversArr);
        }
      });
    };
    loadMaterial();
  }, [projectStore, setBouw, setArt, setFood, setInfra, setToy, setDivers]);

  return (
    <>
      <section className={styles.requirement}>
        <Container>
          <ProjectCircle type="material" progress={progress} large />
          <div className={styles.content}>
            <h3 className={styles.title}>Materiaal</h3>
            <div className={styles.wrapper}>
              <p>{project.materialsDescription}</p>

              <div className={styles.list}>
                {bouw.length != 0 && (
                  <section className={styles.list__item}>
                    <h4>Bouwmateriaal</h4>
                    {bouw.map((item) => (
                      <span className={item.completed ? `${styles.completed}` : ``} key={item.id}>
                        <span>
                          {item.amount} {item.name}
                        </span>
                        ,{' '}
                      </span>
                    ))}
                  </section>
                )}
                {food.length != 0 && (
                  <section className={styles.list__item}>
                    <h4>Eten &amp; Drinken</h4>
                    {food.map((item) => (
                      <span className={item.completed ? `${styles.completed}` : ``} key={item.id}>
                        <span>
                          {item.amount} {item.name}
                        </span>
                        ,{' '}
                      </span>
                    ))}
                  </section>
                )}
                {infra.length != 0 && (
                  <section className={styles.list__item}>
                    <h4>Infrastructuur</h4>
                    {infra.map((item) => (
                      <span className={item.completed ? `${styles.completed}` : ``} key={item.id}>
                        <span>
                          {item.amount} {item.name}
                        </span>
                        ,{' '}
                      </span>
                    ))}
                  </section>
                )}
                {art.length != 0 && (
                  <section className={styles.list__item}>
                    <h4>Knutselmateriaal</h4>
                    {art.map((item) => (
                      <span className={item.completed ? `${styles.completed}` : ``} key={item.id}>
                        <span>
                          {item.amount} {item.name}
                        </span>
                        ,{' '}
                      </span>
                    ))}
                  </section>
                )}
                {toys.length != 0 && (
                  <section className={styles.list__item}>
                    <h4>Speelgoed</h4>
                    {toys.map((item) => (
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
                      <span className={item.completed ? `${styles.completed}` : ``} key={item.id}>
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

export default ProjectRequirementsMaterials;
