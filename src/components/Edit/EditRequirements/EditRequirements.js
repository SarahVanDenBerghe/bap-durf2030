import { useState } from 'react';
import styles from './EditRequirements.module.scss';
import { EditPart, EditLabel, EditItemIcons } from '..';
import { FormFieldInput, FormFieldSelect, FormFieldAddItem } from '../../Create';
import { SERVICETYPES, MATERIALTYPES } from '../../../consts';

const EditRequirements = ({ project }) => {
  console.log(project);
  const handleSaveProject = (values) => {
    console.log(values);
    values.services.forEach((service) => {
      if (service.id) {
        project.services.forEach((dbService) => {
          if (service.id == dbService.id) {
            // UPDATE
            // console.log(service.amount); // zelfde (model)
            // console.log(dbService.amount); // zelfde
          }
        });
      } else {
        // CREATE
        console.log('create'); // ok!!
      }
    });
    project.services.forEach((dbService) => {
      // DELETE
      // Indien dbService.id niet gevonden in
      console.log('delete');
    });
  };

  return (
    <>
      <EditPart title="Diensten" handleSaveProject={handleSaveProject}>
        <div className={styles.field__wrapper}>
          <EditLabel text="Leg het doel uit" htmlFor="servicesDescription" />
          <FormFieldInput defaultValue={project.servicesDescription} multiline rows={5} name="title" required />
        </div>
        <div className={styles.field__wrapper}>
          <div className={styles.label__wrapper}>
            <EditLabel text="Diensten" htmlFor="servicesDescription" />
            <EditItemIcons text="dienst" />
          </div>
          <FormFieldAddItem
            name="services"
            options={SERVICETYPES}
            textRow
            defaultValue={project.services}
            label="Dienst toevoegen"
          />
        </div>
      </EditPart>

      <EditPart title="Materialen" handleSaveProject={handleSaveProject}>
        <div className={styles.field__wrapper}>
          <EditLabel text="Leg het doel uit" htmlFor="servicesDescription" />
          <FormFieldInput defaultValue={project.servicesDescription} name="title" required />
        </div>
        <div className={styles.field__wrapper}>
          <div className={styles.label__wrapper}>
            <EditLabel text="Materialen" htmlFor="materialsDescription" />
            <EditItemIcons text="materiaal" />
          </div>
          <FormFieldAddItem
            name="services"
            options={MATERIALTYPES}
            textRow
            defaultValue={project.materials}
            label="Materiaal toevoegen"
          />
        </div>
      </EditPart>
    </>
  );
};

export default EditRequirements;