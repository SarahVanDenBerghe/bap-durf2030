import { observer } from 'mobx-react-lite';
import styles from './TabOverview.module.scss';
import { SectionPart } from '../index';
import { ParsedRichText, Button } from '../../../UI';
import { useEffect, useState } from 'react';

const TabOverview = observer(({ project }) => {
  const [image, setImage] = useState(undefined);
  let themes = [];
  let categories = [];

  Object.keys(project.themes).forEach((key) => {
    if (project.themes[key] === true) {
      themes.push(key);
    }
  });

  Object.keys(project.categories).forEach((key) => {
    if (project.categories[key] === true) {
      categories.push(key);
    }
  });

  const handleChangeState = (state) => {
    project.updateState(state);
  };

  useEffect(() => {
    if (project.image.enabled && project.image.url) {
      setImage(project.image.url);
    } else {
      setImage(`/${project.image.url}`);
    }
  }, []);

  return (
    <>
      <div className={styles.overview}>
        {project.state === 0 && (
          <SectionPart title="Status">
            <h3 className={styles.subtitle}>Controleer het project</h3>
            <div className={styles.section__status}>
              <p className={styles.descriptionn}>
                Kijk het project na en check of er geen ongepast taalgebruik gebruikt is, alvoorens het project live op
                het platform te zetten.
              </p>
              <Button text="Zet project live" onClick={() => handleChangeState(1)} />
            </div>
          </SectionPart>
        )}
        {project.state === 1 && (
          <SectionPart title="Status">
            <h3 className={styles.subtitle}>Keur het project goed</h3>
            <div className={styles.section__status}>
              <p className={styles.descriptionn}>
                Voldoet het project aan de vooropgestelde critearia van DURF2030? Geef het project de goedkeuring om
                naar de crowdfunding fase over te gaan.
              </p>
              <Button text="Zet crowdfunding aan" onClick={() => handleChangeState(2)} />
            </div>
          </SectionPart>
        )}
        <SectionPart title="Algemene Info">
          <h3 className={styles.subtitle}>Title</h3>
          <p className={styles.frame}>{project.title}</p>
          <h3 className={styles.subtitle}>Korte Samenvatting</h3>
          <p className={styles.frame}>{project.intro}</p>
          <h3 className={styles.subtitle}>Beschrijving</h3>
          <div className={styles.frame}>
            <ParsedRichText html={project.description} />
          </div>
        </SectionPart>
        <SectionPart title="Foto">
          <h3 className={styles.subtitle}>Header</h3>
          {project.image.url ? (
            <img className={styles.image} src={image} alt="project header image" />
          ) : (
            <p>Geen headerbeeld upgeload</p>
          )}
        </SectionPart>
        <SectionPart title="Tags">
          <div className={styles.section__wrapper}>
            <section>
              <h3 className={styles.subtitle}>Thema's</h3>
              {themes.length != 0 ? (
                <>
                  {themes.map((tag, i) => (
                    <span key={i} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </>
              ) : (
                'Geen themas gekozen'
              )}
            </section>
            <section>
              <h3 className={styles.subtitle}>Categoriënen</h3>
              {categories.length != 0 ? (
                <>
                  {categories.map((tag, i) => (
                    <span key={i} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </>
              ) : (
                'Geen themas gekozen'
              )}
            </section>
          </div>
        </SectionPart>
        <SectionPart title="Locatie">
          {project.isKnownPlace ? (
            <div className={styles.section__wrapper}>
              {project.city && (
                <section>
                  <h3 className={styles.subtitle}>Stad</h3>
                  <p>{project.city}</p>
                </section>
              )}
              {project.street && (
                <section>
                  <h3 className={styles.subtitle}>Straatnaam</h3>
                  <p>{project.street}</p>
                </section>
              )}
              {project.number && (
                <section>
                  <h3 className={styles.subtitle}>Huisnummer</h3>
                  <p>{project.number}</p>
                </section>
              )}
            </div>
          ) : (
            'Geen locatie opgegeven'
          )}
        </SectionPart>
      </div>
    </>
  );
});

export default TabOverview;
