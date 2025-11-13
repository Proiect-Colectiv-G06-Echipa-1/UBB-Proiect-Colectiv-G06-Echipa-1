// src/components/DependencyTree.tsx
import { DependencyNode } from './dependencyNode';
import type { TreeNode } from '../lib/types';
import styles from './DependencyTree.module.css';

interface Props {
  node: TreeNode;
}

export function DependencyTree({ node }: Props) {
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className={styles.treeContainer}>
      
      <div className={styles.nodeWrapper}>
        <DependencyNode 
          node={node} 
          variant={node.title === 'Raytracer' ? 'gray' : 'default'} 
        />
      </div>

      {hasChildren && <div className={styles.connector}></div>}

      {hasChildren && (
        <div className={styles.childrenColumn}>
          {node.children!.map((child) => (
            <div key={child.id} className={styles.childBranch}>
              <DependencyTree node={child} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}