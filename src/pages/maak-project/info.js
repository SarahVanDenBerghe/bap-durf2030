import { useRouter } from 'next/router';
import { ROUTES } from '../../consts/index';
import { Container } from '../../components/Layout';
import styles from './CreateProject.module.scss';
import { Button } from '../../components/UI';
import { OnboardingOne, FormOne } from '../../components/Create';
import { useState } from 'react';

const CreateProjectInfo = () => {
  const [activeStep, setActiveStep] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    if (activeStep != 0) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  const handleStart = () => {
    router.push(ROUTES.create);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <OnboardingOne />;
      case 1:
        return 'Volgende onboarding';
      case 2:
        return 'Laatste onboarding';
      default:
        return 'Unknown step';
    }
  };

  return (
    <>
      <div className={styles.create}>
        <Container>
          <div className={styles.image}>Image</div>
          <div className={styles.content}>
            <div className={styles.text}>
              <h1 className={styles.title}>Dien jouw projectidee in, hoe zot het ook is</h1>
              <p className={styles.intro}>
                Momenteel loopt een oproep waarbij we projecten rond eenzaamheid stimuleren. Heb jij een ander idee? Dat
                is perfect mogelijk!
              </p>

              {getStepContent(activeStep)}
            </div>
            <div className={styles.navigate}>
              <Button onClick={handleBack} text={'Terug'} />
              <ul className={styles.steps}>
                <li className={`${styles.step} ${activeStep == 0 && styles.active}`} />
                <li className={`${styles.step} ${activeStep == 1 && styles.active}`} />
                <li className={`${styles.step} ${activeStep == 2 && styles.active}`} />
              </ul>
              {activeStep < 2 ? (
                <Button onClick={handleNext} text={'Volgende'} />
              ) : (
                <Button onClick={handleStart} text={'Maak project'} />
              )}
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default CreateProjectInfo;