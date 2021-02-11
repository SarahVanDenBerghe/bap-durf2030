import { observer } from 'mobx-react-lite';
import styles from './TabOwners.module.scss';
import { SectionPart } from '../index';
import { Button } from '../../../UI';

const TabOwners = observer(({ project }) => {
  return (
    <>
      <div className={styles.overview}>
        <SectionPart title="Organisatoren">
          <h3 className={styles.subtitle}>Alle organisatoren</h3>
          <div className={styles.owners}>
            {project.owners.map((owner, i) => (
              <div key={i} className={styles.owner}>
                <img className={styles.image} src={owner.avatar} alt="project header image" />
                <span className={styles.owner__name}>{owner.name}</span>
              </div>
            ))}
          </div>
        </SectionPart>
        <SectionPart title="Contacteer">
          <h3 className={styles.subtitle}>Contacteer de project organisatoren</h3>
          <a href={`mailto:${project.contact}`}>
            <Button text="Mail contactpersoon" />
          </a>
        </SectionPart>
      </div>
    </>
  );
});

export default TabOwners;
