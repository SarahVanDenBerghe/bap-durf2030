import styles from './ProjectContent.module.scss';
import { ProjectDescription, ProjectRequirements, ProjectDurvers, ProjectShare, ProjectUpdates } from '../../Project';
import { Container } from '../../Layout';
import { TabPanel, AppBar, TabSideElement, Badge } from '../../UI';
import Tab from '@material-ui/core/Tab';

const ProjectContent = ({ project, users, tab, setTab }) => {
  return (
    <>
      <AppBar value={tab} setValue={setTab}>
        <Tab label="Overview" />
        <Tab
          label={
            <div className={styles.updates}>
              <span>Updates</span> <Badge text={project.updates.length} />
            </div>
          }
        />
        <Tab label="Nodige Hulp" />
        <Tab label="Durvers" />
        <TabSideElement>
          <ProjectShare />
        </TabSideElement>
      </AppBar>

      <TabPanel className={styles.panel} value={tab} index={0}>
        <div className={styles.letters__description}>
          <Container>
            <ProjectDescription project={project} users={users} />
          </Container>
        </div>
      </TabPanel>
      <TabPanel className={styles.panel} value={tab} index={1}>
        <div className={project.updates.length > 0 ? styles.letters : ''}>
          <Container>
            <ProjectUpdates updates={project.updates} />
          </Container>
        </div>
      </TabPanel>
      <TabPanel className={styles.panel} value={tab} index={2}>
        <div className={styles.letters}>
          <Container>
            <ProjectRequirements project={project} />
          </Container>
        </div>
      </TabPanel>
      <TabPanel className={styles.panel} value={tab} index={3}>
        <div className={project.durvers.length > 0 ? styles.letters : ''}>
          <Container>
            <ProjectDurvers project={project} />
          </Container>
        </div>
      </TabPanel>
    </>
  );
};

export default ProjectContent;
