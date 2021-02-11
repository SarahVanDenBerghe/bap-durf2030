import { observer } from 'mobx-react-lite';
import styles from './ProjectCard.module.scss';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ROUTES } from '../../../consts/index';
import { ProjectLikes, ProjectHelpers, ProjectIcons } from '../';
import LinesEllipsis from 'react-lines-ellipsis';
import LinearProgress from '@material-ui/core/LinearProgress';

const ProjectCard = observer(({ project }) => {
  const [fundingCount, setFundingCount] = useState(0);
  let tags = [];

  useEffect(() => {
    let fundingCountNew = 0;

    project.durvers.forEach((item) => {
      if (item.fundingOffered === true) {
        const number = parseInt(item.fundingAmount);
        fundingCountNew = fundingCountNew + number * 2;
      }
    });
    setFundingCount(fundingCountNew);
  }, [project.durvers]);

  Object.keys(project.categories).forEach((key) => {
    if (project.categories[key] === true) {
      tags.push(key);
    }
  });

  return (
    <Link href={ROUTES.detail.to + project.id}>
      <a className={styles.card}>
        <div className={styles.thumbnail}>
          {project.state !== 4 && <ProjectIcons project={project} />}
          <img className={styles.image} src={project.image.url} alt="project header image" />
          {project.fundingRequired && project.state !== 1 && project.state !== 4 && (
            <div className={styles.progress}>
              <LinearProgress variant="determinate" value={fundingCount / 100} />
            </div>
          )}
        </div>

        <div className={styles.content}>
          <div className={styles.content__wrapper}>
            <p className={styles.date}>
              {typeof project.timestamp === 'string' ? project.timestamp : project.getReadableDate(project.timestamp)}
            </p>
            <h3 className={styles.title}>{project.title}</h3>
            <div className={styles.intro}>
              <LinesEllipsis text={project.intro} maxLine="3" ellipsis="..." trimRight basedOn="letters" />
            </div>

            <ul className={styles.tags}>
              {tags.map((tag) => (
                <li key={tag} className={styles.tag}>
                  {tag}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.stats}>
            <ProjectLikes project={project} small />
            {project.durvers.length != 0 && <ProjectHelpers small project={project} />}
          </div>
        </div>
      </a>
    </Link>
  );
});

export default ProjectCard;
