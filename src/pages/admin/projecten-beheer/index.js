import { useStores } from '../../../hooks/useStores';
import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import styles from './ProjectManagement.module.scss';
import { Button } from '../../../components/UI';
import { ROUTES } from '../../../consts/index';
import Sidebar from '../../../components/Admin/Sidebar/Sidebar';
import { DataGrid } from '@material-ui/data-grid';
import Link from 'next/link';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

const ProjectManagement = observer(() => {
  const { projectStore } = useStores();
  const [projects, setProjects] = useState([]);
  const [liveProjects, setLiveProjects] = useState([]);
  const [finishedProjects, setFinishedProjects] = useState([]);
  const [newProjects, setNewProjects] = useState([]);

  let id = 0;

  useEffect(() => {
    if (projectStore.projects.length === 0) {
      projectStore.loadAllProjects().then(() => setProjects(projectStore.projects));
    } else {
      const projectsArr = [];
      projectStore.projects.forEach((project) => {
        !projectsArr.find((existingProject) => existingProject.id === project.id) && projectsArr.push(project);
      });
      setProjects(projectsArr);
    }
  }, [projectStore, projectStore.projects]);

  useEffect(() => {
    if (projects.length > 0 && liveProjects.length === 0 && finishedProjects.length === 0 && newProjects.length === 0) {
      let liveArr = [];
      let finishedArr = [];
      let newArr = [];

      projects.forEach((project) => {
        id++;
        const timestamp =
          typeof project.timestamp === 'string' ? project.timestamp : project.getReadableDate(project.timestamp);

        let projectObj = {
          id: id,
          projectName: [project.title, project.id],
          creationDate: timestamp,
          projectContact: project.contact,
        };

        project.state !== 0 &&
          project.state !== 4 &&
          !liveArr.find((existingProject) => existingProject.id === project.id) &&
          !liveProjects.find((existingProject) => existingProject.id === project.id) &&
          liveArr.push(projectObj);
        project.state === 4 &&
          !finishedArr.find((existingProject) => existingProject.id === project.id) &&
          !finishedProjects.find((existingProject) => existingProject.id === project.id) &&
          finishedArr.push(projectObj);
        project.state === 0 &&
          !newArr.find((existingProject) => existingProject.id === project.id) &&
          !newProjects.find((existingProject) => existingProject.id === project.id) &&
          newArr.push(projectObj);
      });

      setNewProjects(newArr);
      setLiveProjects(liveArr);
      setFinishedProjects(finishedArr);
    }
  }, [projects]);

  const columns = [
    { field: 'id', headerName: 'id', width: 50 },
    {
      field: 'projectName',
      headerName: 'Project',
      width: 450,
      renderCell: (params) => (
        <a>
          <Link href={`${ROUTES.adminProject.to}${params.value[1]}`}>
            <p>{params.value[0]}</p>
          </Link>
        </a>
      ),
    },
    { field: 'creationDate', headerName: 'Indienmoment', width: 200 },
    {
      field: 'projectContact',
      headerName: 'Contacteer',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <a href={`mailto:${params.value}`}>
          <img className={styles.icon} src="/icons/email.svg" alt="email icon" width="25" height="25" />
        </a>
      ),
    },
  ];

  return (
    <>
      <div className={styles.admin}>
        <Sidebar />
        <section className={styles.content}>
          <div className={styles.header}>
            <div className={styles.header__left}>
              <h1 className={styles.title}>Projectenbeheer</h1>
              <span>{projects.length} resultaten</span>
            </div>
            <Button text={'Filteren'} />
          </div>

          <Tabs
            className={styles.container}
            selectedTabClassName={styles.selected}
            selectedTabPanelClassName={styles.table}
          >
            <TabList className={styles.tabs}>
              <Tab className={styles.tab}>
                <p>Lopend</p>
                <p className={styles.number}>{liveProjects.length}</p>
              </Tab>
              <Tab className={styles.tab}>
                <p>Afgerond</p>
                <p className={styles.number}>{finishedProjects.length}</p>
              </Tab>
              <Tab className={styles.tab}>
                <p>Nieuw</p>
                <p className={styles.number}>{newProjects.length}</p>
              </Tab>
            </TabList>

            <div>
              <TabPanel>
                <DataGrid rows={liveProjects} columns={columns} pageSize={10} />
              </TabPanel>

              <TabPanel>
                <DataGrid rows={finishedProjects} columns={columns} pageSize={10} />
              </TabPanel>

              <TabPanel>
                <DataGrid rows={newProjects} columns={columns} pageSize={10} />
              </TabPanel>
            </div>
          </Tabs>
        </section>
      </div>
    </>
  );
});

export default ProjectManagement;
