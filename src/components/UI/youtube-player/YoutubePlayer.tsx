import { FC } from 'react';

interface YoutubePlayerProps {
  videoId: string;
  width?: string;
  height?: string;
  thumbnailQuality?: 'hqdefault' | 'mqdefault' | 'sddefault' | 'maxresdefault';
}

const YoutubePlayer: FC<YoutubePlayerProps> = ({
  videoId,
  width,
  height,
  thumbnailQuality = 'maxresdefault',
}) => {
  return (
    <iframe
      title="Youtube"
      aria-hidden="true"
      width={width}
      height={height}
      allow="autoplay; encrypted-media;"
      allowFullScreen
      srcDoc={`<style>*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}span{height:1.5em;text-align:center;font:48px/1.5 sans-serif;color:white;text-shadow:0 0 0.5em black}</style><a href=https://www.youtube.com/embed/${videoId}/?autoplay=1><img src=https://img.youtube.com/vi/${videoId}/${thumbnailQuality}.jpg alt=''><span>▶</span></a>`}
    ></iframe>
  );
};

export default YoutubePlayer;
