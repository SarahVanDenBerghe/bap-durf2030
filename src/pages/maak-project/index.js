import { useRouter } from 'next/router';
import { ROUTES, THEMES, CATEGORIES } from '../../consts/index';
import { useEffect, useState } from 'react';
import { Container, HeaderForm } from '../../components/Layout';
import { Button } from '../../components/UI';
import { observer } from 'mobx-react-lite';
import styles from './CreateProject.module.scss';
import {
  FormPartOne,
  FormPartTwo,
  FormPartThree,
  FormPartFour,
  FormPartFive,
  FormPartSix,
  FormPartSeven,
  FormPartConfirm,
} from '../../components/Create';
import { Formiz, useForm, FormizStep } from '@formiz/core';
import { useStores } from '../../hooks/useStores';
import Project from '../../models/Project';
import LinearProgress from '@material-ui/core/LinearProgress';

const CreateProject = observer(() => {
  const [submitted, setSubmitted] = useState(false);
  const projectForm = useForm();
  const { projectStore, uiStore } = useStores();
  const router = useRouter();

  useEffect(() => {
    if (uiStore.currentUser === null) {
      router.push(ROUTES.login);
    }
  }, [uiStore.currentUser]);

  useEffect(() => {
    const name = projectForm.currentStep?.name;
    if (name === 'confirm' && !submitted) {
      projectForm.submit();
      setSubmitted(true);
    }
  }, [projectForm.currentStep]);

  const handleSubmit = async (values) => {
    let categoriesWithValues = {};
    let themesWithValues = {};

    CATEGORIES.forEach((category, i) => {
      const key = category.toLowerCase();
      categoriesWithValues[key] = values.categories[i];
    });

    THEMES.forEach((theme, i) => {
      const key = theme.toLowerCase();
      themesWithValues[key] = values.themes[i];
    });

    const project = new Project({
      about: values.about ?? '',
      fundingAmount: values.fundingAmount ?? '',
      fundingDescription: values.fundingDescription ?? '',
      fundingRequired: values.fundingRequired,
      categories: categoriesWithValues,
      city: values.city ?? '',
      contact: values.contact,
      description: values.description,
      image: {
        enabled: values.image ? true : false,
        name: values.image ? values.image.name : '',
        file: values.image ? values.image.file : '',
        url: '',
      },
      intro: values.intro,
      isKnownPlace: values.isKnownPlace,
      materials: values.materials ?? [],
      materialsDescription: values.materialsDescription ?? '',
      materialsRequired: values.materialsRequired,
      number: values.number ?? '',
      owners: values.owners ?? [],
      services: values.services ?? [],
      servicesDescription: values.servicesDescription ?? '',
      servicesRequired: values.servicesRequired,
      street: values.street ?? '',
      themes: themesWithValues,
      title: values.title,

      userId: uiStore.currentUser.id,
      store: projectStore,
    });

    const projectId = await projectStore.createProject(project);

    projectStore.createRequirementsForProject({
      requirements: {
        materials: project.materials,
        services: project.services,
      },
      info: {
        materialsRequired: project.materialsRequired,
        materialsDescription: project.materialsDescription ?? '',
        servicesRequired: project.servicesRequired,
        servicesDescription: project.servicesDescription ?? '',
        fundingRequired: project.fundingRequired,
        fundingAmount: project.fundingAmount ?? 0,
        fundingDescription: project.fundingDescription ?? '',
      },
      projectId: projectId,
    });

    // Hardcoded build hook
    var url = 'https://api.vercel.com/v1/integrations/deploy/prj_9FzkV3G1nYbDhZfUSbomI1uIi3jA/qlsToVUcvk';

    fetch(url, {
      headers: {
        dataType: 'json',
        'content-type': 'application/json',
      },
      method: 'POST',
      redirect: 'follow',
    })
      .then((response) => {
        if (response.status === 200) {
          console.log(response.text());
        } else {
          throw new Error('Something went wrong on api server!');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getButtonVariant = () => {
    if (projectForm.currentStep) {
      if (projectForm.currentStep.index + 1 < 7) {
        return 'secondary';
      } else {
        return '';
      }
    } else {
      return '';
    }
  };

  return (
    <>
      <HeaderForm close onCloseClick={() => router.push(ROUTES.home)} />
      <div className={styles.create}>
        <Container>
          <div className={styles.image__wrapper}>
            <img
              className={styles.image}
              alt="maak project"
              src={`./create/create-${projectForm.currentStep ? projectForm.currentStep.index + 1 : 1}.png`}
            />
            <div className={styles.progress__wrapper}>
              <LinearProgress
                className={styles.progress}
                variant="determinate"
                value={((projectForm.currentStep && projectForm.currentStep.index + 1) / 8) * 100}
              />
            </div>
          </div>
          <div className={styles.content}>
            {!projectForm.isLastStep && (
              <p className={styles.step}>Stap {projectForm.currentStep && projectForm.currentStep.index + 1} / 7</p>
            )}
            <Formiz connect={projectForm} onValidSubmit={handleSubmit}>
              <form noValidate onSubmit={projectForm.submitStep}>
                <FormizStep name="step1">
                  <FormPartOne />
                </FormizStep>
                <FormizStep name="step2">
                  <FormPartTwo />
                </FormizStep>
                <FormizStep name="step3">
                  <FormPartThree />
                </FormizStep>
                <FormizStep name="step4">
                  <FormPartFour />
                </FormizStep>
                <FormizStep name="step5">
                  <FormPartFive />
                </FormizStep>
                <FormizStep name="step6">
                  <FormPartSix />
                </FormizStep>
                <FormizStep name="step7">
                  <FormPartSeven />
                </FormizStep>
                <FormizStep name="confirm">
                  <FormPartConfirm />
                </FormizStep>

                {!projectForm.isLastStep && (
                  <div className={styles.buttons}>
                    {!projectForm.isFirstStep && (
                      <Button text="Vorige" type="button" variant="secondary" onClick={projectForm.prevStep} />
                    )}
                    {projectForm.currentStep && projectForm.currentStep.index + 1 === 7 ? (
                      <Button
                        text="Project indienen"
                        type="submit"
                        variant={getButtonVariant()}
                        disabled={!projectForm.isStepValid}
                      />
                    ) : (
                      <Button
                        text="Volgende"
                        type="submit"
                        variant={getButtonVariant()}
                        disabled={!projectForm.isStepValid}
                      />
                    )}
                  </div>
                )}
              </form>
            </Formiz>
          </div>
        </Container>
      </div>
    </>
  );
});

export default CreateProject;
