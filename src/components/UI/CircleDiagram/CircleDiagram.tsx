import { FC } from 'react';
import styles from './CircleDiagram.module.css';

export interface ICircleDiagramData {
  id: number;
  color: string;
  value: number;
}

interface CircleDiagramProps {
  data: ICircleDiagramData[];
  width: number;
  height: number;
}

const CircleDiagram: FC<CircleDiagramProps> = ({ data, width, height }) => {
  const offsets: number[] = [];

  data.reduce((acc, _cur, index, _arr) => {
    acc += !!data[index - 1] && data[index - 1].value;
    offsets.push(acc);
    return acc;
  }, 0);

  const items = data.map((item, index) => {
    return (
      <circle
        className={styles.diagram_item}
        r="15.9"
        cx="50%"
        cy="50%"
        stroke={item.color}
        strokeDasharray={`${item.value}, 100`}
        strokeDashoffset={-1 * offsets[index]}
        key={item.id}
      />
    );
  });

  return (
    <svg viewBox="0 0 45 45" width={width} height={height}>
      {data.length > 0 ? (
        items
      ) : (
        <>
          <circle
            className={[
              styles.diagram_item,
              styles.diagram_item_placeholder,
            ].join(' ')}
            r="15.9"
            cx="50%"
            cy="50%"
            strokeDasharray="100, 100"
          />
          <text
            className={styles.text}
            x="50%"
            y="50%"
            textAnchor="middle"
            dy=".3em"
          >
            Нет данных
          </text>
        </>
      )}
    </svg>
  );
};

export default CircleDiagram;
