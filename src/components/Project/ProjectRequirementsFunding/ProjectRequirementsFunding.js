import styles from '../ProjectRequirements/ProjectRequirements.module.scss';
import { Container } from '../../Layout';
import { Button } from '../../UI';
import { ProjectCircle, ProjectHelp } from '../';
import LinearProgress from '@material-ui/core/LinearProgress';

const ProjectRequirementsFunding = ({ project, progress, funding }) => {
  return (
    <>
      <section className={styles.requirement}>
        <Container>
          <ProjectCircle type="funding" progress={progress} large />
          <div className={styles.content}>
            <h3 className={styles.title}>Ingezameld geld</h3>
            <div className={styles.progress}>
              <div className={styles.text}>
                <p>&euro; {funding} ingezameld</p>
                <p>&euro; {project.fundingAmount}</p>
              </div>

              <LinearProgress variant="determinate" value={progress} />
            </div>
            <p>{project.fundingDescription}</p>
            <div className={styles.footer}>
              {project.state !== 4 ? (
                project.state > 1 ? (
                  <ProjectHelp text={'Doneren'} project={project} />
                ) : (
                  <p className={styles.info}>Het is nog niet mogelijk om geld te doneren</p>
                )
              ) : (
                ''
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default ProjectRequirementsFunding;
