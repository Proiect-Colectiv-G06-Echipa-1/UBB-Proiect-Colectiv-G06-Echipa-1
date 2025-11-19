import { Link } from 'react-router-dom';
import './QuestCard.css';

interface QuestCardProps {
  id: number;
  title: string;
  created: string;
  deadline: string;
  count: number;
}

export const QuestCard = ({ id, title, created, deadline, count }: QuestCardProps) => {
  return (
    <Link to={`/task/${id}`} className='quest-card-link'>
      <div className="quest-card">
        <div className="badge">{count}</div>
          <div className="content">
            <h4>{title}</h4>
            <div className="meta">
            <div>Created: {created}</div>
            <div>Deadline: {deadline}</div>
          </div>
        </div>
      </div>
    </Link>
  );
};