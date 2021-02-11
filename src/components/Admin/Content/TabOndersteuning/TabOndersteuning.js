import { observer } from 'mobx-react-lite';
import styles from './TabOndersteuning.module.scss';
import { SectionPart } from '../index';

const TabOndersteuning = observer(({ project }) => {
  return (
    <>
      <div className={styles.overview}>
        <SectionPart title="Vrijwilligers">
          {project.servicesRequired ? (
            <>
              <h3 className={styles.subtitle}>Opsomming</h3>
              {project.services.length != 0 ? (
                <>
                  {project.services.map((service, i) => (
                    <div key={i} className={styles.item}>
                      <span className={styles.item__amount}>{service.amount}</span>
                      <span className={styles.item__name}>{service.name}</span>
                    </div>
                  ))}
                </>
              ) : (
                'Geen soorten vrijwilligers opgegeven'
              )}
              <h3 className={styles.subtitle}>Verantwoording</h3>
              {project.servicesDescription != '' ? (
                <p className={styles.frame}>{project.servicesDescription}</p>
              ) : (
                'Er is geen verantwoording gegeven.'
              )}
            </>
          ) : (
            'Dit project vraagt geen extra vrijwillers aan.'
          )}
        </SectionPart>
        <SectionPart title="Materialen">
          {project.materialsRequired ? (
            <>
              <h3 className={styles.subtitle}>Opsomming</h3>
              {project.materials.length != 0 ? (
                <>
                  {project.materials.map((material, i) => (
                    <div key={i} className={styles.item}>
                      <span className={styles.item__amount}>{material.amount}</span>
                      <span className={styles.item__name}>{material.name}</span>
                    </div>
                  ))}
                </>
              ) : (
                'Geen materialen opgegeven'
              )}
              <h3 className={styles.subtitle}>Verantwoording</h3>
              {project.materialsDescription != '' ? (
                <p className={styles.frame}>{project.materialsDescription}</p>
              ) : (
                'Er is geen verantwoording gegeven.'
              )}
            </>
          ) : (
            'Dit project vraagt geen extra materiaal aan.'
          )}
        </SectionPart>

        <SectionPart title="Donaties">
          {project.fundingRequired ? (
            <>
              <h3 className={styles.subtitle}>Budget</h3>
              {project.fundingAmount != '' ? (
                <p className={styles.frame}>€{project.fundingAmount}</p>
              ) : (
                'Er is geen bedrag opgegeven'
              )}
              <h3 className={styles.subtitle}>Verantwoording</h3>
              {project.fundingDescription != '' ? (
                <p className={styles.frame}>{project.fundingDescription}</p>
              ) : (
                'Er is geen verantwoording gegeven.'
              )}
            </>
          ) : (
            'Dit project heeft geen nood aan crowdfunding.'
          )}
        </SectionPart>
      </div>
    </>
  );
});

export default TabOndersteuning;
