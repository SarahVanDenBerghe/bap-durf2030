import { useState } from 'react';
import styles from './FormPartOne.module.scss';
import { FormFieldInput, FormFieldSelect, FormFieldSwitch } from '../index';
import { Grid } from '../../Layout';

const FormPartOne = () => {
  const [isKnownPlace, setIsKnownPlace] = useState(false);

  return (
    <>
      <h2 className={styles.title}>Laten we starten met de basis</h2>

      {/* Titel */}
      <h3 className={styles.subtitle}>Geef je project een titel</h3>
      <FormFieldInput name="title" label="Titel" required />
      <h3 className={styles.subtitle}>Project plaats</h3>
      <p>
        Een project kan enkel doorgaan in Kortrijk en omstreken. Dit adres dient als startpunt voor je project, dit kan
        je later nog wijzigen.
      </p>

      {/* Plaats */}
      <div className={styles.place}>
        <p>Weet je in welke stad je project doorgaat?</p>
        <div>
          <span className={styles.place__label}>Nee</span>
          <FormFieldSwitch
            name="isKnownPlace"
            label="isKnownPlace"
            setToggleValue={setIsKnownPlace}
            defaultValue={false}
          />
          <span className={styles.place__label}>Ja</span>
        </div>
      </div>

      {/* Steden */}
      {isKnownPlace && (
        <>
          <FormFieldSelect name="city" label="Stad" options={['Kortrijk', 'Izegem']} defaultValue="Kortrijk" />
          <Grid>
            <div className={styles.textfield__street}>
              <FormFieldInput name="street" label="Straat (optioneel)" />
            </div>
            <div className={styles.textfield__number}>
              <FormFieldInput name="number" label="Nr (optioneel)" />
            </div>
          </Grid>
        </>
      )}
    </>
  );
};

export default FormPartOne;