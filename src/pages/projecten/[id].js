import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Header, Footer } from '../../components/Layout';
import { ProjectHeader, ProjectContent, ProjectFooter, ProjectComments } from '../../components/Project';
import RootStore from '../../stores';
import { convertData } from '../../models/Project';
import { convertDataUser } from '../../models/User';
import { useStores } from '../../hooks/useStores';

const Project = observer(({ projectJSON, usersJSON }) => {
  const { projectStore, uiStore, userStore } = useStores();
  const [project, setProject] = useState();
  const [users, setUsers] = useState();
  const [projectOwner, setProjectOwner] = useState(false);
  const [tab, setTab] = useState(0);

  // Checks if current user is owner of this project
  useEffect(() => {
    const loadOwner = async () => {
      const currentUser = await uiStore.currentUser;
      if (project && currentUser) {
        const projectOwner = project.owners.find((owner) => owner.id === currentUser.id);
        if (projectOwner) {
          setProjectOwner(true);
        } else {
          setProjectOwner(false);
        }
      }
    };
    loadOwner();
  }, [uiStore.currentUser, project]);

  useEffect(() => {
    const projectInStore = projectStore.getProjectById(projectJSON.id);
    projectInStore && setProject(projectInStore);

    if (projectInStore && !projectInStore.containsAllData) {
      // Get dyanmic content
      projectInStore.getAllDynamicContent();

      // Push extra data that was SSR on detail in existing model
      projectInStore.setUpdates(projectJSON.updates);
      projectInStore.setOwners(projectJSON.owners);
      projectInStore.setAllDataLoaded(true);
    } else if (!projectInStore) {
      // Create a complete new Project model
      // Convert data received from SSR static props to a Project model
      const data = convertData.fromJSON(projectJSON, projectStore);

      // Set dyanmic content
      data.getAllDynamicContent();
      data.setAllDataLoaded(true);

      // Set project for this page
      setProject(data);
    }
  }, []);

  useEffect(() => {
    const usersArr = [];
    usersJSON.forEach((userJSON) => {
      const user = convertDataUser.fromJSON(userJSON, userStore);
      usersArr.push(user);
    });
    setUsers(usersArr);
  }, [uiStore.currentUser]);

  if (!project) {
    return <p>Project laden...</p>;
  }

  return (
    <>
      <Header />
      <ProjectHeader setTab={setTab} projectOwner={projectOwner} project={project} />
      <ProjectContent tab={tab} setTab={setTab} project={project} users={users} />
      <ProjectFooter project={project} />
      <ProjectComments project={project} comments={project.comments} />
      <Footer />
    </>
  );
});

// All possible paths will be looped over to create a SSR page
export const getStaticPaths = async () => {
  const store = new RootStore();
  const { projectStore } = store;
  const projects = await projectStore.projectService.getAll();
  const ids = projects.map((project) => project.id);
  const paths = ids.map((id) => ({ params: { id } }));

  return {
    paths,
    fallback: false,
  };
};

// Data for each possible path
export const getStaticProps = async ({ params }) => {
  const store = new RootStore();
  const { projectStore, userStore } = store;

  // Project data for SSR
  const data = await projectStore.loadProject(params.id);
  let projectJSON = convertData.toJSON(data);

  // Updates
  const updates = data.updates.map((update) => {
    return {
      user: update.user,
      text: update.text,
      timestamp: data.getReadableDate(update.timestamp),
    };
  });
  const timestamp = data.getReadableDate(data.timestamp);
  projectJSON.timestamp = timestamp;
  projectJSON.updates = updates;

  // Owners
  const ownersArr = await projectStore.loadProjectOwnersById(params.id);
  const owners = ownersArr.map((owner) => ({
    name: owner.name,
    avatar: owner.avatar,
    id: owner.id,
    email: owner.email ?? '',
  }));
  projectJSON['owners'] = owners;

  // Users
  await userStore.loadAllUsers();
  const usersJSON = userStore.users.map((data) => {
    let user = convertDataUser.toJSON(data);
    return user;
  });

  return {
    props: { projectJSON, usersJSON },
    revalidate: 600,
  };
};

export default Project;
