import { useEffect, useState } from 'react';
import { Container, Grid, Header, Footer } from '../../components/Layout';
import { ProjectCard, ProjectRequirementsCard, ProjectFilter, RequirementFilter } from '../../components/Project';
import RootStore from '../../stores';
import styles from './Projects.module.scss';
import { convertData } from '../../models/Project';
import { useStores } from '../../hooks/useStores';
import { Button, TabPanel, AppBar, TabSideElement, Badge } from '../../components/UI';
import Tab from '@material-ui/core/Tab';
import Masonry from 'react-masonry-css';
import LinearProgress from '@material-ui/core/LinearProgress';

const Projects = ({ projectsJSON }) => {
  const { projectStore } = useStores();
  const [projects, setProjects] = useState([]);

  const [filteredProjects, setFilteredProjects] = useState([]);
  const [requirFilteredProjects, setRequirFilteredProjects] = useState([]);
  const [milestones, setMilestones] = useState(0);
  const [projectCount, setProjectCount] = useState(0);
  const [value, setValue] = useState(0);

  const [location, setLocation] = useState('none');
  const [theme, setTheme] = useState('none');
  const [cat, setCat] = useState('none');
  const [catService, setCatService] = useState('none');
  const [catMaterial, setCatMaterial] = useState('none');

  useEffect(() => {
    const projectsArr = projectsJSON.map((projectJSON) => {
      const project = convertData.fromJSON(projectJSON, projectStore);

      // Adding dynamic content to pre-rendered SSR data
      project.getLikes();
      project.getRequirementsInfo();
      project.getRequirementsList();
      project.getDurvers();
      return project;
    });

    setProjects(projectsArr);
  }, []);

  // Filter projects
  useEffect(() => {
    let filterArr = [];

    projects.forEach((project) => {
      if (project.categories[cat] === true) {
        const match = filterArr.find((filteredProject) => filteredProject.id === project.id);
        !match && filterArr.push(project);
      }

      if (project.themes[theme] === true) {
        const match = filterArr.find((filteredProject) => filteredProject.id === project.id);
        !match && filterArr.push(project);
      }

      if (project.city === location) {
        const match = filterArr.find((filteredProject) => filteredProject.id === project.id);
        !match && filterArr.push(project);
      }
    });

    setFilteredProjects(filterArr);
  }, [cat, theme, location, setFilteredProjects]);

  // Filter requirements
  useEffect(() => {
    let requirArr = [];

    projects.forEach((project) => {
      const projectService = project.services.find((service) => service.category === catService);
      if (projectService) {
        const match = requirArr.find((filteredProject) => filteredProject.id === project.id);
        !match && requirArr.push(project);
      }
    });

    projects.forEach((project) => {
      const projectMaterial = project.materials.find((material) => material.category === catMaterial);
      if (projectMaterial) {
        const match = requirArr.find((filteredProject) => filteredProject.id === project.id);
        !match && requirArr.push(project);
      }
    });

    setRequirFilteredProjects(requirArr);
  }, [catService, catMaterial, setRequirFilteredProjects]);

  // Filter milestones
  useEffect(() => {
    let milestonesArr = [];
    let projectsFound = 0;

    projects.forEach((project) => {
      // Current milestone theme
      if (project.themes['eenzaamheid rond corona'] === true) {
        milestonesArr.push(project);
      }

      if (project.state != 0 && project.state < 4) {
        projectsFound++;
      }
    });

    setMilestones(milestonesArr);
    setProjectCount(projectsFound);
  }, [projects]);

  const handleShowMilestones = () => {
    setTheme('eenzaamheid rond corona');
  };

  return (
    <>
      <Header />
      <section className={styles.milestones}>
        <Container>
          <div className={styles.content}>
            <h1 className={styles.title}>Samen pakken we eenzaamheid aan</h1>
            <p>
              De coronastorm woedt: we zitten in dezelfde storm maar niet in hetzelfde schuitje. Hoe kunnen we met een
              creatieve mindset hier via kunst en creativiteit een antwoord op bieden? DURF 2030 zoekt naar 40 projecten
              die eenzaamheid rond corona aanpakken.
            </p>
            <div className={styles.milestone__bar}>
              <LinearProgress variant="determinate" value={(milestones.length / 40) * 100} />
              <span>{milestones.length}</span>
            </div>

            <div className={styles.buttons}>
              <Button onClick={handleShowMilestones} text={'Bekijk deze projecten'} />
              <Button text={'Kom meer te weten'} variant="outline" />
            </div>
          </div>
        </Container>
      </section>

      <AppBar reverse value={value} setValue={setValue}>
        <Tab label="Lopende projecten" />
        <Tab label="Afgelopen projecten" />
        <Tab label="Ondersteuningen" />
        <TabSideElement>
          <h1 className={styles.title}>Projecten</h1>
          <Badge
            text={`${
              theme == 'none' && cat == 'none' && location == 'none' ? projectCount : filteredProjects.length
            } resultaten`}
          />
        </TabSideElement>
      </AppBar>

      <div className={styles.letters}>
        <Container>
          <TabPanel value={value} index={0}>
            <ProjectFilter
              location={location}
              setLocation={setLocation}
              theme={theme}
              setTheme={setTheme}
              cat={cat}
              setCat={setCat}
            />
            <Grid>
              {cat == 'none' && theme == 'none' && location == 'none' ? (
                projects.map((project) => {
                  if (project.state != 0 && project.state < 4) {
                    return <ProjectCard key={project.id} project={project} />;
                  }
                })
              ) : (
                <>
                  {filteredProjects.length != 0 ? (
                    filteredProjects.map((project) => {
                      if (project.state != 0 && project.state < 4) {
                        return <ProjectCard key={project.id} project={project} />;
                      }
                    })
                  ) : (
                    <div className={styles.empty__state}>
                      <img src="/vergrootglas.png" alt="empty state" width="600" height="300" />
                      <p>Sorry, er zijn geen project gevonden</p>
                    </div>
                  )}
                </>
              )}
            </Grid>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Grid>
              {projects.map((project) => {
                if (project.state === 4) {
                  return <ProjectCard key={project.id} project={project} />;
                }
              })}
            </Grid>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <RequirementFilter
              catService={catService}
              setCatService={setCatService}
              catMaterial={catMaterial}
              setCatMaterial={setCatMaterial}
            />
            <Masonry breakpointCols={2} className={styles.masonry} columnClassName={styles.column}>
              {catService == 'none' && catMaterial == 'none' ? (
                projects.map((project) => {
                  if (project.materialsRequired || project.servicesRequired) {
                    return <ProjectRequirementsCard key={project.id} project={project} />;
                  }
                })
              ) : (
                <>
                  {requirFilteredProjects.length != 0 ? (
                    requirFilteredProjects.map((project) => {
                      if (project.materialsRequired || project.servicesRequired) {
                        return <ProjectRequirementsCard key={project.id} project={project} />;
                      }
                    })
                  ) : (
                    <div className={styles.empty__state}>
                      <img
                        src="/vergrootglas.png"
                        alt="empty state"
                        width="1000"
                        height="300"
                      />
                      <p>Sorry, er zijn geen project gevonden</p>
                    </div>
                  )}
                </>
              )}
            </Masonry>
          </TabPanel>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export const getStaticProps = async (context) => {
  const store = new RootStore();
  const { projectStore } = store;

  // Data to SSR
  await projectStore.loadAllProjects();

  const projectsJSON = projectStore.projects.map((data) => {
    let project = convertData.toJSON(data);
    const timestamp = data.getReadableDate(data.timestamp);
    project.timestamp = timestamp;
    return project;
  });

  return {
    props: { projectsJSON },
    revalidate: 5,
  };
};

export default Projects;
