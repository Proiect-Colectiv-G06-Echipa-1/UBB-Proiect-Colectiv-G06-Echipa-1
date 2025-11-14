import type { TreeNode } from '../lib/types';
import styles from './dependencyNode.module.css';

interface DependencyNodeProps {
  node: TreeNode;
  variant?: 'default' | 'gray'; 
}

export function DependencyNode({ node, variant = 'default' }: DependencyNodeProps) {
  
  const containerClass = variant === 'gray' 
    ? `${styles.nodeContainer} ${styles.variantGray}`
    : `${styles.nodeContainer} ${styles.variantDefault}`;

  return (
    <div className={containerClass}>
      <div className={styles.energyBadge}>
        {node.energy}
      </div>

      <div className={styles.content}>
        <h4 className={styles.title}>{node.title}</h4>
        
        <div className={styles.meta}>
          <span>
            Created: {node.created}
          </span>
          <span>
            Deadline: {node.deadline}
          </span>
        </div>
      </div>
    </div>
  );
}