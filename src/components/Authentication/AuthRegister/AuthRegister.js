import { useState } from 'react';
import { useRouter } from 'next/router';
import { useStores } from '../../../hooks/useStores';
import { ROUTES } from '../../../consts/index';
import Link from 'next/link';
import styles from '../Authentication.module.scss';
import { Container, HeaderForm } from '../../Layout';
import User from '../../../models/User';
import { AuthRegisterUser, AuthRegisterOrganisation } from '../../Authentication';
import { Formiz, useForm, FormizStep } from '@formiz/core';

const RegisterForm = () => {
  const registerForm = useForm();
  const { userStore, uiStore } = useStores();

  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (values) => {
    console.log(values);
    console.log(password);

    const user = new User({
      name: values.name,
      store: userStore,
      email: values.email,
      password: password,
      admin: false,
      organisation: values.organisation ?? 'individu',
    });

    console.log(user);

    const result = await uiStore.registerUser(user);
    if (result.uid) {
      router.push(ROUTES.home);
    }
  };

  return (
    <>
      <HeaderForm />
      <Container>
        <div className={styles.auth__img}></div>
        <section className={styles.auth}>
          <div className={styles.auth__wrapper}>
            <h1 className={styles.title}>Registreer</h1>

            <Formiz connect={registerForm} onValidSubmit={handleSubmit}>
              <form className={styles.form} noValidate onSubmit={registerForm.submitStep}>
                <FormizStep name="step1">
                  <AuthRegisterUser password={password} setPassword={setPassword} />
                </FormizStep>
                <FormizStep name="step2">
                  <AuthRegisterOrganisation />
                </FormizStep>

                <div className={styles.buttons}>
                  {registerForm.isLastStep ? (
                    <button className={styles.form__btn} type="submit" disabled={!registerForm.isValid}>
                      Maak account
                    </button>
                  ) : (
                    <button
                      className={`${styles.form__btn} ${styles.buttonSubmit}`}
                      type="submit"
                      disabled={!registerForm.isStepValid}
                    >
                      Volgende stap
                    </button>
                  )}
                </div>
              </form>

              {registerForm.isFirstStep && (
                <p className={styles.redirect}>
                  Heb je al een account?{' '}
                  <Link href="/login">
                    <span>Log in</span>
                  </Link>
                </p>
              )}
            </Formiz>
          </div>
        </section>
      </Container>
    </>
  );
};

export default RegisterForm;
