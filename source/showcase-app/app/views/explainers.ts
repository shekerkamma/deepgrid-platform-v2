// Animated explainers shown on the page they explain, not on Demonstrations (which holds the simulator runs and the
// silicon films, and whose films scripts/build-relations.mjs reads from films.tsx — so explainers live here).
// Served from this site. The humanoid film illustrates deepgridsemi.com's humanoid pipeline; it is not robot
// footage, and says so.
export const explainers = [
  {
    id: 'humanoid',
    title: 'The humanoid pipeline',
    sub: 'Perception, interpretation, planning and action, animated',
    length: '1:21',
    src: './media/humanoid.mp4',
    poster: './images/posters/humanoid.webp',
  },
];
