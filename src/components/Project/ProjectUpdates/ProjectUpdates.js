import styles from './ProjectUpdates.module.scss';
import { ParsedRichText } from '../../UI';
import { getReadableDate } from '../../../stores';

const ProjectUpdates = ({ updates }) => {
  return (
    <>
      <article className={styles.updates}>
        <h2 className="hidden">Updates</h2>
        {updates.length > 0 ? (
          updates.map((update, i) => (
            <section key={i} className={styles.update}>
              <p className={styles.date}>
                {typeof update.timestamp === 'string' ? update.timestamp : getReadableDate(update.timestamp)}
              </p>
              <div className={styles.text}>
                <ParsedRichText html={update.text} />
                <p className={styles.author}>Geschreven door {update.user.name}</p>
              </div>
            </section>
          ))
        ) : (
          <p>Er werden nog geen updates geplaatst.</p>
        )}
      </article>
    </>
  );
};

export default ProjectUpdates;
