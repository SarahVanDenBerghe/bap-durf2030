import React, { useRef } from 'react';
import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { useStores } from '../../hooks/useStores';
import { useRouter } from 'next/router';
import { ROUTES } from '../../consts/index';
import styles from './Header.module.scss';
import Link from 'next/link';
import { Button } from '../UI';

import ButtonUI from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const Header = observer(() => {
  const headerBanner = useRef();
  const { uiStore } = useStores();
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    const result = await uiStore.logoutUser();
    router.push(ROUTES.home);
  };

  useEffect(() => {
    if (uiStore.currentUser) {
      console.log(uiStore.currentUser);
    } else {
      console.log('no current user');
    }

    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      if (currentScrollPos < 300) {
        headerBanner.current.classList.add(styles.header__dark);
      } else {
        headerBanner.current.classList.remove(styles.header__dark);
      }
    };

    if (window.location.pathname === '/') {
      window.addEventListener('scroll', handleScroll);
    }
  });

  return (
    <>
      <div className={styles.header} ref={headerBanner}>
        <div className={styles.header__left}>
          <img src="/logo.svg" alt="logo DURF2030" width="45" height="60" />
          <nav className={styles.menu}>
            <Link href="/projecten">
              <span className={styles.menu__item}>Alle projecten</span>
            </Link>
            <Link href="/admin">
              <span className={styles.menu__item}>Kalender</span>
            </Link>
            <Link href="/">
              <span className={styles.menu__item}>Nieuws</span>
            </Link>

            <Button text="Maak project aan" href="/maak-project" />
          </nav>
        </div>
        <div className={styles.header__right}>
          {!uiStore.currentUser ? (
            <Link href="/login">
              <span className={styles.menu__item}>Inloggen</span>
            </Link>
          ) : (
            <>
              <svg
                className={styles.admin__notif}
                width="20"
                height="23"
                viewBox="0 0 20 23"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.4825 15.9408C17.1132 14.7834 16.3289 13.0962 16.3289 11.3072V8.78475C16.3289 5.601 13.9633 2.96837 10.9025 2.52748V1.55243C10.9025 1.05218 10.4956 0.649447 9.99955 0.649447C9.50355 0.645208 9.09657 1.04795 9.09657 1.54819V2.52324C6.03152 2.96837 3.67021 5.601 3.67021 8.78475V11.3072C3.67021 13.0962 2.88593 14.7877 1.51239 15.9492C1.16052 16.2502 0.957031 16.6869 0.957031 17.149C0.957031 18.0223 1.665 18.7302 2.53831 18.7302H17.4608C18.3341 18.7302 19.0421 18.0223 19.0421 17.149C19.0463 16.6869 18.8428 16.2502 18.4825 15.9408Z"
                  fill="#0C1424"
                />
                <path
                  d="M9.99714 22.3506C11.6335 22.3506 13.0071 21.1848 13.3208 19.6375H6.67773C6.99145 21.1848 8.36075 22.3506 9.99714 22.3506Z"
                  fill="#0C1424"
                />
              </svg>
              {uiStore.currentUser.admin === true ? (
                <Link href="/admin">
                  <svg
                    className={styles.admin__icon}
                    width="23"
                    height="23"
                    viewBox="0 0 23 23"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.94131 2.99275C10.434 0.961888 13.323 0.961888 13.8157 2.99275C13.8896 3.29785 14.0345 3.58117 14.2386 3.81967C14.4428 4.05817 14.7003 4.24511 14.9903 4.36526C15.2803 4.48542 15.5946 4.53539 15.9076 4.51113C16.2206 4.48686 16.5234 4.38904 16.7914 4.22562C18.576 3.13848 20.6195 5.18091 19.5324 6.96659C19.3692 7.23451 19.2716 7.53715 19.2473 7.84992C19.2231 8.16269 19.2731 8.47675 19.3931 8.76659C19.5131 9.05643 19.6998 9.31386 19.938 9.51796C20.1763 9.72205 20.4593 9.86706 20.7641 9.94119C22.795 10.4339 22.795 13.3229 20.7641 13.8156C20.459 13.8895 20.1757 14.0344 19.9372 14.2385C19.6987 14.4426 19.5118 14.7002 19.3916 14.9902C19.2715 15.2802 19.2215 15.5945 19.2457 15.9075C19.27 16.2205 19.3678 16.5233 19.5313 16.7913C20.6184 18.5758 18.576 20.6194 16.7903 19.5323C16.5224 19.3691 16.2197 19.2714 15.907 19.2472C15.5942 19.223 15.2801 19.2729 14.9903 19.393C14.7004 19.513 14.443 19.6997 14.2389 19.9379C14.0348 20.1761 13.8898 20.4592 13.8157 20.764C13.323 22.7949 10.434 22.7949 9.94131 20.764C9.86739 20.4589 9.72247 20.1756 9.51835 19.9371C9.31424 19.6986 9.05669 19.5116 8.76668 19.3915C8.47666 19.2713 8.16237 19.2214 7.84939 19.2456C7.53641 19.2699 7.23359 19.3677 6.96556 19.5311C5.18103 20.6183 3.13744 18.5758 4.22458 16.7902C4.38777 16.5222 4.48544 16.2196 4.50965 15.9068C4.53386 15.5941 4.48392 15.28 4.36391 14.9902C4.2439 14.7003 4.05719 14.4429 3.81895 14.2388C3.58072 14.0347 3.2977 13.8897 2.99288 13.8156C0.96201 13.3229 0.96201 10.4339 2.99288 9.94119C3.29797 9.86726 3.58129 9.72235 3.81979 9.51823C4.0583 9.31412 4.24523 9.05657 4.36538 8.76655C4.48554 8.47654 4.53551 8.16225 4.51125 7.84927C4.48698 7.53629 4.38916 7.23346 4.22574 6.96543C3.1386 5.18091 5.18103 3.13732 6.96671 4.22446C8.12324 4.92763 9.62211 4.30542 9.94131 2.99275Z"
                      stroke="#0C1424"
                      strokeWidth="1.15653"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11.8788 15.3479C13.795 15.3479 15.3484 13.7945 15.3484 11.8783C15.3484 9.96214 13.795 8.40875 11.8788 8.40875C9.96257 8.40875 8.40918 9.96214 8.40918 11.8783C8.40918 13.7945 9.96257 15.3479 11.8788 15.3479Z"
                      stroke="#0C1424"
                      strokeWidth="1.15653"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              ) : (
                ''
              )}
              <div>
                <ButtonUI
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                  onClick={handleClick}
                >
                  <img
                    className={styles.menu__pfp}
                    src={uiStore.currentUser.avatar}
                    width="50"
                    height="50"
                    alt="Avatvar icoon gebruiker"
                  />
                </ButtonUI>
                <Menu
                  className={styles.submenu}
                  id="simple-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>Mijn profiel</MenuItem>
                  <MenuItem onClick={handleClose}>Instellingen</MenuItem>
                  <MenuItem onClick={handleLogout}>Afmelden</MenuItem>
                </Menu>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
});

export default Header;
