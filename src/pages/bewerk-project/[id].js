import { observer } from 'mobx-react-lite';
import { useState, useEffect } from 'react';
import { useStores } from '../../hooks/useStores';
import { ROUTES } from '../../consts';
import { Container } from '../../components/Layout';
import { Button, TabPanel, AppBar, TabSideElement } from '../../components/UI';
import { EditBasis, EditRequirements, EditOwners, EditUpdates, EditState } from '../../components/Edit';
import { Header, Footer } from '../../components/Layout';
import styles from './EditProject.module.scss';
import Tab from '@material-ui/core/Tab';

const EditProject = observer(({ query }) => {
  const id = query.id;
  const { projectStore } = useStores();
  const [value, setValue] = useState(0);

  const STATE_LOADING = 'loading';
  const STATE_DOES_NOT_EXIST = 'doesNotExist';
  const STATE_LOADING_MORE_DETAILS = 'loadingMoreDetails';
  const STATE_FULLY_LOADED = 'fullyLoaded';

  const [project, setProject] = useState(projectStore.getProjectById(id));
  const [state, setState] = useState(project ? STATE_LOADING_MORE_DETAILS : STATE_LOADING);

  useEffect(() => {
    const loadProject = async (id) => {
      try {
        const resolvedProject = await projectStore.loadProject(id);
        if (!resolvedProject) {
          setState(STATE_DOES_NOT_EXIST);
          return;
        }
        !resolvedProject.containsAllData && resolvedProject.getAllDynamicContent();
        resolvedProject.getOwners();
        setState(STATE_FULLY_LOADED);
        setProject(resolvedProject);
      } catch (error) {
        console.log('Project failed loading');
      }
    };
    loadProject(id);
  }, [id, projectStore]);

  return (
    <>
      <Header />
      {project && (
        <section className={styles.edit}>
          <Container>
            <div className={styles.header}>
              <h1 className={styles.title}>Bewerk project</h1>
              <p className={styles.title__project}>{project.title}</p>
            </div>
          </Container>

          <AppBar value={value} setValue={setValue}>
            <Tab label="Basis Informatie" />
            <Tab label="Ondersteuningen" />
            <Tab label="Organisatoren" />
            <Tab label="Updates" />
            <Tab label="Status" />
            <TabSideElement>
              <Button href={ROUTES.detail.to + project.id} text={'Bekijk project'} />
            </TabSideElement>
          </AppBar>

          <Container>
            <TabPanel value={value} index={0}>
              <EditBasis project={project} />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <EditRequirements project={project} />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <EditOwners project={project} />
            </TabPanel>
            <TabPanel value={value} index={3}>
              <EditUpdates project={project} />
            </TabPanel>
            <TabPanel value={value} index={4}>
              <EditState project={project} />
            </TabPanel>
          </Container>
        </section>
      )}
      <Footer />
    </>
  );
});

EditProject.getInitialProps = ({ query }) => {
  return { query };
};

export default EditProject;
