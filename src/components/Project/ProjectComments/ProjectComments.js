import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { useStores } from '../../../hooks/useStores';
import { Container } from '../../Layout';
import styles from './ProjectComments.module.scss';
import ProjectComment from './ProjectComment';
import Comment from '../../../models/Comment';

const ProjectComments = observer(({ project, comments }) => {
  const { uiStore, projectStore } = useStores();
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content !== '') {
      const newComment = new Comment({
        content,
        project,
        user: uiStore.currentUser,
      });
      projectStore.sendComment(newComment);
      setContent('');
    }
  };

  return (
    <Container>
      <article className={styles.comments}>
        <h2 className={styles.title}>Comments</h2>

        {project.comments.length !== 0 ? (
          <div className={styles.comments__wrapper}>
            {project.comments.map((comment) => (
              <ProjectComment
                key={comment.id}
                comment={comment}
                date={
                  typeof comment.timestamp === 'string' ? comment.timestamp : project.getReadableDate(comment.timestamp)
                }
              />
            ))}
          </div>
        ) : (
          <div>
            <p>Geen commments</p>
          </div>
        )}
      </article>

      <div className={styles.create}>
        {uiStore.currentUser && (
          <>
            <p className={styles.title}>Laat een bericht achter</p>
            <form onSubmit={handleSubmit}>
              <label className={styles.label}>
                <span className={'hidden'}>Bericht</span>
                <textarea
                  className={styles.textinput}
                  placeholder="Type een bericht..."
                  name="comment"
                  cols="50"
                  rows="5"
                  required
                  value={content}
                  onChange={(e) => setContent(e.currentTarget.value)}
                />
              </label>
              <input className={styles.submit} type="submit" value="Verzenden" />
            </form>
          </>
        )}
      </div>
    </Container>
  );
});

export default ProjectComments;
