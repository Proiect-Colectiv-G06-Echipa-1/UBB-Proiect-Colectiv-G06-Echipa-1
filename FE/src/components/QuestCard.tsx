import './QuestCard.css';

interface QuestCardProps {
  title: string;
  created: string;
  deadline: string;
  count: number;
}

export const QuestCard = ({ title, created, deadline, count }: QuestCardProps) => {
  return (
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
  );
};