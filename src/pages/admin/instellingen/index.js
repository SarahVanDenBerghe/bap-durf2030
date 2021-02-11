import { useStores } from '../../../hooks/useStores';
import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import styles from './Settings.module.scss';
import Sidebar from '../../../components/Admin/Sidebar/Sidebar';
import TextField from '@material-ui/core/TextField';

const Settings = observer(() => {
  const { userStore } = useStores();
  const [email, setEmail] = useState('');
  const [error, setError] = useState(' ');
  const [admins, setAdmins] = useState([]);

  const getAdmins = () => {
    let adminsArr = [];
    userStore.users.forEach((user) => {
      if (user.admin === true) {
        adminsArr.push(user);
      }
    });
    setAdmins(adminsArr);
  };

  useEffect(() => {
    if (userStore.users.length === 0) {
      userStore.loadAllUsers().then(() => {
        getAdmins();
      });
    } else {
      getAdmins();
    }
  }, [userStore.users]);

  const handleDeleteAdmin = (user) => {
    userStore.updateAdmin(false, user);
    let updatedAdmins = [];

    admins.forEach((admin) => {
      if (admin.email !== user.email) {
        updatedAdmins.push(admin);
      }
    });

    setAdmins(updatedAdmins);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = userStore.users.find((user) => user.email === email);
    if (user) {
      userStore.updateAdmin(true, user);
      setAdmins([user, ...admins]);
      const err = '';
      setError(err);
    } else {
      const err = 'Admin niet gevonden';
      setError(err);
    }
  };

  return (
    <>
      <div className={styles.admin}>
        <Sidebar />
        <section className={styles.content}>
          <div className={styles.header}>
            <div className={styles.header__left}>
              <h1 className={styles.title}>Instellingen</h1>
            </div>
          </div>

          <section className={styles.admins__list}>
            <h2 className={styles.subtitle}>Alle admins</h2>
            <div className={styles.users}>
              {admins.map((user) => (
                <div key={user.id} className={styles.user}>
                  <div className={styles.user__info}>
                    <img className={styles.image} src={user.avatar} alt="profile picture of user" />
                    <p>{user.name}</p>
                  </div>
                  <button className={styles.delete} onClick={() => handleDeleteAdmin(user)}>
                    <img src="/icons/delete-red.svg" />
                    <span className="hidden">Verwijder</span>
                  </button>
                </div>
              ))}
            </div>
          </section>
          <section className={styles.admins__add}>
            <h2 className={styles.subtitle}>Voeg admin toe</h2>
            <p className={styles.error}>{error}</p>
            <form className={styles.form} onSubmit={handleSubmit}>
              <TextField
                className={styles.textfield}
                fullWidth
                id="outlined-basic"
                label="Voeg admin toe"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
              />
              <input className={styles.form__btn} type="submit" value="Toevoegen" />
            </form>
          </section>
        </section>
      </div>
    </>
  );
});

export default Settings;
