import { observer } from 'mobx-react-lite';
import { useStores } from '../../../hooks/useStores';
import styles from './OwnAwards.module.scss';

const OwnAwards = observer(({ projects }) => {
  const { uiStore } = useStores();

  return (
    <>
      <div className={styles.awards__badges}>
        <div className={styles.awards}>
          <h1 className={styles.title}>Behaalde Awards</h1>
          {uiStore.currentUser && (
            <div className={styles.list}>
              {uiStore.currentUser.awards.map((award) => (
                <div key={award.name} className={styles.list__item}>
                  <img
                    className={styles.icon}
                    src={award.img}
                    alt="icon"
                    width="80"
                    height="80"
                  />
                  <span>{award.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.badges}>
          <h1 className={styles.title}>Behaalde Badges</h1>
          <div className={styles.list}>
            {projects.length > 5 ? (
              <div className={styles.list__item}>
                <img
                  className={styles.icon}
                  src="/badges-awards/h2.png"
                  alt="icon"
                  width="80"
                  height="80"
                />
                <span>Liker - level 2</span>
              </div>
            ) : projects.length > 1 ? (
              <div className={styles.list__item}>
                <img
                  className={styles.icon}
                  src="/badges-awards/h1.png"
                  alt="icon"
                  width="80"
                  height="80"
                />
                <span>Liker - level 1</span>
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    </>
  );
});

export default OwnAwards;
