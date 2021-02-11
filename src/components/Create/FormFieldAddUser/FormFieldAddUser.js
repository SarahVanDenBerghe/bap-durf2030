import { useState, useEffect } from 'react';
import { useField } from '@formiz/core';
import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { useStores } from '../../../hooks/useStores';
import styles from './FormFieldAddUser.module.scss';

const FormFieldAddUser = (props) => {
  const { errorMessage, id, isValid, isSubmitted, setValue, value } = useField(props);
  const { label, required, defaultValue, showCurrentUser } = props;
  const [isTouched, setIsTouched] = useState(false);
  const showError = !isValid && (isTouched || isSubmitted);

  const filter = createFilterOptions();
  const { userStore, uiStore } = useStores();
  const [owners, setOwners] = useState([]);
  const [users, setUsers] = useState([]);
  // const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    setValue(owners);
    console.log(owners);
  }, [owners]);

  useEffect(() => {
    if (defaultValue) {
      setOwners(defaultValue);
    }

    userStore.loadAllUsers();
  }, []);

  useEffect(() => {
    setUsers(userStore.users);
  }, [userStore.users]);

  useEffect(() => {
    if (uiStore.currentUser && showCurrentUser) {
      setOwners([
        ...owners,
        {
          name: uiStore.currentUser.name,
          id: uiStore.currentUser.id,
          avatar: uiStore.currentUser.avatar,
          email: uiStore.currentUser.email,
        },
      ]);
    }
  }, [uiStore.currentUser]);

  const addOwner = (newValue, input) => {
    // newValue = {inputValue: "Test", name: "Voeg "Test" toe"}
    if (input === 'custom') {
      // On hold
      // setOwners([...owners, { name: newValue.inputValue }]);
    } else if (input === 'data') {
      // newValue = User object
      setOwners([...owners, { name: newValue.name, id: newValue.id, avatar: newValue.avatar, email: newValue.email }]);

      // Remove from users array
      // const usersArr = users.map((user) => {
      //   if (user.id === newValue.id) {
      //     return;
      //   } else {
      //     return user;
      //   }
      // });
      // setUsers(usersArr);
    }
  };

  const removeOwner = (owner) => {
    let newOwners = owners.slice();
    newOwners = newOwners.filter((currentOwner) => {
      return currentOwner !== owner;
    });
    setOwners(newOwners);
  };

  return (
    <>
      {owners.map((owner, i) => {
        return (
          <div key={i} className={styles.item}>
            <div className={styles.text}>
              <p className={styles.name}>{owner.name}</p>
            </div>
            {owner.id !== uiStore.currentUser.id && (
              <button
                onClick={() => {
                  removeOwner(owner);
                }}
                className={styles.delete}
              >
                <img src="/icons/close-green.svg" />
              </button>
            )}
          </div>
        );
      })}

      <Autocomplete
        fullWidth
        // value={value}
        onChange={(event, newValue) => {
          if (newValue && newValue.inputValue) {
            addOwner(newValue, 'custom');
          } else {
            if (newValue) {
              addOwner(newValue, 'data');
            }
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);
          if (params.inputValue !== '') {
            filtered.push({
              inputValue: params.inputValue,
              name: `Voeg "${params.inputValue}" toe`,
            });
          }
          return filtered;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        id="owners"
        options={users}
        getOptionLabel={(option) => {
          if (typeof option === 'string') {
            return option;
          }
          if (option.inputValue) {
            return option.inputValue;
          }
          return option.name;
        }}
        // renderOption={(option) => option.name}
        // freeSolo
        clearOnBlur
        clearOnEscape
        renderInput={(params) => <TextField {...params} fullWidth label="Zoek een gebruiker" variant="outlined" />}
      />
    </>
  );
};

export default FormFieldAddUser;
