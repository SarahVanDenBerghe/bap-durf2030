import styles from './Notification.module.scss';
import { ROUTES } from '../../../consts';
import Link from 'next/link';
import { getReadableDate } from '../../../stores';

const Notification = ({ notification }) => {
  const offerTexts = {
    service: 'wilt vrijwilliger worden voor',
    material: 'wilt materiaal uitlenen voor',
    funding: 'heeft geld gedoneerd voor',
  };

  const getText = () => {
    switch (notification.type) {
      case 'badge':
        return (
          <p>
            Je hebt de{' '}
            <strong>
              level {notification.info.level} {notification.info.badge}
            </strong>{' '}
            badge verdiend! {notification.info.tag}
          </p>
        );
      case 'offer':
        return (
          <p>
            {notification.info.user.name}{' '}
            {notification.info.offers.length === 1 ? offerTexts[notification.info.offers[0]] : 'wilt meehelpen aan'}{' '}
            <strong>{notification.info.project.title}</strong>
          </p>
        );
    }
  };

  const getLink = () => {
    switch (notification.type) {
      case 'badge':
        return ROUTES.profile;
      case 'offer':
        return ROUTES.edit.to + notification.info.project.id;
    }
  };

  const getImage = () => {
    switch (notification.type) {
      case 'badge':
        return notification.info.image;
      case 'offer':
        return notification.info.user.avatar;
      default:
        return 'Unknown step';
    }
  };

  return (
    <Link href={getLink()}>
      <a className={`${styles.notification} ${!notification.read && styles.unread}`}>
        <img height="35px" width="35px" src={getImage()} />
        <div className={styles.text}>
          {getText()}
          <p className={styles.date}>
            {typeof notification.timestamp === 'string'
              ? notification.timestamp
              : getReadableDate(notification.timestamp)}
          </p>
        </div>
      </a>
    </Link>
  );
};
export default Notification;
