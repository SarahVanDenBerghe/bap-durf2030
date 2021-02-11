import { observer } from 'mobx-react-lite';
import { useState, useEffect } from 'react';
import styles from './EditRequirements.module.scss';
import { EditPart, EditLabel, EditItemIcons, EditField, EditOfferList } from '..';
import { FormFieldInput, FormFieldSwitch, FormFieldAddItem } from '../../Create';
import { SERVICETYPES, MATERIALTYPES } from '../../../consts';
import InputAdornment from '@material-ui/core/InputAdornment';

const EditRequirements = observer(({ project }) => {
  const [servicesRequired, setServicesRequired] = useState(project.servicesRequired);
  const [materialsRequired, setMaterialsRequired] = useState(project.materialsRequired);
  const [fundingRequired, setFundingRequired] = useState(project.fundingRequired);

  const [servicesOffers, setServicesOffers] = useState([]);
  const [materialsOffers, setMaterialsOffers] = useState([]);

  useEffect(() => {
    let servicesOffersArr = [];
    let materialsOffersArr = [];

    project.durvers.forEach((durver) => {
      let servicesOffersByUser = [];
      let materialsOffersByUser = [];

      durver.offers.forEach((offer) => {
        if (offer.type === 'material') {
          materialsOffersByUser.push(offer);
        } else if (offer.type === 'service') {
          servicesOffersByUser.push(offer);
        }
      });

      if (servicesOffersByUser.length > 0) {
        servicesOffersArr.push({
          durver: durver.user,
          list: servicesOffersByUser,
          timestamp: durver.timestamp,
        });
      }

      if (materialsOffersByUser.length > 0) {
        materialsOffersArr.push({
          durver: durver.user,
          list: materialsOffersByUser,
          timestamp: durver.timestamp,
        });
      }
    });

    setServicesOffers(servicesOffersArr);
    setMaterialsOffers(materialsOffersArr);
  }, []);

  const updateItems = (updatedItems, originalItems, type) => {
    updatedItems.forEach((updatedItem) => {
      if (updatedItem.id) {
        originalItems.forEach((dbItem) => {
          if (updatedItem.id == dbItem.id && updatedItem.amount !== dbItem.amount) {
            // UPDATE
            project.updateRequirementItem(updatedItem, dbItem.id);
          }
        });
      } else {
        // CREATE
        project.createRequirementItem(updatedItem, type);
      }
    });
    originalItems.forEach((dbItem) => {
      const item = updatedItems.find((updatedItem) => updatedItem.id === dbItem.id);
      if (!item) {
        // DELETE
        project.removeRequirementItem(dbItem);
      }
    });
  };

  const handleSaveServices = (values) => {
    if (values.services) {
      updateItems(values.services, project.services, 'service');
    }
    project.updateRequirementDetails(values);
  };

  const handleSaveMaterials = (values) => {
    if (values.materials) {
      updateItems(values.materials, project.materials, 'material');
    }
    project.updateRequirementDetails(values);
  };

  const handleSaveFunding = (values) => {
    project.updateRequirementDetails(values);
  };

  const handleCompleteItem = (item) => {
    project.updateItemStatus(item.id, !item.completed, item.type);
  };

  return (
    <>
      <EditPart title="Vrijwilligers" handleSaveProject={handleSaveServices}>
        <EditField row>
          <EditLabel text="Heeft je project nood aan extra hulp?" htmlFor="servicesRequired" />
          <div className={styles.form__switch}>
            <span className={styles.place__label}>Nee</span>
            <FormFieldSwitch
              name="servicesRequired"
              label="servicesRequired"
              setToggleValue={setServicesRequired}
              defaultValue={project.servicesRequired}
            />
            <span className={styles.place__label}>Ja</span>
          </div>
        </EditField>

        {servicesRequired && (
          <>
            <EditField>
              <EditLabel text="Leg het doel uit" htmlFor="servicesDescription" />
              <FormFieldInput
                defaultValue={project.servicesDescription}
                multiline
                rows={5}
                name="servicesDescription"
                required
              />
            </EditField>
            <EditField>
              <div className={styles.label__wrapper}>
                <EditLabel text="Vrijwilligers" htmlFor="services" />
                <EditItemIcons text="vrijwilliger" />
              </div>
              <FormFieldAddItem
                completeOption
                setComplete={handleCompleteItem}
                name="services"
                options={SERVICETYPES}
                textRow
                defaultValue={project.services}
                label="Soort vrijwilliger toevoegen"
              />
            </EditField>
            <EditOfferList project={project} offers={servicesOffers} />
          </>
        )}
      </EditPart>

      <EditPart title="Materialen" handleSaveProject={handleSaveMaterials}>
        <EditField row>
          <EditLabel text="Heeft je project nood aan extra materialen?" htmlFor="materialsRequired" />
          <div className={styles.form__switch}>
            <span className={styles.place__label}>Nee</span>
            <FormFieldSwitch
              name="materialsRequired"
              label="materialsRequired"
              setToggleValue={setMaterialsRequired}
              defaultValue={project.materialsRequired}
            />
            <span className={styles.place__label}>Ja</span>
          </div>
        </EditField>

        {materialsRequired && (
          <>
            <EditField>
              <EditLabel text="Leg het doel uit" htmlFor="materialsDescription" />
              <FormFieldInput
                defaultValue={project.materialsDescription}
                multiline
                rows={5}
                name="materialsDescription"
                required
              />
            </EditField>
            <EditField>
              <div className={styles.label__wrapper}>
                <EditLabel text="Materialen" htmlFor="materials" />
                <EditItemIcons text="materiaal" />
              </div>
              <FormFieldAddItem
                name="materials"
                completeOption
                setComplete={handleCompleteItem}
                options={MATERIALTYPES}
                textRow
                defaultValue={project.materials}
                label="Materiaal toevoegen"
              />
            </EditField>

            <EditOfferList project={project} offers={materialsOffers} />
          </>
        )}
      </EditPart>

      <EditPart title="Donatie" handleSaveProject={handleSaveFunding}>
        <EditField row>
          <EditLabel text="Heeft je project nood aan extra geld?" htmlFor="fundingRequired" />
          <div className={styles.form__switch}>
            <span className={styles.place__label}>Nee</span>
            <FormFieldSwitch
              name="fundingRequired"
              label="fundingRequired"
              setToggleValue={setFundingRequired}
              defaultValue={project.fundingRequired}
            />
            <span className={styles.place__label}>Ja</span>
          </div>
        </EditField>

        {fundingRequired && (
          <>
            <EditField>
              <EditLabel text="Leg het doel uit" htmlFor="fundingDescription" />
              <FormFieldInput
                defaultValue={project.fundingDescription}
                multiline
                rows={5}
                name="fundingDescription"
                required
              />
            </EditField>
            <EditField>
              <EditLabel text="Budget" htmlFor="fundingDescription" />
              <FormFieldInput
                defaultValue={project.fundingAmount}
                type="number"
                name="fundingAmount"
                InputProps={{
                  inputProps: { min: 1, max: 3000 },
                  startAdornment: <InputAdornment position="start">€</InputAdornment>,
                }}
                required
              />
            </EditField>
          </>
        )}
      </EditPart>
    </>
  );
});

export default EditRequirements;
