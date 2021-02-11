import { observer } from 'mobx-react-lite';
import styles from './ProjectFooter.module.scss';
import { Container } from '../../Layout';
import { Button } from '../../UI';
import { useStores } from '../../../hooks/useStores';

const ProjectFooter = observer(({ project }) => {
  const { uiStore } = useStores();
  return (
    <>
      <article className={styles.footer}>
        <h2 className="hidden">Contacteer contactpersoon</h2>
        <Container className={styles.container}>
          <div className={styles.contact}>
            {!uiStore.currentUser ? (
              <Button text="Mail contactpersoon" />
            ) : (
              <a href={`mailto:${project.contact}`}>
                <Button text="Mail contactpersoon" />
              </a>
            )}
            <p>Stuur een mail naar het contactpersoon van dit project</p>
          </div>
          <p className={styles.date}>
            {typeof project.timestamp === 'string' ? project.timestamp : project.getReadableDate(project.timestamp)}
          </p>
        </Container>
      </article>
    </>
  );
});

export default ProjectFooter;
