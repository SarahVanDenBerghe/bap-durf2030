import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStores } from '../../../hooks/useStores';
import styles from './ProjectHelp.module.scss';
import { Modal, Button } from '../../UI';
import { Grid } from '../../Layout';
import Durver from '../../../models/Durver';
import { Formiz, useForm, FormizStep } from '@formiz/core';
import {
  ProjectHelpOne,
  ProjectHelpTwoMaterial,
  ProjectHelpTwoFunding,
  ProjectHelpTwoService,
  ProjectHelpThree,
} from '../../Project';

const ProjectHelp = observer(({ project, text }) => {
  const durverForm = useForm();
  const { projectStore, uiStore } = useStores();
  const [open, setOpen] = useState(false);
  const [servicesRequired, setServicesRequired] = useState(false);
  const [materialsRequired, setMaterialsRequired] = useState(false);
  const [fundingRequired, setFundingRequired] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getName = (id) => {
    const service = project.services.find((service) => service.id === id);
    if (service) {
      return service.name;
    } else {
      return 'undefined';
    }
  };

  const handleSubmit = async (values) => {
    const offers = [];
    if (values.materials) {
      values.materials.forEach((material) => {
        if (material.count > 0) {
          offers.push({
            id: material.id,
            count: material.count,
            name: material.name,
            type: 'material',
          });
        }
      });
    }

    if (values.items) {
      Object.keys(values.items).forEach((key) => {
        if (values.items[key] === true) {
          offers.push({
            id: key,
            count: 1,
            type: 'service',
            name: getName(key),
          });
        }
      });
    }
    const newDurver = new Durver({
      message: values.message ?? '',
      user: uiStore.currentUser,
      offers: offers,
      fundingAmount: values.fundingAmount ?? '',
      fundingOffered: values.fundingRequired ?? false,
      materialsOffered: values.materialsRequired ?? false,
      servicesOffered: values.servicesRequired ?? false,
    });

    project.createDurver(newDurver);
    setOpen(false);
  };

  return (
    <>
      <Modal open={open} handleClose={handleClose}>
        <Grid>
          <div className={styles.img}>
            <div />
          </div>

          <div className={styles.text}>
            <Formiz connect={durverForm} onValidSubmit={handleSubmit}>
              <form noValidate onSubmit={durverForm.submitStep}>
                <FormizStep name="step1">
                  <ProjectHelpOne
                    setFundingRequired={setFundingRequired}
                    fundingRequired={fundingRequired}
                    setMaterialsRequired={setMaterialsRequired}
                    materialsRequired={materialsRequired}
                    setServicesRequired={setServicesRequired}
                    servicesRequired={servicesRequired}
                    project={project}
                  />
                </FormizStep>

                <FormizStep name="step2" isEnabled={materialsRequired}>
                  <ProjectHelpTwoMaterial name="materials" project={project} materials={project.materials} />
                </FormizStep>

                <FormizStep name="step3" isEnabled={servicesRequired}>
                  <ProjectHelpTwoService project={project} services={project.services} />
                </FormizStep>

                <FormizStep name="step4" isEnabled={fundingRequired}>
                  <ProjectHelpTwoFunding project={project} />
                </FormizStep>

                <FormizStep name="step5">
                  <ProjectHelpThree />
                </FormizStep>

                <div className={styles.buttons}>
                  {!durverForm.isFirstStep && (
                    <button className={styles.button} type="button" onClick={durverForm.prevStep}>
                      Vorige
                    </button>
                  )}
                  {durverForm.isLastStep ? (
                    <button className={styles.button} type="submit" disabled={!durverForm.isValid}>
                      Versturen
                    </button>
                  ) : (
                    <button
                      className={`${styles.button} ${styles.buttonSubmit}`}
                      type="submit"
                      disabled={!durverForm.isStepValid}
                    >
                      Volgende
                    </button>
                  )}
                </div>
              </form>
            </Formiz>
          </div>
        </Grid>
      </Modal>
      {!uiStore.currentUser ? (
        <Button text={text} href="/login" />
      ) : (
        <Button className={styles.button} onClick={handleOpen} text={text} />
      )}
    </>
  );
});

export default ProjectHelp;
