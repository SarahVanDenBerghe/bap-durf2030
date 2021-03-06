import styles from './FormPartThree.module.scss';
import { FormFieldInput, FormFieldRichTextEditor, FormFieldWrapper } from '../index';

const FormPartThree = () => {
  return (
    <>
      <FormFieldWrapper>
        <h2 className={styles.title}>Beschrijving</h2>
        <p className={styles.info}>In welke categorie(ën) bevindt jouw project? Meerdere selecties zijn mogelijk.</p>
      </FormFieldWrapper>

      <FormFieldWrapper>
        <h3 className={styles.subtitle}>Beschrijf jouw project aan het publiek</h3>
        <p className={styles.info}>
          Noteer wat je project inhoudt. Deel mee welke positieve impact je teweeg wilt brengen.
        </p>
        <FormFieldRichTextEditor name="description" defaultValue="" />
      </FormFieldWrapper>

      <FormFieldWrapper>
        <h3 className={styles.subtitle}>Vat je project kort samen</h3>
        <p className={styles.info}>Beschrijf je project kort samen, dit wordt gezien op de overzichtspagina.</p>
        <FormFieldInput name="intro" label="Samenvatting" required />
      </FormFieldWrapper>
    </>
  );
};

export default FormPartThree;
