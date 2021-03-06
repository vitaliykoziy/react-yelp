import React from 'react';
import styles from './home.css';

export const MayLikeItemView = () => (
  <article className={`${styles.item} ${styles.col_4_in_row}`}>
    <header>
      <a href="#">
        <img src="http://www.mybusiness.com.au/images/technology/debbie-mayo-smith.jpg" alt="empty" />
      </a>
      <h1><a href="#">Are you wasting your time with Facebook?</a></h1>
    </header>
    <content>
      <div className={styles.date}>27 Jun 2016</div>
      <p>
        By Debbie Mayo-Smith / 27 Jun 2016
        It seems the whole marketing world is screaming “Facebook! Facebook!
        Facebook!” You’ll hear it everywhere: “You must be on Facebook ...
      </p>
      <div className={styles.readMore}>
        <a href="#">Read more</a>
      </div>
    </content>
  </article>
);
