import styles from '../Authentication.module.scss';
import { useState } from 'react';
import Link from 'next/link';
import { AuthSocial } from '../../Authentication';
import { FormFieldInput } from '../../Create';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

const AuthRegisterUser = ({ password, setPassword }) => {
  const [values, setValues] = useState({
    password: '',
    showPassword: false,
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
    console.log(event.target.value);
    setPassword(event.target.value);
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <AuthSocial />
      <p>Of maak een account</p>
      <div className={styles.input__wrapper}>
        <FormFieldInput name="name" label="Volledige naam" required />
      </div>
      <div className={styles.input__wrapper}>
        <FormFieldInput name="email" label="Emailadres" required />
      </div>
      <div className={styles.input__wrapper}>
        <FormControl className={styles.textfield} variant="outlined" fullWidth>
          <InputLabel htmlFor="password">Wachtwoord</InputLabel>
          <OutlinedInput
            id="password"
            type={values.showPassword ? 'text' : 'password'}
            value={values.password}
            onChange={handleChange('password')}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {values.showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      </div>
    </>
  );
};

export default AuthRegisterUser;
